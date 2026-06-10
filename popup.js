async function refreshToggle() {
    const data = await browser.storage.local.get("enabled");
    const enabled = data.enabled ?? false;

    document.getElementById("toggle").textContent =
        enabled ? "Desactiver" : "Activer";
}

async function load() {
    const data = await browser.storage.local.get("urls");
    const urls = data.urls || [];

    document.getElementById("content").textContent =
        urls.join("\n");
}

window.addEventListener("DOMContentLoaded", () => {
    load();
    refreshToggle();
});

document.getElementById("toggle")
    .addEventListener("click", async () => {

        const data = await browser.storage.local.get("enabled");
        const enabled = data.enabled ?? false;

        await browser.storage.local.set({
            enabled: !enabled
        });

        refreshToggle();
    });

document.getElementById("copy")
    .addEventListener("click", async () => {

        const data = await browser.storage.local.get("urls");
        const urls = data.urls || [];

        await navigator.clipboard.writeText(urls.join("\n"));
    });

document.getElementById("reset")
    .addEventListener("click", async () => {

        await browser.storage.local.set({ urls: [] });

        load();
    });