// content.js — RagGit
// This file is copied as-is to dist/. Do NOT import anything here.

function isGitHubFilePage() {
  return window.location.pathname.includes("/blob/");
}

function extractCode() {
  // Strategy 1: react-code-line-contents (GitHub 2024 new UI)
  var s1 = document.querySelectorAll(".react-code-line-contents");
  if (s1.length > 0) {
    var t1 = Array.from(s1).map(function(e) { return e.innerText; }).join("\n");
    if (t1.trim().length > 10) return t1;
  }

  // Strategy 2: data-code-text attribute
  var s2 = document.querySelectorAll("[data-code-text]");
  if (s2.length > 0) {
    var t2 = Array.from(s2).map(function(e) { return e.getAttribute("data-code-text") || ""; }).join("\n");
    if (t2.trim().length > 10) return t2;
  }

  // Strategy 3: blob-code-inner (classic GitHub)
  var s3 = document.querySelectorAll(".blob-code-inner");
  if (s3.length > 0) {
    var t3 = Array.from(s3).map(function(e) { return e.innerText; }).join("\n");
    if (t3.trim().length > 10) return t3;
  }

  // Strategy 4: js-file-line
  var s4 = document.querySelectorAll(".js-file-line");
  if (s4.length > 0) {
    var t4 = Array.from(s4).map(function(e) { return e.innerText; }).join("\n");
    if (t4.trim().length > 10) return t4;
  }

  // Strategy 5: CodeMirror lines
  var s5 = document.querySelectorAll(".cm-line");
  if (s5.length > 0) {
    var t5 = Array.from(s5).map(function(e) { return e.innerText; }).join("\n");
    if (t5.trim().length > 10) return t5;
  }

  // Strategy 6: react-code-text spans
  var s6 = document.querySelectorAll(".react-code-text");
  if (s6.length > 0) {
    var t6 = Array.from(s6).map(function(e) { return e.innerText; }).join("\n");
    if (t6.trim().length > 10) return t6;
  }

  // Strategy 7: data-testid code-cell
  var s7 = document.querySelectorAll("[data-testid='code-cell']");
  if (s7.length > 0) {
    var t7 = Array.from(s7).map(function(e) { return e.innerText; }).join("\n");
    if (t7.trim().length > 10) return t7;
  }

  // Strategy 8: highlight pre (rendered code blocks)
  var s8 = document.querySelector(".highlight pre");
  if (s8 && s8.innerText.trim().length > 10) return s8.innerText;

  // Strategy 9: any pre tag
  var s9 = document.querySelector("pre");
  if (s9 && s9.innerText.trim().length > 10) return s9.innerText;

  // Strategy 10: textarea with file content
  var s10 = document.querySelector("textarea[aria-label='file content'], #read-only-cursor-text-area");
  if (s10) {
    var t10 = s10.value || s10.innerText;
    if (t10 && t10.trim().length > 10) return t10;
  }

  return null;
}

function extractFilename() {
  var parts = window.location.pathname.split("/");
  return parts[parts.length - 1] || "unknown";
}

chrome.runtime.onMessage.addListener(function(message, _sender, sendResponse) {
  if (message.type === "GET_CODE") {
    if (!isGitHubFilePage()) {
      sendResponse({ success: false, error: "Navigate to a GitHub file page (URL must contain /blob/)" });
      return true;
    }

    var code = extractCode();

    if (!code || code.trim().length === 0) {
      // Try to give a better error by checking if page loaded
      var hasAnyContent = document.querySelector(".repository-content, #repo-content-pjax-container");
      if (!hasAnyContent) {
        sendResponse({ success: false, error: "Page still loading. Please wait a moment and try again." });
      } else {
        sendResponse({ success: false, error: "Could not read code from this file. It may be binary, too large, or a format GitHub renders differently." });
      }
      return true;
    }

    sendResponse({
      success: true,
      code: code,
      filename: extractFilename(),
      language: null,
      url: window.location.href,
    });
  }
  return true;
});

// Notify badge update
if (isGitHubFilePage()) {
  chrome.runtime.sendMessage({ type: "ON_FILE_PAGE", url: window.location.href });
}
