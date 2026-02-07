import { analyzeUrl } from "./utils/detector"

chrome.tabs.onActivated.addListener(async info => {
  const tab = await chrome.tabs.get(info.tabId)
  if (tab.url) updateBadge(tab.url)
})

function updateBadge(url) {
  const result = analyzeUrl(url)

  const badgeMap = {
    Low: { text: "LOW", color: "green" },
    Medium: { text: "MED", color: "orange" },
    High: { text: "!", color: "red" }
  }

  chrome.action.setBadgeText({
    text: badgeMap[result.level].text
  })

  chrome.action.setBadgeBackgroundColor({
    color: badgeMap[result.level].color
  })
}
