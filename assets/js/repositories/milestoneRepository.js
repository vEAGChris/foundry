import { API_BASE } from "../config/api.js";

export async function loadMilestones() {

    const response = await fetch(`${API_BASE}/milestones`);

    if (!response.ok) {
        throw new Error("Unable to load milestones.");
    }

    return response.json();

}

export async function saveMilestones(milestones) {

    const response = await fetch(`${API_BASE}/milestones`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(milestones)

    });

    if (!response.ok) {
        throw new Error("Unable to save milestones.");
    }

    return response.json();

}