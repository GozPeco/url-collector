async function isEnabled() {
    const data = await browser.storage.local.get("enabled");

    return data.enabled ?? false;
}

function cleanUrl(rawUrl) {
    const url = new URL(rawUrl);

    let path = url.pathname;

    // retire le slash final
    path = path.replace(/\/$/, "");

    return path || "/";
}

async function registerUrl(rawUrl) {

    const enabled = await isEnabled();

    if (!enabled) {
        return;
    }

    const cleaned = cleanUrl(rawUrl);

    const data = await browser.storage.local.get("urls");

    const urls = data.urls || [];

    if (!urls.includes(cleaned)) {

        urls.push(cleaned);

        await browser.storage.local.set({
            urls
        });

        console.log("Ajout :", cleaned);
    }
}

// Navigation classique
browser.webNavigation.onCompleted.addListener((details) => {
    if (details.frameId !== 0) {
        return;
    }

    registerUrl(details.url);
});

// Navigation SPA (React, Next.js, Vue...)
browser.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (details.frameId !== 0) {
        return;
    }

    registerUrl(details.url);
});