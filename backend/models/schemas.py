from pydantic import BaseModel, validator
from typing import List

class Holding(BaseModel):
    ticker: str
    weight: float

class PortfolioInput(BaseModel):
    holdings: List[Holding]
    period: str = "5y"

    @validator("holdings")
    def weights_must_sum_to_one(cls, holdings):
        total = sum(h.weight for h in holdings)
        if abs(total - 1.0) > 0.01:
            raise ValueError(f"Weights must sum to 1.0, got {total:.2f}")
        return holdings
