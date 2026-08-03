export function showFieldError(field, message) {

    let error = field.parentElement.querySelector(".field-error");

    if (!error) {

        error = document.createElement("p");

        error.className = "field-error";

        field.insertAdjacentElement("afterend", error);

    }

    error.textContent = message;

    field.classList.add("field--error");

}

export function clearFieldError(field) {

    field.classList.remove("field--error");

    field.parentElement
        .querySelector(".field-error")
        ?.remove();

}

export function clearAllErrors() {

    document
        .querySelectorAll(".field--error")
        .forEach(field =>
            field.classList.remove("field--error")
        );

    document
        .querySelectorAll(".field-error")
        .forEach(error =>
            error.remove()
        );

}