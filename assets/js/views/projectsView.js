export function renderProjectsView(
    projects = [],
    activeProject = null
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
        
            <h2>${project.name}</h2>

            <p>${project.description}</p>

            <ul>
                <li><strong>Version:</strong> ${project.version}</li>
                <li><strong>Status:</strong> ${project.status}</li>
            </ul>
        </article>
        `;
    }).join("");

    return `
        <section class="projects-view">
            <h1>Projects</h1>

            ${cards}
        </section>
    `;
}