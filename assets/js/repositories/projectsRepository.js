export async function loadProjects() {
    const response = await fetch("assets/data/projects.json");

    if (!response.ok) {
        throw new Error("Unable to load projects.");
    }

    return response.json();
}