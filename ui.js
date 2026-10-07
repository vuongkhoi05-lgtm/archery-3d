export function showToast(
    message,
    duration = 1500
) {
    let toast =
        document.getElementById("toast");

    if (!toast) {
        toast =
            document.createElement("div");

        toast.id = "toast";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toast.timer);

    toast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, duration);
}


export function updateText(
    id,
    value
) {
    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


export function setVisible(
    id,
    visible
) {
    const element =
        document.getElementById(id);

    if (!element) return;

    element.classList.toggle(
        "hidden",
        !visible
    );
}


export function openModal(
    id
) {
    setVisible(id, true);
}


export function closeModal(
    id
) {
    setVisible(id, false);
}