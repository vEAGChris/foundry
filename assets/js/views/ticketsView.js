import { loadTickets } from "../repositories/ticketRepository.js";

function createTicketRow(ticket) {
    return `
        <tr>
            <td>${ticket.order}</td>
            <td>${ticket.id}</td>
            <td>${ticket.title}</td>
            <td>${ticket.status}</td>
            <td>${ticket.priority}</td>
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

export async function renderTicketsView() {
    const tickets = await loadTickets();

    const sortedTickets = [...tickets].sort((a, b) => a.order - b.order);

    const rows = sortedTickets.length
        ? sortedTickets.map(createTicketRow).join("")
        : createEmptyState();

    return `
        <section class="tickets-view">

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

        </section>
    `;
}