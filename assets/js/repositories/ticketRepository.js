export async function loadTickets() {

    const response = await fetch("assets/data/tickets.json");

    if (!response.ok) {
        throw new Error("Unable to load tickets.");
    }

    return response.json();

}