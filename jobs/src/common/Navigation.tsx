import React, {useRef } from 'react';
import styles from '../../styles/navigation.module.scss';
import AuthModal from './modal/AuthModal';
import {useRouter} from 'next/router';
import { useSession, signOut } from "next-auth/react";
import CollegeModal from '../common/modal/CollegeModal';
import Dropdown, {Option} from 'react-dropdown';
import {RiArrowUpSLine, RiArrowDownSLine} from 'react-icons/ri';
import {AiTwotoneHome} from 'react-icons/ai';
import Router from 'next/router';
import 'react-dropdown/style.css';
interface NaivgationProps {
	
}

const dropdownOptions = [{label:'Create New College',
	value: 'create'
},  {label:'Feed', value: 'feed'},{label:'Find Colleges', value: 'find'}, {label:'Colleges', value: 'colleges'}, {label:'Posts', value: 'posts'}, {label:'Logout', value:'logout'},
]

const Naivgation: React.FC<NaivgationProps> = () => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [isCollegeOpen, setIsCollegeOpen] = React.useState(false);
	const [type, setType] = React.useState('Login');
	const {status} = useSession();
	const dropDownRef = useRef<any>(null);
	const [dropdownValue, setDropdownValue] = React.useState<any>('');
	const openCreate = () => {
		setIsCollegeOpen(true);
	}
	

	const changeDashboard = (e:Option) => {
		switch (e.value) {
			case 'create':
				openCreate();
				break;
			case 'feed':
				Router.push('/feed');
				break;
			case 'find':
				Router.push('/find-colleges');
				break;
			case 'colleges':
				Router.push('/colleges');
				break;
			case 'posts':
				Router.push('/posts');
				break;
			case 'logout':
				signOut();
				break;
		}

		
		
		

	}

	const router = useRouter()
		return (<div className={styles.container}>
			<div className={styles.college} onClick={() => router.push('/')}>
				<img className={styles.akoseLogo} src="/logo.png" alt="Akose Logo"/>
			</div>
			<div>
			{status === 'unauthenticated' && <button className={styles.login} onClick={() => {setIsOpen(true); setType('Login');}}>Login</button>}
			{status === 'unauthenticated' && <button className={styles.signup} onClick={() => {setIsOpen(true); setType('Sign Up')}}>Sign Up</button>}
			
			
			</div>
			
			{status === 'authenticated' &&<div className={styles.buttons}>
				 <Dropdown 
					ref={dropDownRef}
					arrowClosed={<RiArrowDownSLine/>}
					arrowOpen={<RiArrowUpSLine/>}
					menuClassName={styles.menu}
					controlClassName={styles.control}
					value={dropdownValue}
					//@ts-ignore
					placeholder={<div className={styles.homeDropdown}><AiTwotoneHome />Dashboard</div>}
					arrowClassName={styles.arrow}
				className={styles.dropdown} options={dropdownOptions} onChange={changeDashboard} />
			</div>}
			<CollegeModal isOpen={isCollegeOpen} setOpen={setIsCollegeOpen} type={'create'}/>
			<AuthModal type={type} setOpen={setIsOpen} isOpen={isOpen} />
		</div>);
	
}

export default Naivgation

