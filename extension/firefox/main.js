

function redirect() {
    console.log("trying to redirect");
    browser.tabs
    .query({ active: true, windowId: browser.windows.WINDOW_ID_CURRENT })
    .then((tabs) => browser.tabs.get(tabs[0].id))
    .then((tab) => {
        if(/.*sreality.cz\/detail.*/.test(tab.url)){
        const id = tab.url.split("/").at(-1);
        const url = `https://realitniradar.cz/inzerat/${id}`;
        browser.tabs.create({ url: url });
        }
    });
}

browser.browserAction.onClicked.addListener(redirect);