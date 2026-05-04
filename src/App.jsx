import { useState } from "react"
import Login from "./components/Login"
import Register from "./components/Register"
import Portfolio from "./components/Portfolio"
import MarketFeed from "./components/MarketFeed"
import TradePanel from "./components/TradePanel"
import StockSale from "./components/StockSale"
import UpdatePrice from "./components/UpdatePrice"
import useWebSocket from "./hooks/useWebSocket"

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  )
  const [showRegister, setShowRegister] = useState(false)

  const { prices, stocks, tradeSignal, refetchStocks } = useWebSocket(token)

  const handleAuth = (token, user) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  if (!token) {
    return (
      <div className="auth-wrapper">
        {showRegister ? (
          <>
            <Register onAuth={handleAuth} />
            <div style={{ position: "absolute", bottom: "32px" }}>
              <div className="auth-switch">
                Уже есть аккаунт?{" "}
                <button onClick={() => setShowRegister(false)}>Войти</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Login onAuth={handleAuth} />
            <div style={{ position: "absolute", bottom: "32px" }}>
              <div className="auth-switch">
                Нет аккаунта?{" "}
                <button onClick={() => setShowRegister(true)}>Регистрация</button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div>
      <header className="app-header">
        <div className="app-header-brand">
          <h1>PEX</h1>
        </div>
        <div className="app-header-user">
          <div className="app-header-greeting">
            Привет, <span>{user?.name}</span>!
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </header>

      <div className="app-grid">
        <Portfolio user={user} prices={prices} token={token} tradeSignal={tradeSignal} />
        <UpdatePrice user={user} token={token} onUpdate={updateUser} onStockCreated={refetchStocks} />
        <TradePanel token={token} user={user} setUser={updateUser} />
        <MarketFeed stocks={stocks} prices={prices} />
        <StockSale token={token} user={user} setUser={updateUser} />
      </div>
    </div>
  )
}
