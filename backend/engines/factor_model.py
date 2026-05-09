import numpy as np
import pandas as pd
import yfinance as yf
import statsmodels.api as sm

def run_factor_model(data):
    returns = data["returns"]
    tickers = data["tickers"]
    weights = data["weights"]

    w            = np.array([weights[t] for t in tickers])
    port_returns = returns.dot(w)

    # Use SPY as market proxy (always available, no extra API needed)
    spy_raw = yf.download(
        "SPY",
        start=returns.index[0],
        end=returns.index[-1],
        auto_adjust=True,
        progress=False
    )["Close"]

    market_returns = spy_raw.pct_change().dropna()

    aligned = pd.concat([port_returns, market_returns], axis=1, join="inner").dropna()
    aligned.columns = ["portfolio", "market"]

    # OLS regression
    X     = sm.add_constant(aligned["market"])
    model = sm.OLS(aligned["portfolio"], X).fit()

    alpha = float(model.params.get("const", 0))
    beta  = float(model.params.get("market", 0))
    r2    = float(model.rsquared)

    total_var       = float(port_returns.var() * 252)
    systematic_var  = r2 * total_var
    idiosyncratic_v = (1 - r2) * total_var

    return {
        "alpha":       round(alpha * 252, 6),   # annualized
        "beta_market": round(beta, 4),
        "r_squared":   round(r2, 4),
        "risk_decomposition": {
            "total_variance":         round(total_var, 6),
            "systematic_variance":    round(systematic_var, 6),
            "idiosyncratic_variance": round(idiosyncratic_v, 6),
            "systematic_pct":         round(r2 * 100, 2),
            "idiosyncratic_pct":      round((1 - r2) * 100, 2)
        }
    }
