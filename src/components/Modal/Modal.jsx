import React, { useState } from "react";
import "./_modal.scss";

const Modal = ({ buttonText, title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen((prevState) => !prevState);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="container">
      <div className="details-container">
        {/* Button to trigger the modal */}
        <button className="button" onClick={toggleModal}>
          {buttonText}
        </button>

        {/* Modal Overlay and Modal */}
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="details-modal-overlay"
              onClick={closeModal} // Clicking the overlay closes the modal
            ></div>

            {/* Modal */}
            <div className="details-modal">
              {/* Close Button */}

              {/* Modal Title */}
              <div className="details-modal-title">
                <h1>{title}</h1>
                <button id="close" onClick={closeModal}>
                  close
                </button>
                {/* <IoIosClose
                  className="details-modal-close"
                  onClick={closeModal}
                /> */}
              </div>

              {/* Modal Content */}
              <div className="details-modal-content">
                {" "}
                {React.cloneElement(children, { closeModal })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
