const dexLogo = document.getElementById("dexLogo");
console.log(dexLogo);

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "myFunction", data: dexLogo.outerHTML });
    console.log("message query Sent");
  });