export function createStatusBadge(status) {
    return `
        <span class="badge badge--status">
            ${status}
        </span>
    `;
}

export function createPriorityBadge(priority) {
    return `
        <span class="badge badge--priority">
            ${priority}
        </span>
    `;
}