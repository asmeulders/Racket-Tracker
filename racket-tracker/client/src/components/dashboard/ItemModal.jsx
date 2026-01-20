import ReactDOM from 'react-dom';
import "./ItemModal.css";

const ItemModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ItemModal;