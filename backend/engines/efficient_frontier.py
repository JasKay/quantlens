import numpy as np
from scipy.optimize import minimize

def run_efficient_frontier(data, n_portfolios=3000):
    returns = data["returns"]
    tickers = data["tickers"]
    weights = data["weights"]
    n       = len(tickers)

    mean_returns = returns.mean() * 252
    cov_matrix   = returns.cov() * 252

    w = np.array([weights[t] for t in tickers])
    current_return = float(np.dot(w, mean_returns))
    current_vol    = float(np.sqrt(np.dot(w.T, np.dot(cov_matrix.values, w))))
    current_sharpe = current_return / current_vol if current_vol > 0 else 0

    # Random portfolios
    np.random.seed(42)
    rand_w = np.random.dirichlet(np.ones(n), n_portfolios)
    f_returns, f_vols, f_sharpes = [], [], []

    for rw in rand_w:
        r = float(np.dot(rw, mean_returns))
        v = float(np.sqrt(np.dot(rw.T, np.dot(cov_matrix.values, rw))))
        f_returns.append(round(r, 4))
        f_vols.append(round(v, 4))
        f_sharpes.append(round(r / v if v > 0 else 0, 4))

    constraints = {"type": "eq", "fun": lambda w: np.sum(w) - 1}
    bounds = [(0, 1)] * n
    x0    = np.ones(n) / n

    # Max Sharpe
    def neg_sharpe(w):
        r = np.dot(w, mean_returns)
        v = np.sqrt(np.dot(w.T, np.dot(cov_matrix.values, w)))
        return -r / v if v > 0 else 0

    opt    = minimize(neg_sharpe, x0, method="SLSQP", bounds=bounds, constraints=constraints)
    opt_w  = opt.x
    opt_r  = float(np.dot(opt_w, mean_returns))
    opt_v  = float(np.sqrt(np.dot(opt_w.T, np.dot(cov_matrix.values, opt_w))))

    # Min Vol
    def port_vol(w):
        return np.sqrt(np.dot(w.T, np.dot(cov_matrix.values, w)))

    mv_opt = minimize(port_vol, x0, method="SLSQP", bounds=bounds, constraints=constraints)
    mv_w   = mv_opt.x
    mv_r   = float(np.dot(mv_w, mean_returns))
    mv_v   = float(np.sqrt(np.dot(mv_w.T, np.dot(cov_matrix.values, mv_w))))

    return {
        "tickers": tickers,
        "frontier": {
            "returns":      f_returns,
            "volatilities": f_vols,
            "sharpes":      f_sharpes
        },
        "current_portfolio": {
            "return":     round(current_return, 4),
            "volatility": round(current_vol, 4),
            "sharpe":     round(current_sharpe, 4),
            "weights":    w.tolist()
        },
        "optimal_portfolio": {
            "return":     round(opt_r, 4),
            "volatility": round(opt_v, 4),
            "sharpe":     round(opt_r / opt_v if opt_v > 0 else 0, 4),
            "weights":    {tickers[i]: round(opt_w[i], 4) for i in range(n)}
        },
        "min_vol_portfolio": {
            "return":     round(mv_r, 4),
            "volatility": round(mv_v, 4),
            "weights":    {tickers[i]: round(mv_w[i], 4) for i in range(n)}
        }
    }
