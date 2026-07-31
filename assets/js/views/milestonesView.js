export function renderMilestonesView(milestones) {

    return `
        <section class="view">

            <h2>Milestones</h2>

            <div class="milestone-grid">

                ${milestones.map(renderMilestoneCard).join("")}

            </div>

        </section>
    `;
}

function renderMilestoneCard(milestone) {

    const status = milestone.status;

    const statusClass = status
        .toLowerCase()
        .replace(/\s+/g, "-");

    const statusText = status
        .replace(/-/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());

    return `
        <article class="milestone-card">

            <div class="milestone-card__id">
                ${milestone.id}
            </div>

            <h3 class="milestone-card__title">
                ${milestone.title}
            </h3>

            <div class="milestone-card__status milestone-card__status--${statusClass}">
                ${statusText}
            </div>

        </article>
    `;
}