function redirect(tab) {
    if (/.*sreality.cz\/detail.*/.test(tab.url)) {
        const id = tab.url.split("/").at(-1);
        const url = `https://sreality.zdenektomis.eu/listing/${id}`;
        chrome.tabs.create({ url: url });
    }
}

chrome.action.onClicked.addListener(redirect);
