export function renderMilestoneDetails(milestone) {

    if (!milestone) {

        return `
            <aside class="workspace-details">

                <h2>Milestone Details</h2>

                <p>Select a milestone.</p>

            </aside>
        `;

    }

    return `
        <aside class="workspace-details">

            <header class="workspace-details__header">

                <h2>${milestone.id}</h2>

                <select class="milestone-editor__status">

                    <option ${milestone.status === "planned" ? "selected" : ""}>planned</option>
                    <option ${milestone.status === "in-progress" ? "selected" : ""}>in-progress</option>
                    <option ${milestone.status === "completed" ? "selected" : ""}>completed</option>
                    <option ${milestone.status === "cancelled" ? "selected" : ""}>cancelled</option>

                </select>

            </header>

            <label>Title</label>

            <input
                class="milestone-editor__title"
                type="text"
                value="${milestone.title}">

            <label>Project</label>

            <input
                class="milestone-editor__project"
                type="text"
                value="${milestone.projectId}"
                readonly>

            <div class="workspace-details__actions">

                <button
                    id="save-milestone"
                    class="button button--primary">

                    Save

                </button>

            </div>

        </aside>
    `;

}