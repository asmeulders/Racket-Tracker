export function StringList({strings}) {
    return(
        <div>
          <h2>Strings</h2>
          <ul>
            {strings.map(s => (
              <String key={s.id} string={s}/>
            ))}
          </ul>
        </div>
    )
}

export function String({string}) {
    return (
      <li >{string.name} - ${string.price_per_racket}</li>
    )
}