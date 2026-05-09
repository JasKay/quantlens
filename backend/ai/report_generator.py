import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_report(results):
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")

        prompt = f"""
You are a senior quantitative analyst at a top-tier asset management firm.
Based on the following portfolio risk analysis, write a professional Risk Intelligence Report.

ANALYSIS DATA:
{json.dumps(results, indent=2, default=str)}

Write a structured report with these exact sections:

1. EXECUTIVE SUMMARY (3-4 sentences on the overall risk profile)
2. KEY RISK METRICS (interpret VaR and volatility using the actual numbers)
3. DIVERSIFICATION ANALYSIS (are they actually diversified? use the correlation data)
4. STRESS TEST INSIGHTS (which crisis hit hardest, use actual percentages)
5. FORWARD OUTLOOK (interpret Monte Carlo — realistic range of outcomes)
6. OPTIMIZATION OPPORTUNITY (what should they change based on the efficient frontier)
7. RECOMMENDATIONS (3 specific, actionable bullet points from the data)

Rules:
- Always reference specific numbers from the data
- Write like a professional analyst, not a chatbot
- Be direct and opinionated based on what the data shows
- Keep total length to 500-700 words
"""
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        return {
            "error": str(e),
            "message": "AI report unavailable — all quant analysis is still complete above."
        }
