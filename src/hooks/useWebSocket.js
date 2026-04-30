import { useEffect, useState, useRef } from "react"

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:5000"
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function useWebSocket(token) {
  const [prices, setPrices] = useState({})
  const [stocks, setStocks] = useState([])
  const [tradeSignal, setTradeSignal] = useState(0)
  const wsRef = useRef(null)
  const reconnectRef = useRef(null)

  // Первичная загрузка акций
  useEffect(() => {
    fetchStocks()
  }, [])

  const fetchStocks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/stocks`)
      const data = await res.json()
      if (res.ok) setStocks(data.stocks)
    } catch (err) {
      console.error("Ошибка загрузки акций:", err)
    }
  }

  useEffect(() => {
    if (!token) return

    function connect() {
      const ws = new WebSocket(WS_URL, [token])
      wsRef.current = ws

      ws.onopen = () => {
        console.log("WS подключён")
      }

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data)

          if (data.type === "TICKER_UPDATE") {
            const { ticker, price } = data.payload

            // Обновляем prices
            setPrices(prev => ({ ...prev, [ticker]: price }))

            // Обновляем prices внутри stocks тоже
            setStocks(prev =>
              prev.map(s => s.ticker === ticker ? { ...s, price } : s)
            )
          }

          if (data.type === "TRADE_UPDATE") {
            // Сигнал что произошла сделка — триггерит рефетч Portfolio
            setTradeSignal(prev => prev + 1)
          }

          if (data.type === "NEW_STOCK") {
            // Новая акция появилась на рынке
            setStocks(prev => {
              const exists = prev.find(s => s.ticker === data.payload.ticker)
              return exists ? prev : [...prev, data.payload]
            })
          }
        } catch (err) {
          console.error("WS parse error:", err)
        }
      }

      ws.onclose = () => {
        console.log("WS отключён, переподключение через 3 сек...")
        reconnectRef.current = setTimeout(connect, 3000)
      }

      ws.onerror = (err) => {
        console.error("WS ошибка:", err)
        ws.close()
      }
    }

    connect()

    return () => {
      clearTimeout(reconnectRef.current)
      if (wsRef.current) wsRef.current.close()
    }
  }, [token])

  return { prices, stocks, tradeSignal, refetchStocks: fetchStocks }
}