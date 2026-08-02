export async function loadTickets() {

    const response = await fetch("http://localhost:3001/api/tickets");

    if (!response.ok) {
        throw new Error("Unable to load tickets.");
    }

    return response.json();

}

export async function saveTickets(tickets) {

    const response = await fetch("http://localhost:3001/api/tickets", {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(tickets)

    });

    if (!response.ok) {
        throw new Error("Unable to save tickets.");
    }

    return response.json();

}