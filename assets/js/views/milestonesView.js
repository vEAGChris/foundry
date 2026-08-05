import { renderMilestoneDetails } from "../components/milestoneDetailsPanel.js";

export function renderMilestonesView(
    milestones = [],
    activeMilestone = null
) {

    return `
        <section class="workspace">

            <div class="workspace-list">

                <h2>Milestones</h2>

                <div class="milestone-grid">

                    ${milestones.map(milestone =>
                        renderMilestoneCard(
                            milestone,
                            activeMilestone
                        )
                    ).join("")}

                </div>

            </div>

            ${renderMilestoneDetails(activeMilestone)}

        </section>
    `;
}

function renderMilestoneCard(
    milestone,
    activeMilestone
) {

    const status = milestone.status;

    const statusClass = status
        .toLowerCase()
        .replace(/\s+/g, "-");

    const statusText = status
        .replace(/-/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());

    const active =
        milestone.id === activeMilestone?.id
            ? "milestone-card--active"
            : "";

    return `
        <article 
            class="milestone-card ${active}"
            data-milestone-id="${milestone.id}">

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