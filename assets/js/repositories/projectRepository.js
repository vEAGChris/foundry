export async function loadProject() {
    const response = await fetch("assets/data/project.json");

    if (!response.ok) {
        throw new Error("Unable to load project.");
    }

    return response.json();
}