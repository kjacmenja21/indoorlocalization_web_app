import React, { useState } from "react";
import "./_odal.scss"; // Import the Sass file

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null; // Don't render if the modal is closed
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div
        className="modal__container"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button className="modal__close" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal__title">{title}</h2>
        <div className="modal__content">{children}</div>
      </div>
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button className="app__button" onClick={openModal}>
        Open Modal
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal} title="My Modal">
        <p>This is the content of the modal!</p>
      </Modal>
    </div>
  );
}

export default App;
