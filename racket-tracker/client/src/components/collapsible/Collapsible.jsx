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
                <p>{collapsed ? "Show Filters" : "Hide Filters"}</p>
                <p>{collapsed ? '\u203A' : '\u2304'}</p>
            </button>
            <div className="content" style={{ display: collapsed ? "none" : "block"}}>
                {renderContent()}
            </div> 
        </div>
    )
}