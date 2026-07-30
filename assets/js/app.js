import { loadMilestones } from "./repositories/milestoneRepository.js";
import { loadProjects } from "./repositories/projectsRepository.js";
import { loadReleases } from "./repositories/releaseRepository.js";
import { loadTickets } from "./repositories/ticketRepository.js";
import { renderDashboardView } from "./views/dashboardView.js";
import { renderTicketsView } from "./views/ticketsView.js";
import { renderProjectsView } from "./views/projectsView.js";

const appState = {
  currentView: "dashboard",

  projects: [],
  activeProject: null,

  tickets: [],
  milestones: [],
  releases: [],
};

// Consider replacing DASHBOARD_CARD_BINDINGS with data-bind attributes on the cards in a future refactor.
const DASHBOARD_CARD_BINDINGS = {
  'Current Project': 'currentProject',
  Version: 'version',
  Sprint: 'currentSprint',
  'Current Ticket': 'currentTicket',
};

const STORAGE_KEYS = {
  activeProject: "activeProjectId",
};

/**
 * Finds an item in a collection by its id.
 *
 * @param {Array<object>} items The collection to search.
 * @param {string} id The item id.
 * @returns {object|undefined} The matching item, if present.
 */
function findById(items, id) {
  return Array.isArray(items) ? items.find((item) => item.id === id) : undefined;
}

/**
 * Calculates development progress from the current ticket collection.
 *
 * @param {Array<object>} tickets The available tickets.
 * @returns {{completedTickets: number, totalTickets: number, percentage: number}} Progress totals.
 */
function calculateDevelopmentProgress(tickets) {
  const ticketList = Array.isArray(tickets) ? tickets : [];
  const totalTickets = ticketList.length;
  const completedTickets = ticketList.filter((ticket) => ticket.status === 'completed').length;
  const percentage = totalTickets === 0 ? 0 : Math.round((completedTickets / totalTickets) * 100);

  return { completedTickets, totalTickets, percentage };
}

function renderCurrentView() {

  const app = document.getElementById("app");

  switch (appState.currentView) {

    case "dashboard":
      app.innerHTML = renderDashboardView();
      populateCurrentView();
      break;

    case "tickets":
      app.innerHTML = renderTicketsView(appState.tickets);
      break;

    case "projects":
      app.innerHTML = renderProjectsView(
        appState.projects,
        appState.activeProject
      );

      initialiseProjectSelection();

      break;

    default:
      app.innerHTML = `
        <section class="view">
          <h2>Coming Soon</h2>
          <p>This section hasn't been built yet.</p>
        </section>
      `;
  }
  updateActiveNavigation();

}

function initialiseProjectSelection() {

  document.querySelectorAll(".project-card").forEach((card) => {

    card.addEventListener("click", () => {

      const projectId = card.dataset.projectId;

      appState.activeProject =
        appState.projects.find(project => project.id === projectId) ?? null;

      localStorage.setItem(STORAGE_KEYS.activeProject, projectId);
      
      appState.currentView = "dashboard";

      renderCurrentView();

    });

  });

}

function initialiseNavigation() {
  document.querySelectorAll('.navigation-item').forEach((item) => {
    item.addEventListener('click', () => {
      appState.currentView = item.dataset.view;

      renderCurrentView();
    });
  });
}
/**
 * Resolves project references to their records so display values are derived
 * from one source of truth.
 *
 * @param {object} project The loaded project configuration.
 * @param {Array<object>} tickets The available tickets.
 * @param {Array<object>} milestones The available milestones.
 * @param {Array<object>} releases The available releases.
 * @returns {object} The project data with its related records.
 */
function createProjectModel(project, tickets, milestones, releases) {
  return {
    project,
    developmentProgress: calculateDevelopmentProgress(tickets),
    activeTicket: findById(tickets, project.activeTicketId),
    currentMilestone: findById(milestones, project.currentMilestone),
    currentRelease: Array.isArray(releases)
      ? releases.find((release) => release.version === project.currentRelease)
      : undefined,
  };
}

/**
 * Formats the active ticket for display while retaining the configured id if
 * its ticket record has not been added yet.
 *
 * @param {object|undefined} ticket The resolved ticket.
 * @param {string} ticketId The configured active ticket id.
 * @returns {string} The active ticket display value.
 */
