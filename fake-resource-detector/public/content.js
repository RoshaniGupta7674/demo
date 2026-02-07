chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "SCAN_PAGE") {
    const text = document.body.innerText.toLowerCase()

    sendResponse({
      text
    })
  }
})
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === "GET_URL") {
//     sendResponse({ url: window.location.href })
//   }
// })
