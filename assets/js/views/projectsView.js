export function renderProjectsView(projects = []) {

    const cards = projects.map(project => `
        <article class="project-card">
            <h2>${project.name}</h2>

            <p>${project.description}</p>

            <ul>
                <li><strong>Version:</strong> ${project.version}</li>
                <li><strong>Status:</strong> ${project.status}</li>
            </ul>
        </article>
    `).join("");

    return `
        <section class="projects-view">
            <h1>Projects</h1>

            ${cards}
        </section>
    `;
}