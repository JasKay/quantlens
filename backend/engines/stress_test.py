import yfinance as yf
import numpy as np
import pandas as pd

CRISIS_PERIODS = {
    "2008_financial_crisis": {
        "name": "2008 Financial Crisis",
        "start": "2008-09-01",
        "end": "2009-03-09",
        "description": "Global meltdown triggered by the subprime mortgage collapse"
    },
    "covid_crash": {
        "name": "COVID-19 Crash",
        "start": "2020-02-19",
        "end": "2020-03-23",
        "description": "Fastest market crash in history triggered by a global pandemic"
    },
    "dotcom_bust": {
        "name": "Dot-com Bust",
        "start": "2000-03-10",
        "end": "2002-10-09",
        "description": "Collapse of the internet bubble wiped out trillions in tech valuations"
    },
    "2022_rate_hikes": {
        "name": "2022 Rate Hike Cycle",
        "start": "2022-01-03",
        "end": "2022-12-31",
        "description": "Aggressive Fed tightening caused a broad market selloff"
    }
}

def run_stress_test(data, holdings):
    tickers = data["tickers"]
    weights = data["weights"]
    results = {}

    for key, crisis in CRISIS_PERIODS.items():
        try:
            prices = yf.download(
                tickers,
                start=crisis["start"],
                end=crisis["end"],
                auto_adjust=True,
                progress=False
            )["Close"]

            if isinstance(prices, pd.Series):
                prices = prices.to_frame(name=tickers[0])

            available = [t for t in tickers if t in prices.columns]
            if not available:
                continue

            prices = prices[available].dropna()
            if prices.empty or len(prices) < 2:
                continue

            avail_w = np.array([weights[t] for t in available])
            avail_w = avail_w / avail_w.sum()

            port_returns = prices.pct_change().dropna().dot(avail_w)
            cumulative   = (1 + port_returns).cumprod()
            max_drawdown = ((cumulative - cumulative.cummax()) / cumulative.cummax()).min()
            total_return = cumulative.iloc[-1] - 1

            results[key] = {
                "name":               crisis["name"],
                "description":        crisis["description"],
                "start":              crisis["start"],
                "end":                crisis["end"],
                "total_return":       round(float(total_return), 4),
                "max_drawdown":       round(float(max_drawdown), 4),
                "duration_days":      len(prices),
                "cumulative_returns": cumulative.round(4).tolist(),
                "dates":              cumulative.index.strftime("%Y-%m-%d").tolist()
            }
        except Exception as e:
            results[key] = {"name": crisis["name"], "error": str(e)}

    return results
