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
    tickets = [],
    selectedTicket = null
) {

    const sortedTickets = [...tickets].sort((a, b) => a.order - b.order);

    const rows = sortedTickets.length
        ? sortedTickets
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
                <h1>Tickets</h1>
                <p>Manage project work items.</p>
            </header>

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

        ${renderTicketDetails(selectedTicket)}

    </section>
`;
}