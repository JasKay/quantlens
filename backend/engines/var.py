import numpy as np
from scipy import stats

def run_var(data, confidence_level=0.95):
    returns = data["returns"]
    tickers = data["tickers"]
    weights = data["weights"]

    w = np.array([weights[t] for t in tickers])
    port_returns = returns.dot(w)

    # 1. Historical VaR
    hist_var  = np.percentile(port_returns, (1 - confidence_level) * 100)
    hist_cvar = port_returns[port_returns <= hist_var].mean()

    # 2. Parametric VaR
    mean      = port_returns.mean()
    std       = port_returns.std()
    param_var = stats.norm.ppf(1 - confidence_level, mean, std)
    param_cvar = mean - std * stats.norm.pdf(
        stats.norm.ppf(confidence_level)
    ) / (1 - confidence_level)

    # 3. Monte Carlo VaR
    np.random.seed(42)
    simulated = np.random.normal(mean, std, 10000)
    mc_var    = np.percentile(simulated, (1 - confidence_level) * 100)
    mc_cvar   = simulated[simulated <= mc_var].mean()

    return {
        "confidence_level": confidence_level,
        "historical": {
            "var_daily":  round(hist_var, 4),
            "var_annual": round(hist_var * np.sqrt(252), 4),
            "cvar_daily": round(hist_cvar, 4)
        },
        "parametric": {
            "var_daily":  round(param_var, 4),
            "var_annual": round(param_var * np.sqrt(252), 4),
            "cvar_daily": round(param_cvar, 4)
        },
        "monte_carlo": {
            "var_daily":  round(mc_var, 4),
            "var_annual": round(mc_var * np.sqrt(252), 4),
            "cvar_daily": round(mc_cvar, 4)
        },
        "portfolio_daily_returns": port_returns.tolist()
    }
