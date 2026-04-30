import { useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function Portfolio({ user, prices, token, tradeSignal }) {
  const [holdings, setHoldings] = useState([])
  const [walletBalance, setWalletBalance] = useState(user?.walletBalance || 0)

  useEffect(() => {
    fetchPortfolio()
  }, [tradeSignal])

  useEffect(() => {
    if (user?.walletBalance !== undefined) {
      setWalletBalance(user.walletBalance)
    }
  }, [user])

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`${API_URL}/api/trade/portfolio`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setHoldings(data.holdings)
        setWalletBalance(data.walletBalance)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const totalValuation = walletBalance + holdings.reduce((sum, h) => {
    const currentPrice = prices[h.ticker] || h.price
    return sum + h.shares * currentPrice
  }, 0)

  return (
    <div className="card full-width">
      <div className="card-header">
        <h2>Мой портфель</h2>
        <div className="card-icon">💼</div>
      </div>

      <div className="metrics-row">
        <div className="metric-box">
          <div className="metric-value">${walletBalance.toFixed(2)}</div>
          <div className="metric-label">Баланс кошелька</div>
        </div>
        <div className="metric-box">
          <div className="metric-value">${totalValuation.toFixed(2)}</div>
          <div className="metric-label">Total Valuation</div>
        </div>
        <div className="metric-box">
          <div className="metric-value">{holdings.length}</div>
          <div className="metric-label">Позиций</div>
        </div>
      </div>

      {holdings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p>У тебя пока нет акций. Купи первую на рынке!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Тикер</th>
                <th>Акций</th>
                <th>Текущая цена</th>
                <th>Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map(h => {
                const currentPrice = prices[h.ticker] || h.price
                return (
                  <tr key={h.ticker}>
                    <td className="td-ticker">{h.ticker}</td>
                    <td>{h.shares}</td>
                    <td className="td-price">${currentPrice.toFixed(2)}</td>
                    <td className="td-price">${(h.shares * currentPrice).toFixed(2)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}