import "../styles/Modal.css";

const Modal = ({ show, children, showModal, setShowModal, setIdShown }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  const handleclick = (e) => {
    if (
      e.target.className.includes("modal display") ||
      e.target.className.includes("close-modal-button")
    ) {
      setShowModal(!showModal);
      setIdShown(1);
    }
  };

  return (
    <div className={showHideClassName} onClick={handleclick}>
      <section className="modal-main">
        {children}
        <button className="button close-modal-button" onClick={handleclick}>
          Zamknij
        </button>
      </section>
    </div>
  );
};

export default Modal;
