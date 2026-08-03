import { createPriorityBadge, createStatusBadge } from "./badge.js";

export function renderTicketDetails(
    ticket, 
    errors = {}) {

    if (!ticket) {
        return `
            <aside class="workspace-details">

                <h2>Ticket Details</h2>

                <p>Select a ticket to view its details.</p>

            </aside>
        `;
    }

    return `
        <aside class="workspace-details">

            <header class="ticket-details__header">

                <h2>${ticket.id}</h2>

                <label>Status</label>

                <select class="ticket-editor__status">

                    <option ${ticket.status === "planned" ? "selected" : ""}>planned</option>

                    <option ${ticket.status === "in-progress" ? "selected" : ""}>in-progress</option>

                    <option ${ticket.status === "blocked" ? "selected" : ""}>blocked</option>

                    <option ${ticket.status === "review" ? "selected" : ""}>review</option>

                    <option ${ticket.status === "completed" ? "selected" : ""}>completed</option>

                    <option ${ticket.status === "cancelled" ? "selected" : ""}>cancelled</option>

                </select>

            </header>

            <input
                class="ticket-editor__title"
                type="text"
                value="${ticket.title}" >

            ${
                errors.title
                    ? `<p class="ticket-editor__error">${errors.title}</p>`
                    : ""        
            }

            <h4>Description</h4>

            <textarea
                class="ticket-editor__description"
                rows="5"
            >${ticket.description || ""}</textarea>

            <h4>Acceptance Criteria</h4>

            <ul class="ticket-details__criteria">

                ${
                    ticket.acceptanceCriteria?.length
                        ? ticket.acceptanceCriteria
                            .map(item => `<li>${item}</li>`)
                            .join("")
                        : "<li>No acceptance criteria.</li>"
                }

            </ul>

            <h4>Engineering Notes</h4>

            <textarea
                class="ticket-editor__notes"
                rows="4"
            >${ticket.notes || ""}</textarea>

            <dl class="ticket-details__metadata">

                <dt>Priority</dt>
                <select class="ticket-editor__priority">

                    <option ${ticket.priority === "critical" ? "selected" : ""}>critical</option>
                    <option ${ticket.priority === "high" ? "selected" : ""}>high</option>
                    <option ${ticket.priority === "medium" ? "selected" : ""}>medium</option>
                    <option ${ticket.priority === "low" ? "selected" : ""}>low</option>

                </select>

                <dt>Milestone</dt>
                <select class="ticket-editor__milestone">

                    <option selected>
                        ${ticket.milestone}
                    </option>

                </select>

            </dl>

        <div class="ticket-editor__actions">

            <button
                type="button"
                class="button button--danger"
                id="delete-ticket">
                Delete
            </button>

            <button
                type="button"
                class="button button--primary"
                id="save-ticket">
                Save
            </button>

        </div>
        
        </aside>
    `;
}