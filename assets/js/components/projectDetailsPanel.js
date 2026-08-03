export function renderProjectDetails(project) {

    if (!project) {

        return `
            <aside class="workspace-details">

                <h2>Project Details</h2>

                <p>Select a project.</p>

            </aside>
        `;

    }

    return `
        <aside class="workspace-details">

            <h2>Project Details</h2>

            <h3>${project.name}</h3>

            <dl class="project-details__list">

                <dt>Description</dt>
                <dd>${project.description}</dd>

                <dt>Version</dt>
                <dd>${project.version}</dd>

                <dt>Status</dt>
                <dd>${project.status}</dd>

                <dt>Current Sprint</dt>
                <dd>${project.currentSprint}</dd>

            </dl>

        </aside>
    `;

}