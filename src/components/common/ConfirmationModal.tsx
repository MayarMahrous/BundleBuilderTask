interface ConfirmationModalProps {
  title?: string;
  message: string;
  onClose: () => void;
}

const  ConfirmationModal = ({ title, message, onClose }: ConfirmationModalProps) => (
   <div className="modalOverlay" onClick={onClose}>
      <div
        className="modalContent"
        role="dialog"
        aria-modal="true"
        aria-labelledby="orderConfirmTitle"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modalHeader">
          <button
            type="button"
            className="modalCloseX"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="checkIcon">✓</div>
        <h2 id="orderConfirmTitle">{title}</h2>
        <p>{message}</p>
        <button type="button" className="modalCloseBtn" onClick={onClose}>
          Ok
        </button>
      </div>
    </div>
);

export default ConfirmationModal;