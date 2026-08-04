export function renderProjectDetails(
    project,
    releases = []
) {

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

            <div class="form-group">

                <label>Name</label>

                <input
                    class="project-editor__name"
                    data-field="name"
                    type="text"
                    value="${project.name}">

            </div>

            <div class="form-group">

                <label>Description</label>

                <textarea
                    class="project-editor__description"
                    data-field="description"
                >${project.description}</textarea>

            </div>

            <div class="form-group">

                <label>Status</label>

                <select 
                    class="project-editor__status"
                    data-field="status">

                    <option value="development"
                        ${project.status === "development" ? "selected" : ""}>
                        Development
                    </option>

                    <option value="live"
                        ${project.status === "live" ? "selected" : ""}>
                        Live
                    </option>

                </select>

            </div>

            <div class="form-group">

                <label>Current Sprint</label>

                <input
                    class="project-editor__currentSprint"
                    data-field="currentSprint"
                    type="text"
                    value="${project.currentSprint}">

            </div>

            <div class="form-group">

                <label>Current Release</label>

                <select
                    class="project-editor__currentRelease"
                    data-field="currentRelease">

                    ${releases
                        .filter(release => release.projectId === project.id)
                        .map(release => `
                            <option
                                value="${release.version}"
                                ${project.currentRelease === release.version ? "selected" : ""}>

                                ${release.version} — ${release.title}

                            </option>
                        `).join("")}

                </select>

            </div>

            </div>

            <div class="project-editor__actions">

                <button
                    id="save-project"
                    class="button button--primary">

                    Save Project

                </button>

            </div>

        </aside>
    `;

}