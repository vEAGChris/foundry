import { API_BASE } from "../config/api.js";

export async function loadTickets() {

    const response = await fetch(`${API_BASE}/tickets`);

    if (!response.ok) {
        throw new Error("Unable to load tickets.");
    }

    return response.json();

}

export async function saveTickets(tickets) {

    const response = await fetch(`${API_BASE}/tickets`, {

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