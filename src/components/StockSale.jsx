import { useState } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function StockSale({ token, user, setUser }) {
  const [form, setForm] = useState({ ticker: "", shares: "" })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSell = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const res = await fetch(`${API_URL}/api/trade/sell`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ticker: form.ticker.toUpperCase(),
          shares: Number(form.shares)
        })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Не удалось продать акции")
        return
      }

      setMessage(`Продано! Новый баланс: $${data.walletBalance.toFixed(2)}`)
      setUser({ ...user, walletBalance: data.walletBalance })
      setForm({ ticker: "", shares: "" })
    } catch (err) {
      setError("Ошибка сервера")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Продать акции</h2>
        <div className="card-icon">$</div>
      </div>

      {message && <div className="msg-success">✓ {message}</div>}
      {error && <div className="msg-error">! {error}</div>}

      <form onSubmit={handleSell}>
        <div className="form-group">
          <label className="form-label">Тикер акции</label>
          <input
            type="text"
            placeholder="Например: DEV"
            value={form.ticker}
            onChange={e => setForm({ ...form, ticker: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Количество акций</label>
          <input
            type="number"
            placeholder="1"
            value={form.shares}
            min="1"
            step="1"
            onChange={e => setForm({ ...form, shares: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-danger" disabled={loading}>
          {loading ? "Продажа..." : "Продать"}
        </button>
      </form>
    </div>
  )
}
