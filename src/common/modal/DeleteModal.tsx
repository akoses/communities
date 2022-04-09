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
	maxWidth: '90vw',
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
	const [permanently, setPermanently] = React.useState('')
	useEffect(() => {
		setIsOpen(isOpen)
		setOpen(isOpen)
	}, [isOpen])

	const deleteItem = () => {
		if (type === 'collge') {
			if (permanently === 'permanently delete') {
				func()
				setIsOpen(!isOpen);
				setOpen(!isOpen);
			}
		}
		else{
			func()
		setIsOpen(!isOpen);
		setOpen(!isOpen);
		}
		
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
		  <h2 className={styles.question}>Are you sure you want to delete this {type}?</h2>
		  <p className={styles.gone}>Once you delete this {type}, it will be gone forever.</p>
		  {type === 'community' && <div className={styles.permanently}>
				<p>Please type <i>permanently delete</i> to delete this {type}.</p>
				<input value={permanently} onChange={(e) => setPermanently(e.target.value)} type="text" placeholder="permanently delete" />
				</div>}
		  <div className={styles.options}>
			<button onClick={closeModal}>Cancel</button>
		  	<button className={styles.delete} style={{
				  opacity:type === 'community' && permanently !== 'permanently delete'?0.6:1,
				  pointerEvents:type === 'community' && permanently !== 'permanently delete'?'none':'auto'	
		}} onClick={deleteItem}>Delete</button>
		  </div>
		
      </Modal>
   
  );
}

export default DeleteModal