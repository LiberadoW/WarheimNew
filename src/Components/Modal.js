import "../styles/Modal.css"

const Modal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
  
    return (
      <div className={showHideClassName} onClick={handleClose}>
        <section className="modal-main">
          {children}
          <button className="button close-modal-button" onClick={handleClose}>
            Zamknij
          </button>
        </section>
      </div>
    );
  };

  export default Modal