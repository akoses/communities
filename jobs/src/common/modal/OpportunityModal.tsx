/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import Modal from 'react-modal';
import React, {useEffect} from 'react'
import styles from "../../../styles/modal.module.scss"
import { BiX } from "react-icons/bi";


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
	borderTop: '3px solid #ccc',
	width: '95vw',
	maxWidth:"800px",
	maxHeight: '80vh',
  },
  overlay: {zIndex: 1000,
	opacity: 1,
	backgroundColor: 'rgba(0, 0, 0, 0.5)'}
};

Modal.setAppElement('#modal-event');


interface ModalProps{
opportunity:any;
	isOpen: boolean
	setOpen: (isOpen: boolean) => void;
}

const OpportunityModal:React.FC<ModalProps> = ({setOpen, isOpen, opportunity}) => {
	

	useEffect(() => {
		setOpen(isOpen)
	}, [isOpen])

  function closeModal() {
	setOpen(false);
  }

  return (
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={`Opportunity ${opportunity.name}`}
      >
		  <div className={styles.event}>
			  <div className={styles.opportunityHeader}>
				  <div>
					  <div onClick={closeModal} className={styles.opportunityExit}><BiX/></div>
		  <h2 className={styles.opportunityHead}>{opportunity.name}</h2>
		  <div className={styles.opportunityDetails}>
			<h3>{opportunity.organization}</h3> 
			<h3>{opportunity.location} | {opportunity.workstyle.charAt(0).toUpperCase() + opportunity.workstyle.slice(1)}</h3>
			<div className={styles.opportunityButton}>
			<a href={opportunity.apply_link} className={styles.applyLink} target="_blank" rel="noopener noreferrer">Apply</a>
			</div>
			
			</div>
		  </div>
		  <img className={styles.logo} src={opportunity.logo == ''? '/default.png':opportunity.logo}  alt={opportunity.name}
			/>
			
			</div>
			
		
			<div className={styles.oppDescription} dangerouslySetInnerHTML={{__html:opportunity.description}}></div>
			<br />
	</div>
	  </Modal>
   
  );
}

export default OpportunityModal