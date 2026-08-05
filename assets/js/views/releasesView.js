import { renderReleaseDetails } from "../components/releaseDetailsPanel.js";

export function renderReleasesView(
    releases = [],
    activeRelease = null
) {

    return `
        <section class="workspace">

            <div class="workspace-list">

                <header class="releases-view__header">

                    <div>

                        <h1>Releases</h1>
                        <p>Manage project releases.</p>

                    </div>

                </header>

                <div class="release-grid">

                    ${releases
                        .map(release =>
                            renderReleaseCard(
                                release,
                                activeRelease
                            )
                        )
                        .join("")}

                </div>

            </div>

            ${renderReleaseDetails(activeRelease)}

        </section>
    `;

}

function renderReleaseCard(
    release,
    activeRelease
) {

    const isActive =
        release.version === activeRelease?.version;

    const activeClass = isActive
            ? "release-card--active"
            : "";

    const status = release.status;

    const statusClass = status
        .toLowerCase()
        .replace(/\s+/g, "-");

    const statusText = status
        .replace(/-/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());

    return `
        <article 
            class="release-card ${activeClass}"
            data-release-version="${release.version}">

            <div class="release-card__version">
                ${release.version}
            </div>

            <h3 class="release-card__title">
                ${release.title}
            </h3>

            <div class="release-card__status release-card__status--${statusClass}">
                ${statusText}
            </div>

        </article>
    `;
}