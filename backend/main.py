from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.schemas import PortfolioInput
from data.fetcher import fetch_portfolio_data
from engines.correlation import run_correlation
from engines.var import run_var
from engines.monte_carlo import run_monte_carlo
from engines.stress_test import run_stress_test
from engines.efficient_frontier import run_efficient_frontier
from engines.factor_model import run_factor_model
from ai.report_generator import generate_report

app = FastAPI(title="QuantLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "QuantLens is live"}

@app.post("/analyze")
async def analyze(portfolio: PortfolioInput):
    try:
        # 1. Fetch data
        data = fetch_portfolio_data(portfolio.holdings, portfolio.period)

        # 2. Run engines
        correlation    = run_correlation(data)
        var            = run_var(data)
        monte_carlo    = run_monte_carlo(data)
        stress_tests   = run_stress_test(data, portfolio.holdings)
        frontier       = run_efficient_frontier(data)
        factor_model   = run_factor_model(data)

        # 3. Generate AI report
        results = {
            "correlation": correlation,
            "var": var,
            "monte_carlo": monte_carlo,
            "stress_tests": stress_tests,
            "efficient_frontier": frontier,
            "factor_model": factor_model
        }
        ai_report = generate_report(results)

        return {**results, "ai_report": ai_report}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
