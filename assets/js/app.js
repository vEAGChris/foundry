/**
 * Replaces data-bind placeholders with values from the project configuration.
 *
 * @param {object} project The loaded project configuration.
 */
function populateProjectBindings(project) {
  document.querySelectorAll('[data-bind]').forEach((element) => {
    const property = element.dataset.bind;

    if (Object.hasOwn(project, property)) {
      element.textContent = project[property];
    }
  });
}

/**
 * Loads the project configuration and applies it to matching page elements.
 */
async function loadProjectConfiguration() {
  try {
    const response = await fetch('assets/data/project.json');

    if (!response.ok) {
      throw new Error(`Unable to load project configuration: ${response.status}`);
    }

    const project = await response.json();
    populateProjectBindings(project);
  } catch (error) {
    // Leave the existing placeholders visible if the configuration is unavailable.
    console.error('VEAG Foundry project configuration could not be loaded.', error);
  }
}

loadProjectConfiguration();
