import { useState } from "react"
import './Collapsible.css'

export const Collapsible = ({renderContent}) => {
    const [ collapsed, setCollapsed ] = useState(true);

    const handleCollapse = () => {
        setCollapsed(!collapsed);
    }

    return (
        <div className="collapsible-container">
            <button type="button" className="collapsible" onClick={handleCollapse}>
                <p>{collapsed ? "\u203A Show Filters" : "\u2304 Hide Filters"}</p>
            </button>
            <div className="collapsible-content" style={{ display: collapsed ? "none" : "block"}}>
                {renderContent()}
            </div> 
        </div>
    )
}