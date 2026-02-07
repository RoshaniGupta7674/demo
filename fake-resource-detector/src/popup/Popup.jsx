import { useEffect, useState } from "react"
import { Doughnut } from "react-chartjs-2"

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"

import { analyzeUrl } from "../utils/detector"

ChartJS.register(ArcElement, Tooltip, Legend)

const riskColor = {
  Low: "#2e7d32",     // green
  Medium: "#f9a825",  // yellow
  High: "#c62828"     // red
}

const riskBg = {
  Low: "#e8f5e9",
  Medium: "#fffde7",
  High: "#fdecea"
}


export default function Popup() {
  const [result, setResult] = useState(null)

useEffect(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tabId = tabs[0].id
    const url = tabs[0].url

    chrome.tabs.sendMessage(
      tabId,
      { type: "SCAN_PAGE" },
      response => {
        const pageText = response?.text || ""
        setResult(analyzeUrl(url, pageText))
      }
    )
  })
}, [])


  if (!result) {
    return <p style={{ padding: "10px" }}>Scanning...</p>
  }

  const data = {
    labels: ["Harmful", "Safe"],
    datasets: [
      {
        data: [result.harmful, result.safe],
        backgroundColor: ["#ff4d4d", "#4caf50"]
      }
    ]
  }

  return (
    <div
  style={{
    width: "340px",
    padding: "14px",
    fontFamily: "Inter, sans-serif",
    background: "#f4f6f8"
  }}
>
  <div
  style={{
    padding: "10px",
    borderRadius: "12px",
    background: riskBg[result.level],
    border: `1px solid ${riskColor[result.level]}`
  }}
>
  <h2 style={{ margin: 0 }}>Fake Resource Detector</h2>

  <p style={{ margin: "6px 0", color: riskColor[result.level] }}>
    <b>Risk:</b> {result.level} ({result.riskScore}%)
  </p>
</div>

    <div
  style={{
    marginTop: "12px",
    padding: "10px",
    borderRadius: "12px",
    background: "#ffffff",
    border: "1px solid #ddd"
  }}
>
  <Doughnut data={data} />
</div>


    {result.problems.length > 0 && (
    <div
        style={{
        marginTop: "12px",
        padding: "10px",
        borderRadius: "12px",
        background: "#ffffff",
        border: "1px solid #f44336"
        }}
    >
        <h4 style={{ marginBottom: "6px", color: "#c62828" }}>
        ⚠️ Security Issues
        </h4>

        <ul style={{ paddingLeft: "18px", margin: 0 }}>
        {result.problems.map((p, i) => (
            <li key={i}>{p}</li>
        ))}
        </ul>
    </div>
    )}


{result.goodFound.length > 0 && (
  <div
    style={{
      marginTop: "12px",
      padding: "10px",
      borderRadius: "12px",
      background: "#ffffff",
      border: "1px solid #4caf50"
    }}
  >
    <h4 style={{ marginBottom: "6px", color: "#2e7d32" }}>
      ✅ Positive Trust Signals
    </h4>

    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
      {result.goodFound.map((k, i) => (
        <span
          key={i}
          style={{
            padding: "4px 8px",
            borderRadius: "999px",
            background: "#e8f5e9",
            color: "#2e7d32",
            fontSize: "12px",
            border: "1px solid #a5d6a7"
          }}
        >
          {k}
        </span>
      ))}
    </div>
  </div>
)}


    </div>
  )
}
