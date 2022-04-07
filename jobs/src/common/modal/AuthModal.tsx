import Modal from 'react-modal';
import React from 'react'
import styles from "../../../styles/modal.module.scss"

import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BiX } from "react-icons/bi";
import {signIn} from "next-auth/react"

const customStyles = {
	content: {
	  top: '50%',
	  left: '50%',
	  right: 'auto',
	  bottom: 'auto',
	  marginRight: '-50%',
	  transform: 'translate(-50%, -50%)',
	  maxWidth: '90vw',
	  padding: '10px',
	},
	overlay: {zIndex: 1000,
	  opacity: 1,
	  backgroundColor: 'rgba(0, 0, 0, 0.5)'}
  };
  
  Modal.setAppElement('#modal-event');
  
  interface ModalProps{
	isOpen: boolean
	setOpen: (isOpen: boolean) => void;
	type: string;
  }

  const AuthModal:React.FC<ModalProps>  = ({setOpen, isOpen, type}) => {
	
	function closeModal() {
		
		setOpen(false);
	  }


	return (<Modal
		isOpen={isOpen}
		style={customStyles}
		contentLabel="Login/Signup"
		onRequestClose={closeModal}
		className={styles.authModal}
		>
		<div className={styles.authModalContent}>
			<div onClick={closeModal} className={styles.exit}><BiX/></div>
			<h2 className={styles.logsign}>{type}</h2>
	<p className={styles.terms}>By continuing, you agree to our <a href="https://akose.ca/terms">terms of service</a> and <a href="https://akose.ca/privacy-policy">privacy policy</a>.</p>
	<div onClick={() => signIn('facebook')} className={styles.LoginItem}>
	<button className={`${styles.authButton} ${styles.facebook}`}>
		<FaFacebook/> Continue with Facebook
	</button>
	</div>
	<div onClick={() => {signIn('google')}} className={styles.LoginItem}>
	<button className={`${styles.authButton} ${styles.google}`}><FcGoogle />Continue with Google</button>
  </div>
  <div onClick={() => {signIn('linkedin')}} className={styles.LoginItem}>
	<button className={`${styles.authButton} ${styles.linkedin}`}><FaLinkedin />Continue with Linkedin</button>
  </div>
  </div>

	</Modal>)
  }

export default AuthModal;