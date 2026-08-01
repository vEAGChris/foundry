import { createPriorityBadge, createStatusBadge } from "./badge.js";

export function renderTicketDetails(ticket) {

    if (!ticket) {
        return `
            <aside class="ticket-details">

                <h2>Ticket Details</h2>

                <p>Select a ticket to view its details.</p>

            </aside>
        `;
    }

    return `
        <aside class="ticket-details">

            <header class="ticket-details__header">

                <h2>${ticket.id}</h2>

                ${createStatusBadge(ticket.status)}

            </header>

            <h3>${ticket.title}</h3>

            <h4>Description</h4>

            <p>${ticket.description || "No description."}</p>

            <h4>Acceptance Criteria</h4>

            <ul class="ticket-details__criteria">

                ${
                    ticket.acceptanceCriteria?.length
                        ? ticket.acceptanceCriteria
                            .map(item => `<li>${item}</li>`)
                            .join("")
                        : "<li>No acceptance criteria.</li>"
                }

            <h4>Engineering Notes</h4>

            <p>${ticket.notes || "No engineering notes."}</p>

            </ul>

            <dl class="ticket-details__metadata">

                <dt>Priority</dt>
                <dd>${createPriorityBadge(ticket.priority)}</dd>

                <dt>Milestone</dt>
                <dd>${ticket.milestone}</dd>

            </dl>

        </aside>
    `;
}