let wakeLock = null;
let isWakeLockActive = false;

async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request("screen");
        isWakeLockActive = true;
        updateStatus("Wake lock is active.");

        wakeLock.addEventListener("release", () => {
            isWakeLockActive = false;
            updateStatus("Wake lock was released.");
        });
    } catch (err) {
        console.error("Failed to acquire wake lock:", err);
        updateStatus("Failed to acquire wake lock.");
    }
}

function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
        isWakeLockActive = false;
        updateStatus("Wake lock was released.");
    }
}

function updateStatus(message) {
    const statusElement = document.getElementById("wakeLockStatus");
    if (statusElement) {
        statusElement.textContent = message;
    }
}

function handleVisibilityChange() {
    if (document.visibilityState === "visible" && isWakeLockActive) {
        requestWakeLock();
    } else {
        releaseWakeLock();
    }
}

document.addEventListener("visibilitychange", handleVisibilityChange);

document.addEventListener("DOMContentLoaded", () => {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.bottom = "10px";
    container.style.right = "10px";
    container.style.padding = "10px";
    container.style.backgroundColor = "#f0f0f0";
    container.style.border = "1px solid #ccc";
    container.style.borderRadius = "5px";

    const toggleButton = document.createElement("button");
    toggleButton.textContent = "Enable Wake Lock";
    toggleButton.style.marginRight = "10px";

    const statusElement = document.createElement("span");
    statusElement.id = "wakeLockStatus";
    statusElement.textContent = "Wake lock is inactive.";

    toggleButton.addEventListener("click", () => {
        if (isWakeLockActive) {
            releaseWakeLock();
            toggleButton.textContent = "Enable Wake Lock";
        } else {
            requestWakeLock();
            toggleButton.textContent = "Disable Wake Lock";
        }
    });

    container.appendChild(toggleButton);
    container.appendChild(statusElement);
    document.body.appendChild(container);

    requestWakeLock();
});

window.addEventListener("beforeunload", releaseWakeLock);
