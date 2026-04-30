export default function MarketFeed({ stocks, prices }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <span className="live-dot" />
          Рынок
        </h2>
        <div className="card-icon">📈</div>
      </div>

      {stocks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏦</div>
          <p>Акций пока нет</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Тикер</th>
                <th>Владелец</th>
                <th>Цена</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map(stock => (
                <tr key={stock.ticker}>
                  <td className="td-ticker">{stock.ticker}</td>
                  <td>{stock.owner?.name}</td>
                  <td className="td-price">
                    ${(prices[stock.ticker] ?? stock.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}