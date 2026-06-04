import "./NewItem.css";

export function NewItem({ onClick, className}) {

    return (
        <button className={className} onClick={onClick}>+</button>
    )
}