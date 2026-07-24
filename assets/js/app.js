const DATA_FILES = {
  project: 'assets/data/project.json',
  tickets: 'assets/data/tickets.json',
  milestones: 'assets/data/milestones.json',
  releases: 'assets/data/releases.json',
};

// Consider replacing DASHBOARD_CARD_BINDINGS with data-bind attributes on the cards in a future refactor.
const DASHBOARD_CARD_BINDINGS = {
  'Current Project': 'currentProject',
  Version: 'version',
  Sprint: 'currentSprint',
  'Current Ticket': 'currentTicket',
};

/**
 * Loads a JSON data file and reports which file was unavailable.
 *
 * @param {string} path The path to the JSON file.
 * @returns {Promise<object|Array>} The parsed JSON data.
 */
async function loadJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Unable to load ${path}: ${response.status}`);
  }

  return response.json();
}

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
  const { project, activeTicket } = model;

  return {
    name: project.name,
    currentProject: project.name,
    version: project.version,
    currentSprint: project.currentSprint,
    currentTicket: formatActiveTicket(activeTicket, project.activeTicketId),
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
 * Loads the project data and applies it to the existing dashboard.
 */
async function loadProjectConfiguration() {
  try {
    const [project, tickets, milestones, releases] = await Promise.all([
      loadJson(DATA_FILES.project),
      loadJson(DATA_FILES.tickets),
      loadJson(DATA_FILES.milestones),
      loadJson(DATA_FILES.releases),
    ]);
    const model = createProjectModel(project, tickets, milestones, releases);
    const values = createDashboardValues(model);

    populateProjectBindings(values);
    populateDashboardCards(values);
  } catch (error) {
    // Leave the existing placeholders visible if the dashboard data is unavailable.
    console.error('VEAG Foundry dashboard data could not be loaded.', error);
  }
}

loadProjectConfiguration();
