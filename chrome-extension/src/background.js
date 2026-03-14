// background.js — Service Worker
chrome.runtime.onMessage.addListener(function(message) {
  if (message.type === "ON_FILE_PAGE") {
    chrome.action.setBadgeText({ text: "AI" });
    chrome.action.setBadgeBackgroundColor({ color: "#6c7bff" });
  }
});
chrome.tabs.onActivated.addListener(function() {
  chrome.action.setBadgeText({ text: "" });
});
