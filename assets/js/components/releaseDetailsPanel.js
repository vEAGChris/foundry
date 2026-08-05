const RELEASE_STATUSES = [
    "planned",
    "development",
    "testing",
    "released"
];

export function renderReleaseDetails(release) {

    if (!release) {

        return `
            <aside class="workspace-details">

                <h2>Release Details</h2>

                <p>Select a release.</p>

            </aside>
        `;

    }

    const statusOptions = RELEASE_STATUSES
        .map(status => `
            <option
                value="${status}"
                ${status === release.status ? "selected" : ""}>

                ${status}

            </option>
        `)
        .join("");

    return `
        <aside class="workspace-details">

            <h2>Release Details</h2>

            <h3>${release.title}</h3>

            <p class="release-editor__version-label">
                ${release.version}

            </p>

            <label class="release-editor__field">

                <span>Version</span>

                <input
                    class="release-editor__version"
                    value="${release.version}">

            </label>

            <label class="release-editor__field">

                <span>Title</span>

                <input
                    class="release-editor__title"
                    value="${release.title}">

            </label>

            <label class="release-editor__field">

                <span>Release Date</span>

                <input
                    type="date"
                    class="release-editor__date"
                    value="${release.date ?? ""}">

            </label>

            <label class="release-editor__field">

                <span>Status</span>

                <select class="release-editor__status">

                    ${statusOptions}

                </select>

            </label>

            <div class="release-editor__actions">

                <button id="save-release"
                        class="button button--primary">

                    Save

                </button>

            </div>

        </aside>
    `;

}