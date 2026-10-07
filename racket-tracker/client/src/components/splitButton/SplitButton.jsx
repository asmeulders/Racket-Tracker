

import { useState } from "react";
import "./SplitButton.css";

/**
 * Renders a custom split button component with a dropdown.
 * 
 * @component
 * @param {object} props - The component props.
 * @param {string} props.label - Text displayed on the button.
 * @param {function} props.onClick - Funciton to be called when button is pressed.
 * @param {Array} props.actions - Array of items in the drop down menu.
 * @returns {JSX.Element} The rendered button component.
 */
export const SplitButton = ({ label, onClick, dropdownActions }) => {
    const [ show, setShow ] = useState(false);

    const handleShow = () => {
        setShow(!show);
    };

    const generateDropdownClass = () => {
        return "dropdown-menu";
    }
    
    return (
        <div className="split-btn">
            {/* Main Action */}
            <button type="button" className="main-action" onClick={onClick}>{label}</button>

            {/* Dropdown Button */}
            <button type="button" className="dropdown-btn" onClick={handleShow}>&#x25BC;</button>
            <ul className={`dropdown-menu ${show && 'dropdown-menu--visible'}`}>
                {dropdownActions.map((action) => 
                    <li key={action.label} onClick={action.onClick}>{action.label}</li>
                )}
            </ul>
        </div>
    );
}