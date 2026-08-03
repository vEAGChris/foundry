export function validateTicket(ticket) {

    const errors = {};

    if (!ticket.title.trim()) {
        errors.title = "Title is required.";
    }

    if (!ticket.status) {
        errors.status = "Status is required.";
    }

    if (!ticket.priority) {
        errors.priority = "Priority is required.";
    }

    return {

        valid: Object.keys(errors).length === 0,

        errors

    };

}