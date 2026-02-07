const phishingKeywords = [
  "login",
  "verify",
  "secure",
  "bank",
  "account",
  "confirm",
  "update",
  "password",
  "wallet",
  "crypto"
]

const maliciousKeywords = [
  "free-money",
  "win-prize",
  "claim-now",
  "click-now",
  "urgent",
  "limited-time"
]

const goodKeywords = [
  "privacy",
  "terms",
  "contact",
  "about",
  "support",
  "blog",
  "careers",
  "help"
]


const phishingPatterns = [
  /secure.*login/,
  /verify.*account/,
  /bank.*login/,
  /confirm.*password/
]

export function analyzeUrl(url, pageText = "") {

  const problems = []
  const goodFound = []
  let harmful = 0
  let safe = 0


  const lowerUrl = url.toLowerCase()
  const domain = new URL(url).hostname

  phishingKeywords.forEach(k => {
    if (lowerUrl.includes(k)) {
      harmful += 2
      problems.push(`Phishing keyword detected: ${k}`)
    }
  })

  maliciousKeywords.forEach(k => {
    if (lowerUrl.includes(k)) {
      harmful += 3
      problems.push(`Malicious keyword detected: ${k}`)
    }
  })

goodKeywords.forEach(k => {
  if (pageText.includes(k)) {
    safe += 2
    goodFound.push(k)
  }
})



  phishingPatterns.forEach(p => {
    if (p.test(lowerUrl)) {
      harmful += 4
      problems.push("Phishing URL pattern detected")
    }
  })

  if (!url.startsWith("https")) {
    harmful += 3
    problems.push("No HTTPS (unsafe connection)")
  }

  if (domain.split("-").length > 3) {
    harmful += 2
    problems.push("Suspicious domain structure")
  }

  const total = harmful + safe || 1
  const riskScore = Math.min(100, Math.round((harmful / total) * 100))

  let level = "Low"
  if (riskScore > 70) level = "High"
  else if (riskScore > 35) level = "Medium"

  return {
  level,
  riskScore,
  harmful,
  safe,
  problems,
  goodFound
}

}
