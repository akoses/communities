import React, { useEffect } from 'react'
import styles from '../../styles/navigation.module.scss'
import AuthModal from './modal/AuthModal'
import {useRouter} from 'next/router'
import { useSession, signOut } from "next-auth/react"
import CollegeModal from '../common/modal/CollegeModal'
interface NaivgationProps {
	
}

const Naivgation: React.FC<NaivgationProps> = () => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [isCollegeOpen, setIsCollegeOpen] = React.useState(false);
	const [type, setType] = React.useState('Login');
	const {data: session, status} = useSession();

	const openCreate = () => {
		setIsCollegeOpen(true);
	}

	const router = useRouter()
		return (<div className={styles.container}>
			<div>
			{status === 'unauthenticated' && <button className={styles.login} onClick={() => {setIsOpen(true); setType('Login');}}>Login</button>}
			{status === 'unauthenticated' && <button className={styles.signup} onClick={() => {setIsOpen(true); setType('Sign Up')}}>Sign Up</button>}
			{status === 'authenticated' && <button className={styles.logout} onClick={() => signOut()}>Logout</button>}
			</div>
			<div>
				{status === 'authenticated' && <button className={`${styles.college} ${styles.create}`} onClick={openCreate}>Create New College</button>}
				<button className={styles.college} onClick={() => router.push('/')}>Colleges</button>	
			</div>
			
			<CollegeModal isOpen={isCollegeOpen} setOpen={setIsCollegeOpen} type={'create'}/>
			<AuthModal type={type} setOpen={setIsOpen} isOpen={isOpen} />
		</div>);
	
}

export default Naivgation