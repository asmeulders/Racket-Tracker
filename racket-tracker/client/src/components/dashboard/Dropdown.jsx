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

  useEffect(() => {
    console.log(isOpen);
  }, [isOpen])

  return (
    <div ref={dropdownRef} className='meatballs-btn'>
      <button onClick={toggleDropdown}>
        &hellip;
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