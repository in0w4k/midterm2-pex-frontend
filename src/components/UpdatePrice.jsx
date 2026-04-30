import { useState } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function UpdatePrice({ user, token, onUpdate }) {
  const [price, setPrice] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (!user?.ticker) {
    return (
      <div className="card">
        <div className="card-header">
          <h2>Моя акция</h2>
          <div className="card-icon">🪙</div>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">🚀</div>
          <p>У тебя ещё нет тикера</p>
        </div>
        <CreateTicker token={token} onUpdate={onUpdate} user={user} />
      </div>
    )
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const res = await fetch(
        `${API_URL}/api/stocks/${user.ticker}/price`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ price: Number(price) })
        }
      )
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        return
      }

      setMessage(`Цена обновлена! Новая цена: $${data.stock.price}`)
      setPrice("")
    } catch (err) {
      setError("Ошибка сервера")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Моя акция</h2>
        <span className="badge badge-indigo">{user.ticker}</span>
      </div>

      {message && <div className="msg-success">✓ {message}</div>}
      {error && <div className="msg-error">⚠ {error}</div>}

      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label className="form-label">Новая цена</label>
          <input
            type="number"
            placeholder="0.00"
            value={price}
            min="0.01"
            step="0.01"
            onChange={e => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Обновление..." : "Обновить цену"}
        </button>
      </form>
    </div>
  )
}

function CreateTicker({ token, onUpdate, user }) {
  const [form, setForm] = useState({ ticker: "", price: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_URL}/api/stocks/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ticker: form.ticker.toUpperCase(),
          price: Number(form.price)
        })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        return
      }

      onUpdate({ ...user, ticker: data.stock.ticker })
    } catch (err) {
      setError("Ошибка сервера")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="divider" />
      <h2 style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "14px" }}>
        Создать тикер
      </h2>
      {error && <div className="msg-error">⚠ {error}</div>}
      <form onSubmit={handleCreate}>
        <div className="form-group">
          <label className="form-label">Тикер</label>
          <input
            type="text"
            placeholder="Например: DEV"
            value={form.ticker}
            onChange={e => setForm({ ...form, ticker: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Начальная цена</label>
          <input
            type="number"
            placeholder="0.00"
            value={form.price}
            min="0.01"
            step="0.01"
            onChange={e => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Создание..." : "Создать тикер"}
        </button>
      </form>
    </>
  )
}