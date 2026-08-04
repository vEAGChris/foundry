import { API_BASE } from "../config/api.js";

export async function loadProjects() {

    const response = await fetch(`${API_BASE}/projects`);

    if (!response.ok) {
        throw new Error("Unable to load projects.");
    }

    return response.json();

}

export async function saveProjects(projects) {

    const response = await fetch(`${API_BASE}/projects`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(projects)

    });

    if (!response.ok) {
        throw new Error("Unable to save projects.");
    }

    return response.json();

}