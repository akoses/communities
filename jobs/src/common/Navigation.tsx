import React from 'react'
import styles from '../../styles/navigation.module.scss'
import AuthModal from './modal/AuthModal'
import {useRouter} from 'next/router'
interface NaivgationProps {
	isUserAuthenticated: boolean;
}

const Naivgation: React.FC<NaivgationProps> = ({
	isUserAuthenticated,
}) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [type, setType] = React.useState('Login');
	const router = useRouter()
		return (<div className={styles.container}>
			<div>
			{!isUserAuthenticated && <button className={styles.login} onClick={() => {setIsOpen(true); setType('Login');}}>Login</button>}
			{!isUserAuthenticated && <button className={styles.signup} onClick={() => {setIsOpen(true); setType('Sign Up')}}>Sign Up</button>}
			{isUserAuthenticated && <button>Logout</button>}
			</div>
			<button className={styles.college} onClick={() => router.push('/')}>Colleges</button>
			<AuthModal type={type} setOpen={setIsOpen} isOpen={isOpen} />
		</div>);
	
}

export default Naivgation