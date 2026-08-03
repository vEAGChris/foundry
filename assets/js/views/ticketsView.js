import { createStatusBadge, createPriorityBadge } from "../components/badge.js";
import { renderTicketDetails } from "../components/ticketDetailsPanel.js";

function createTicketRow(ticket, selectedTicketId) {

    const selectedClass =
        ticket.id === selectedTicketId
            ? "ticket-table__row--selected"
            : "";

    return `
        <tr
            class="ticket-table__row ${selectedClass}"
            data-ticket-id="${ticket.id}">
            <td>${ticket.order}</td>
            <td>${ticket.id}</td>
            <td>${ticket.title}</td>
            <td>${createStatusBadge(ticket.status)}</td>
            <td>${createPriorityBadge(ticket.priority)}</td>
            <td>${ticket.milestone}</td>
        </tr>
    `;
}

function createEmptyState() {

    return `
        <tr>
            <td colspan="6" class="ticket-table__empty">
                No tickets found.
            </td>
        </tr>
    `;
}

export function renderTicketsView(
    tickets,
    selectedTicket,
    errors = {}
) {

    const rows = tickets.length
        ? tickets
            .map(ticket =>
                createTicketRow(
                    ticket,
                    selectedTicket?.id
                )
            )
            .join("")
        : createEmptyState();

    return `
    <section class="tickets-workspace">

        <div class="tickets-list">

            <header class="tickets-view__header">

                <div>

                    <h1>Tickets</h1>
                    <p>Manage project work items.</p>

                    <input
                        type="search"
                        id="ticket-search"
                        class="ticket-search"
                        placeholder="Search by ID or title...">

                </div>

                <button
                    type="button"
                    class="button button--primary"
                    id="new-ticket">

                    New Ticket

                </button>

            </header>
            
            <div class="ticket-toolbar">

                <label for="ticket-sort">
                    Sort by
                </label>

                <select id="ticket-sort">

                    <option value="order">Order</option>
                    <option value="id">ID</option>
                    <option value="priority">Priority</option>
                    <option value="status">Status</option>
                    <option value="milestone">Milestone</option>

                </select>

            </div>

            <div class="ticket-table-container">
                <table class="ticket-table">

                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Milestone</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${rows}
                    </tbody>

                </table>
            </div>

        </div>

        ${renderTicketDetails(
            selectedTicket,
            errors
        )}

    </section>
`;
}