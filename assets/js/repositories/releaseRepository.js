export async function loadReleases() {
    const response = await fetch("assets/data/releases.json");

    if (!response.ok) {
        throw new Error("Unable to load releases.");
    }

    return response.json();
}