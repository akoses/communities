/* eslint-disable @next/next/no-img-element */
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

Modal.setAppElement('#modal-event');




interface ModalProps{
	event:any;
	isOpen: boolean
	setOpen: (isOpen: boolean) => void;
}

const EventModal:React.FC<ModalProps> = ({setOpen, isOpen, event}) => {
	const [modalIsOpen, setIsOpen] = React.useState(isOpen);

	useEffect(() => {
		setIsOpen(isOpen)
		setOpen(isOpen)
		
	}, [isOpen])

  function closeModal() {
    setIsOpen(false);
	setOpen(false);
  }

  return (
    
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={`Event ${event.name}`}
      >
		  <div className={styles.event}>
			  <div className={styles.header}>
		  <h2 className={styles.question}>{event.name}</h2>
		  <img className={styles.logo} src={event.org_logo == ''? '/default.png':event.org_logo}  alt={event.name}
				
			/>
			</div>
			<div className={styles.details}>
		  <h3 className={styles.date}>{event.date_str}</h3>
  
			<h3>{event.location}</h3>
			{event.organization && <h3>Hosted by {event.organization}</h3>}
			</div>
			
			<div className={styles.eventDescription} dangerouslySetInnerHTML={{__html:event.description}}></div>
			<div className={styles.buttons}>
			<a href={event.event_link} target="_blank" rel="noopener noreferrer">Link To Event</a>
			<button className={styles.close} onClick={closeModal}>Close</button>
			</div>
	</div>
	  </Modal>
   
  );
}

export default EventModal