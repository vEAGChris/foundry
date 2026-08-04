export function validateProject(project) {

    const errors = {};

    if (!project.name.trim()) {
        errors.name = "Project name is required.";
    }

    if (!project.description.trim()) {
        errors.description = "Description is required.";
    }

    if (!project.release.trim()) {
        errors.release = "Release is required.";
    }

    if (!project.status) {
        errors.status = "Status is required.";
    }

    if (!project.currentSprint.trim()) {
        errors.currentSprint = "Current sprint is required.";
    }

    if (!project.currentRelease) {
        errors.currentRelease = "Current release is required.";
    }

    return {

        valid: Object.keys(errors).length === 0,

        errors

    };

}