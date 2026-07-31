export function renderReleasesView(releases) {

    return `
        <section class="view">

            <h2>Releases</h2>

            <div class="release-grid">

                ${releases.map(renderReleaseCard).join("")}

            </div>

        </section>
    `;
}

function renderReleaseCard(release) {

    const status = release.status;

    const statusClass = status
        .toLowerCase()
        .replace(/\s+/g, "-");

    const statusText = status
        .replace(/-/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());

    return `
        <article class="release-card">

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