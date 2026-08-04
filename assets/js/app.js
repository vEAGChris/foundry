import { loadMilestones } from "./repositories/milestoneRepository.js";
import { loadProjects } from "./repositories/projectsRepository.js";
import { loadReleases } from "./repositories/releaseRepository.js";
import { loadTickets } from "./repositories/ticketRepository.js";
import { renderDashboardView } from "./views/dashboardView.js";
import { renderTicketsView } from "./views/ticketsView.js";
import { renderProjectsView } from "./views/projectsView.js";
import { renderMilestonesView } from "./views/milestonesView.js";
import { renderReleasesView } from "./views/releasesView.js";
import { saveTickets } from "./repositories/ticketRepository.js";
import { saveProjects } from "./repositories/projectsRepository.js";
import { validateTicket } from "./validators/ticketValidation.js";
import { validateProject } from "./validators/projectValidation.js";
import {
    showFieldError,
    clearAllErrors
} from "./components/validationRenderer.js";

const appState = {
  currentView: "dashboard",

  projects: [],
  activeProject: null,

  tickets: [],
  selectedTicket: null,

  milestones: [],
  releases: [],

  errors: [],

  filters: {
    search: ""
  },

  sort: {
    by: "order",
  },
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

function findReleaseByVersion(releases, version) {
    return Array.isArray(releases)
        ? releases.find(release => release.version === version)
        : undefined;
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

function getVisibleTickets() {
  return appState.tickets.filter(
    ticket => ticket.projectId === appState.activeProject?.id
  );
}

function getSelectedTicket() {

  return (
    appState.selectedTicket ??
    getVisibleTickets()[0] ??
    null
  );
}

function getVisibleMilestones() {
    return appState.milestones.filter(
        milestone => milestone.projectId === appState.activeProject?.id
    );
}

function getVisibleReleases() {
    return appState.releases.filter(
        release => release.projectId === appState.activeProject?.id
    );
}

function initialiseTicketSelection() {

    console.log("Initialising ticket selection");

    document.querySelectorAll("[data-ticket-id]").forEach((row) => {

        row.addEventListener("click", () => {

            console.log("Clicked", row.dataset.ticketId);

            const ticketId = row.dataset.ticketId;

            appState.selectedTicket =
                getVisibleTickets().find(ticket => ticket.id === ticketId);

            renderCurrentView();

        });

    });

}

function createNewTicket() {

    return {

        id: getNextTicketId(),

        projectId: appState.activeProject.id,

        order: getNextTicketOrder(),

        title: "Untitled Ticket",

        description: "",

        acceptanceCriteria: [],

        notes: "",

        status: "planned",

        priority: "medium",

        milestone: "M0.6.1",
//      milestone: appState.activeProject.currentMilestone

    };

}

function getNextTicketId() {

    const highestNumber = Math.max(
        ...appState.tickets.map(ticket =>
            Number(ticket.id.replace("FND-", ""))
        )
    );

    return `FND-${String(highestNumber + 1).padStart(3, "0")}`;

}

function getNextTicketOrder() {

    return Math.max(
        ...appState.tickets.map(ticket => ticket.order)
    ) + 1;

}

function buildEditedTicket(ticket) {

    return {

        ...ticket,

        title: document.querySelector(".ticket-editor__title").value,

        description: document.querySelector(".ticket-editor__description").value,

        status: document.querySelector(".ticket-editor__status").value,

        priority: document.querySelector(".ticket-editor__priority").value,

        milestone: document.querySelector(".ticket-editor__milestone").value,

        notes: document.querySelector(".ticket-editor__notes").value

    };

}

function initialiseTicketEditor() {

    const saveButton = document.getElementById("save-ticket");

    if (!saveButton) {
        return;
    }

    saveButton.addEventListener("click", async (event) => {

      event.preventDefault();
      event.stopPropagation();

      try {

          const editedTicket = buildEditedTicket(getSelectedTicket());

          const updatedTickets = appState.tickets.map(ticket =>
            ticket.id === editedTicket.id 
                ? editedTicket 
                : ticket
          );

          const validation = validateTicket(editedTicket);

          clearAllErrors();

          if (!validation.valid) {

              Object.entries(validation.errors).forEach(([name, message]) => {

                  const field = document.querySelector(
                      `.ticket-editor__${name}`
                  );

                  if (field) {

                      showFieldError(field, message);

                  }

              });

              return;

          }
          
          await saveTickets(updatedTickets);

          appState.tickets = updatedTickets;
          appState.selectedTicket = editedTicket;

          renderCurrentView();

      } catch (error) {

          console.error("SAVE FAILED", error);

      }

  });

}

function initialiseNewTicketButton() {

    const button = document.getElementById("new-ticket");

    if (!button) {
        return;
    }

    button.addEventListener("click", async () => {

        const newTicket = createNewTicket();

        appState.tickets.push(newTicket);

        appState.selectedTicket = newTicket;

        await saveTickets(appState.tickets);

        renderCurrentView();
        document.querySelector(".ticket-editor__title")?.focus();
        document.querySelector(".ticket-editor__title")?.select();

    });

}

function initialiseDeleteTicketButton() {

    const button = document.getElementById("delete-ticket");

    if (!button) {
        return;
    }

    button.addEventListener("click", async () => {

        const selectedTicket = getSelectedTicket();

        if (!selectedTicket) {
            return;
        }

        if (appState.tickets.length === 1) {
            alert(
                "Foundry requires at least one ticket. Create another ticket before deleting this one."
            );
            return;
        }

        if (!confirm(`Delete ${selectedTicket.id}?`)) {
            return;
        }

        const deletedIndex = appState.tickets.findIndex(
            ticket => ticket.id === selectedTicket.id
        );
        
        const remainingTickets = appState.tickets.filter(
            ticket => ticket.id !== selectedTicket.id
        );

        remainingTickets.forEach((ticket, index) => {
            ticket.order = index + 1;
        });

        appState.tickets = remainingTickets;
   
        appState.selectedTicket =
            remainingTickets[deletedIndex] ??
            remainingTickets[deletedIndex - 1] ??
            null;

        await saveTickets(appState.tickets);

        renderCurrentView();

    });

}

function buildEditedProject(project) {

    return {

        ...project,

        name: document.querySelector(".project-editor__name").value,

        description: document.querySelector(".project-editor__description").value,

        status: document.querySelector(".project-editor__status").value,

        currentSprint: document.querySelector(".project-editor__currentSprint").value,

        currentRelease: document.querySelector(".project-editor__currentRelease").value,

    };

}

function initialiseProjectEditor() {

    const saveButton = document.getElementById("save-project");

    if (!saveButton) {
        return;
    }

    console.log(saveButton);

    saveButton.addEventListener("click", async () => {

        const editedProject = buildEditedProject(
            appState.activeProject
        );

        const validation = validateProject(editedProject);

        if (!validation.valid) {

          clearAllErrors();

          Object.entries(validation.errors).forEach(([name, message]) => {

            const field = document.querySelector(
              `[data-field="${name}"]`
            );

            if (field) {
              showFieldError(field, message);
            }
          });

          return;
        }

        clearAllErrors();

        const updatedProjects = appState.projects.map(project =>
          project.id === editedProject.id
              ? editedProject
              : project
      );

      await saveProjects(updatedProjects);

      appState.projects = updatedProjects;
      appState.activeProject = editedProject;

      renderCurrentView();

    });

}

function renderCurrentView() {

  const app = document.getElementById("app");

  switch (appState.currentView) {

    case "dashboard":
      app.innerHTML = renderDashboardView();
      populateCurrentView();
      break;

    case "tickets": {

      const filteredTickets = getFilteredTickets();

      const sortedTickets = getSortedTickets(
          filteredTickets,
          appState.sort.by
      );

      app.innerHTML = renderTicketsView(
          sortedTickets,
          getSelectedTicket(),
          appState.errors
      );

      initialiseTicketSelection();
      initialiseTicketEditor();
      initialiseNewTicketButton();
      initialiseDeleteTicketButton();
      initialiseTicketSearch();
      initialiseTicketSort();
      initialiseProjectEditor();

      break;
    }

    case "projects":
      app.innerHTML = renderProjectsView(
        appState.projects,
        appState.activeProject,
        appState.releases
      );

      initialiseProjectSelection();
      initialiseProjectEditor();

      break;

    case "milestones":

      app.innerHTML =
          renderMilestonesView(
              getVisibleMilestones()
          );

      break;

      case "releases":

        app.innerHTML = renderReleasesView(
            getVisibleReleases()
        );

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
//  Constants for sorting tickets by priority and status. Lower values indicate higher priority or earlier status in the workflow.
    const PRIORITY_ORDER = {
        critical: 0,
        high: 1,
        medium: 2,
        low: 3  
    };

    const STATUS_ORDER = {
        planned: 0,
        "in-progress": 1,
        blocked: 2,
        review: 3,
        completed: 4,
        cancelled: 5
    };

function getSortedTickets(tickets, sortBy) {

    const sorted = [...tickets];

    switch (sortBy) {

        case "id":

            sorted.sort(
                (a, b) => a.id.localeCompare(b.id)
            );
            
            break;
      
        case "order":
        default:

            sorted.sort(
                (a, b) => a.order - b.order
            );

            break;

        case "priority":

            sorted.sort((a, b) => 
              
              (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]) ||
              (a.order - b.order)
            );

            break;

        case "status":

            sorted.sort((a, b) => 
              
              (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) ||
              (a.order - b.order)
            );

            break;

        case "milestone":

            sorted.sort((a, b) => 
              
              a.milestone.localeCompare(b.milestone) ||
              (a.order - b.order)
            );

            break;

    }

    return sorted;

}

function initialiseTicketSearch() {

    const search = document.getElementById("ticket-search");

    if (!search) {
        return;
    }

    search.value = appState.filters.search;

    search.addEventListener("input", (event) => {

        appState.filters.search = event.target.value;

        renderCurrentView();

    });

}

function initialiseTicketSort() {

    const select = document.getElementById("ticket-sort");

    if (!select) {
        return;
    }

    select.value = appState.sort.by;

    select.addEventListener("change", (event) => {

        appState.sort.by = event.target.value;

        renderCurrentView();

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
    if (!project) {
        return null;
    }

    return {
        project,
        developmentProgress: calculateDevelopmentProgress(tickets),
        activeTicket: findById(tickets, project.activeTicketId),
        currentMilestone: findById(milestones, project.currentMilestone),
        currentRelease: findReleaseByVersion(releases, project.currentRelease)
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
    Release: project.currentRelease,
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

function getFilteredTickets() {

    const search = appState.filters.search
        .trim()
        .toLowerCase();

    if (!search) {
        return getVisibleTickets();
    }

    return getVisibleTickets().filter(ticket =>

        ticket.id.toLowerCase().includes(search) ||

        ticket.title.toLowerCase().includes(search)

    );

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
