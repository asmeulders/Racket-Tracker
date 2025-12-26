export function OrderList({orders}) {
    return(
        <div>
          <h2>Orders</h2>
          <ul>
            {orders.map(o => (
              <Order key={o.id} order={o}/>
            ))}
          </ul>
        </div>
    )
}

export function Order({order}) {
    return (
        <li style={{marginBottom: "10px", borderBottom: "1px solid #ccc"}}>
          <strong>{order.ordered_on}</strong> - {order.racket_name}
          <ul style={{fontSize: "0.9em", color: "#555"}}>
            {order.job_details && order.job_details.map((job, index) => (
              <li key={index}>
                {job.string_name} @ {job.tension}lbs 
                {job.direction ? ` (${job.direction})` : ''}
              </li>
            ))}
          </ul>
        </li>
    )
}