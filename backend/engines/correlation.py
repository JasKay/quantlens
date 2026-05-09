import numpy as np

def run_correlation(data):
    returns = data["returns"]
    tickers = data["tickers"]
    weights = data["weights"]

    corr_matrix = returns.corr()
    cov_matrix  = returns.cov() * 252

    w = np.array([weights[t] for t in tickers])
    port_variance  = np.dot(w.T, np.dot(cov_matrix.values, w))
    port_volatility = np.sqrt(port_variance)

    high_corr_pairs = []
    for i in range(len(tickers)):
        for j in range(i + 1, len(tickers)):
            val = corr_matrix.iloc[i, j]
            if abs(val) > 0.75:
                high_corr_pairs.append({
                    "pair": [tickers[i], tickers[j]],
                    "correlation": round(val, 4)
                })

    hhi = sum(w ** 2)

    return {
        "matrix": corr_matrix.round(4).to_dict(),
        "tickers": tickers,
        "high_correlation_pairs": high_corr_pairs,
        "portfolio_volatility_annual": round(port_volatility, 4),
        "concentration_hhi": round(hhi, 4),
        "covariance_matrix": cov_matrix.round(6).to_dict()
    }
