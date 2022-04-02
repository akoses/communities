import Modal from 'react-modal';
import React from 'react'
import styles from "../../../styles/modal.module.scss"
import {GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { FaFacebook } from "react-icons/fa";
import { BiX } from "react-icons/bi";
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
	isOpen: boolean
	setOpen: (isOpen: boolean) => void;
	type: string;
  }

  const AuthModal:React.FC<ModalProps>  = ({setOpen, isOpen, type}) => {
	
	

	const facebookClicked = () => {

	}

	const facebookCallback = (response:any) => {

	}

	function closeModal() {
		
		setOpen(false);
	  }

	const googleResponse = () => {}

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
	<p className={styles.terms}>By continuing, you agree to our <a href="https://akose.ca/terms">terms of service</a> and <a href="https://akose.ca/privacy">privacy policy</a>.</p>
	<div className={styles.LoginItem}>
	<FacebookLogin
    appId="1376487722851188"
    autoLoad={false}
    fields="name,email,picture"
	textButton=' Continue with Facebook'
	cssClass={styles.facebook}
    onClick={facebookClicked}
	icon={<FaFacebook />}
    callback={facebookCallback} />
	</div>
	<div className={styles.LoginItem}>
	<GoogleLogin
    clientId="613397449428-hr6kpfun1jo12bf1k5k26pm6kt0cs26q.apps.googleusercontent.com"
    buttonText="Continue With Google"
    onSuccess={googleResponse}
    onFailure={googleResponse}
    cookiePolicy={'single_host_origin'}
	className={styles.google}
  />
  </div>
  </div>

	</Modal>)
  }

export default AuthModal;