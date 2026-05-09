import yfinance as yf
import pandas as pd

def fetch_portfolio_data(holdings, period="5y"):
    tickers = [h.ticker for h in holdings]
    weights = {h.ticker: h.weight for h in holdings}

    raw = yf.download(tickers, period=period, auto_adjust=True, progress=False)["Close"]

    if len(tickers) == 1:
        raw = raw.to_frame(name=tickers[0])

    raw = raw.dropna()
    returns = raw.pct_change().dropna()

    return {
        "prices": raw,
        "returns": returns,
        "tickers": tickers,
        "weights": weights
    }
