function redirect(tab) {
    if (/.*sreality.cz\/detail.*/.test(tab.url)) {
        const id = tab.url.split("/").at(-1);
        const url = `https://realitni-radar.zdenektomis.eu/inzerat/${id}`;
        chrome.tabs.create({ url: url });
    }
}

chrome.action.onClicked.addListener(redirect);
