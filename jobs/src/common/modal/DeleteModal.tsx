/* eslint-disable react-hooks/exhaustive-deps */
import Modal from 'react-modal';
import React, {useEffect} from 'react'
import styles from "../../../styles/modal.module.scss"
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
  overlay: {zIndex: 1000,
	opacity: 1,
	backgroundColor: 'rgba(0, 0, 0, 0.5)'}
};

Modal.setAppElement('#modal-spot');



interface ModalProps{
	isOpen: boolean
	type: string;
	func: () => void;
	setOpen: (isOpen: boolean) => void;
}

const DeleteModal:React.FC<ModalProps> = ({setOpen, isOpen, type, func}) => {
	const [modalIsOpen, setIsOpen] = React.useState(isOpen);

	useEffect(() => {
		setIsOpen(isOpen)
		setOpen(isOpen)
	}, [isOpen])

	const deleteItem = () => {
		func()
		setIsOpen(!isOpen);
		setOpen(!isOpen);
	}

  function closeModal() {
    setIsOpen(!isOpen);
	setOpen(!isOpen);
  }

  return (
    
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={`Delete ${type}`}
      >
		  <h2 className={styles.question}>Are you want to delete this {type}?</h2>
		  <p className={styles.gone}>Once you delete this {type}, it will be gone forever.</p>
		  <div className={styles.options}>
			<button onClick={closeModal}>Cancel</button>
		  	<button className={styles.delete} onClick={deleteItem}>Delete</button>
		  </div>
		
      </Modal>
   
  );
}

export default DeleteModal