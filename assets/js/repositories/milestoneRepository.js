export async function loadMilestones() {
    const response = await fetch("assets/data/milestones.json");

    if (!response.ok) {
        throw new Error("Unable to load milestones.");
    }

    return response.json();
}