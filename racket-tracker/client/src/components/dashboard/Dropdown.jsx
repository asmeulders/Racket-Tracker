import { useState, useEffect, useRef } from 'react';
import "./Dropdown.css";

const Dropdown = ({onDelete, onEdit}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="dropdown-container" style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={toggleDropdown}>
        Options ▼
      </button>

      {isOpen && (
        <ul className="dropdown-menu">
          <li onClick={() => {onEdit(); setIsOpen(false);}}>Edit</li>
          <li className="delete-option" onClick={() => {onDelete(); setIsOpen(false);}}>
            Delete
          </li>
        </ul>
      )}
    </div>
  );
};

export default Dropdown;