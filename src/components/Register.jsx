import { useState } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function Register({ onAuth }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        return
      }

      onAuth(data.token, data.user)
    } catch (err) {
      setError("Ошибка сервера")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-logo">
        <span className="auth-logo-text">PEX</span>
      </div>
      <h2>Создать аккаунт</h2>
      <p className="auth-subtitle">Начните торговать уже сегодня</p>

      {error && <div className="msg-error">⚠ {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Имя</label>
          <input
            type="text"
            placeholder="Иван Трейдеров"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            placeholder="trader@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Пароль</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Создание..." : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  )
}