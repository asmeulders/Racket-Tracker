export const ListItems = ({title, items, Card, onClick, fallback}) => {
    return (
        <div className='list-container'>
            {title &&
                <h2>{title}</h2>
            }
            {items?.length === 0 ? (
                <p>{fallback}</p>
            ) : (
                <ul className="list-items">
                    {items?.map((item) => (
                        <li key={item.id} className="item-container" onClick={() => onClick(item)}> 
                            <Card item={item}/>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}