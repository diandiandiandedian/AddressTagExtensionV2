chrome.runtime.onInstalled.addListener(() => {
    console.log("Chrome extension installed");
});

// 监听来自 contentScript.js 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'openPopup') {
        chrome.windows.create({
            url: chrome.runtime.getURL("popup.html"), // 确保 popup.html 是正确的路径
            type: "popup",
            width: 400,  // 设置弹窗的宽度
            height: 500  // 设置弹窗的高度
        });
    }
});
