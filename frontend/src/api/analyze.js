import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export async function analyzePortfolio(holdings) {
  const response = await axios.post(`${API_URL}/analyze`, {
    holdings,
    period: "5y"
  })
  return response.data
}
