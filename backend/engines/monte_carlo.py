import numpy as np

def run_monte_carlo(data, n_simulations=1000, years=5):
    returns = data["returns"]
    tickers = data["tickers"]
    weights = data["weights"]

    w = np.array([weights[t] for t in tickers])
    port_returns  = returns.dot(w)
    mean_return   = port_returns.mean()
    std_return    = port_returns.std()
    trading_days  = 252 * years

    np.random.seed(42)
    simulations = np.zeros((n_simulations, trading_days))

    for i in range(n_simulations):
        daily = np.random.normal(
            mean_return - 0.5 * std_return ** 2,
            std_return,
            trading_days
        )
        simulations[i] = np.cumprod(1 + daily)

    final_values = simulations[:, -1]

    return {
        "n_simulations": n_simulations,
        "years": years,
        "percentile_paths": {
            "p5":  np.percentile(simulations, 5,  axis=0).tolist(),
            "p25": np.percentile(simulations, 25, axis=0).tolist(),
            "p50": np.percentile(simulations, 50, axis=0).tolist(),
            "p75": np.percentile(simulations, 75, axis=0).tolist(),
            "p95": np.percentile(simulations, 95, axis=0).tolist(),
        },
        "final_value_stats": {
            "mean":        round(float(np.mean(final_values)), 4),
            "median":      round(float(np.median(final_values)), 4),
            "p5":          round(float(np.percentile(final_values, 5)), 4),
            "p95":         round(float(np.percentile(final_values, 95)), 4),
            "prob_loss":   round(float(np.mean(final_values < 1.0)), 4),
            "prob_double": round(float(np.mean(final_values > 2.0)), 4)
        }
    }
