import { renderProjectDetails } from "../components/projectDetailsPanel.js";

export function renderProjectsView(
    projects = [],
    activeProject = null,
    releases = [],
) {

    const cards = projects.map(project => {

        const active =
            project.id === activeProject?.id
                ? "project-card--active"
                : "";

        return `
        <article 
            class="project-card ${active}"
            data-project-id="${project.id}">

            ${active ? '<span class="project-card__badge">Current</span>' : ''}
        
            <h2>${project.name}</h2>

            <p>${project.description}</p>

            <ul>
                <li><strong>Release:</strong> ${project.currentRelease}</li>
                <li><strong>Status:</strong> ${project.status}</li>
            </ul>
        </article>
        `;
    }).join("");

    return `
        <section class="workspace">

            <div class="projects-list">

                <header class="projects-view__header">

                    <div>

                        <h1>Projects</h1>
                        <p>Manage project configuration.</p>

                    </div>

                </header>

                <div class="projects-grid">

                    ${cards}

                </div>

            </div>

            ${renderProjectDetails(
                activeProject,
                releases
            )}
        </section>

    `;
}