function formatActiveTicket(ticket, ticketId) {
  if (!ticket) {
    return ticketId || '';
  }

  return ticket.title ? `${ticket.id} — ${ticket.title}` : ticket.id;
}

/**
 * Builds the values used by the existing dashboard fields.
 *
 * @param {object} model The project model and its related records.
 * @returns {object} Values keyed by dashboard binding name.
 */
function createDashboardValues(model) {
  const { project, activeTicket, developmentProgress } = model;

  return {
    name: project.name,
    currentProject: project.name,
    version: project.version,
    currentSprint: project.currentSprint,
    currentTicket: formatActiveTicket(activeTicket, project.activeTicketId),
    developmentProgressPercentage: `${developmentProgress.percentage}%`,
    developmentProgressTickets: `${developmentProgress.completedTickets} / ${developmentProgress.totalTickets} completed tickets`,
  };
}

/**
 * Replaces data-bind placeholders with dashboard values.
 *
 * @param {object} values The values to apply to matching page elements.
 */
function populateProjectBindings(values) {
  document.querySelectorAll('[data-bind]').forEach((element) => {
    const property = element.dataset.bind;

    if (Object.hasOwn(values, property)) {
      element.textContent = values[property];
    }
  });
}

/**
 * Populates the fixed dashboard cards without requiring additional markup.
 *
 * @param {object} values The values to apply to dashboard cards.
 */
function populateDashboardCards(values) {
  document.querySelectorAll('.dashboard-card').forEach((card) => {
    const header = card.querySelector('.dashboard-card__header');
    const body = card.querySelector('.dashboard-card__body');
    const binding = header && DASHBOARD_CARD_BINDINGS[header.textContent.trim()];

    if (body && binding && Object.hasOwn(values, binding)) {
      body.textContent = values[binding];
    }
  });
}

/**
 * Updates progress bar state for the reusable development progress card.
 *
 * @param {{completedTickets: number, totalTickets: number, percentage: number}} progress The calculated progress.
 */
function populateDevelopmentProgress(progress) {
  document.querySelectorAll('[data-development-progress-bar]').forEach((progressBar) => {
    const indicator = progressBar.querySelector('.development-progress__indicator');
    const valueText = `${progress.completedTickets} of ${progress.totalTickets} tickets completed`;

    progressBar.setAttribute('aria-valuenow', progress.percentage);
    progressBar.setAttribute('aria-valuetext', `${valueText} (${progress.percentage}%)`);

    if (indicator) {
      indicator.style.inlineSize = `${progress.percentage}%`;
    }
  });
}

/**
 * Loads the project data and applies it to the existing dashboard.
 */
async function loadApplicationData() {
  try {
    const [projects, tickets, milestones, releases] = await Promise.all([
        loadProjects(),
        loadTickets(),
        loadMilestones(),
        loadReleases(),
    ]);

    appState.projects = projects;

    const activeProjectId = localStorage.getItem(STORAGE_KEYS.activeProject);

    appState.activeProject =
      appState.projects.find(project => project.id === activeProjectId) ??
      appState.projects[0] ??
      null;
    
    appState.tickets = tickets;
    appState.milestones = milestones;
    appState.releases = releases;
    
    populateCurrentView();
  } catch (error) {
    // Leave the existing placeholders visible if the dashboard data is unavailable.
    console.error('VEAG Foundry dashboard data could not be loaded.', error);
  }
}

function populateCurrentView() {
  switch (appState.currentView) {

    case "dashboard":
      populateDashboard();
      break;

    case "tickets":
      break;

    default:
      break;
  }
}

function populateDashboard() {

  if (!appState.activeProject) {
      return;
  }

  const model = createProjectModel(
      appState.activeProject,
      appState.tickets,
      appState.milestones,
      appState.releases
  );
  
  const values = createDashboardValues(model);

  populateProjectBindings(values);
  populateDashboardCards(values);
  populateDevelopmentProgress(model.developmentProgress);
}

function updateActiveNavigation() {
    document.querySelectorAll(".navigation-item").forEach((item) => {
        item.classList.toggle(
            "navigation-item--active",
            item.dataset.view === appState.currentView
        );
    });
}

renderCurrentView();

initialiseNavigation();

loadApplicationData();
