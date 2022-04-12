import React, {useRef, useContext, useEffect } from 'react';
import styles from '../../styles/navigation.module.scss';
import AuthModal from './modal/AuthModal';
import {useRouter} from 'next/router';
import { useSession, signOut } from "next-auth/react";
import CollegeModal from '../common/modal/CollegeModal';
import Dropdown, {Option} from 'react-dropdown';
import {RiArrowUpSLine, RiArrowDownSLine} from 'react-icons/ri';
import {AiTwotoneHome} from 'react-icons/ai';
import Router from 'next/router';
import AppContext from '../../contexts/AppContext';
import 'react-dropdown/style.css';
import { convertName } from './utils';
import Link from 'next/link';
import SimpleBar from 'simplebar-react'
import {Colleges} from '@prisma/client'

interface NaivgationProps {
	
}

const loggedInDropdownOptions = [{label:'Create New Community',
	value: 'create'
},  {label:'Feed', value: 'feed'},{label:'View All Communities', value: 'find'}, {label:'My Communities', value: 'community'}, {label:'My Posts', value: 'posts'}, {label:'Logout', value:'logout'},
]
const loggedOutDropdownOptions = [{label:'View All Communities', value: 'find'}, {label:'Sign Up', value: 'signup'}, {label:'Login', value: 'login'}]

const Naivgation: React.FC<NaivgationProps> = () => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [isCollegeOpen, setIsCollegeOpen] = React.useState(false);
	const [type, setType] = React.useState('Login');
	const {status} = useSession();
	const dropDownRef = useRef<any>(null);
	const [dropdownValue, setDropdownValue] = React.useState<any>('');
	const context = useContext(AppContext);
	const colleges = Object.values(context.collegeData);
	const [reactColleges, setColleges] = React.useState<any>([]);
	const [searchCollege, setSearch] = React.useState('');
	const [display, setDisplay] = React.useState<boolean>(false)
	const searchRef = React.useRef<any>(null);

	const router = useRouter()
	

	const filterColleges = (e:any) => {
		setSearch(e.target.value);
		
		if (e.target.value === '') {
			setDisplay(false)
			return
		}
		else {
			setDisplay(true)
		}
		
		let colls = colleges.filter((college:any) => {
		  return college.name.toLowerCase().includes(e.target.value.toLowerCase())
		})
		setColleges(colls.map(mapColleges))
		}

	
	const mapColleges = (college:Colleges) => {
		return <Link key={college.id}  passHref href={'/'+ convertName(college.name)}>
			<div onMouseDown={(e) => clicked(e, college.name)} key={college.id} className={styles.mapCollege}>
			<img src={college.logo} alt={college.name}/>
			<p>{college.name}</p>
			</div>
		</Link>
		
	}
	const openCreate = () => {
		setIsCollegeOpen(true);
	}
	const clicked = (e:React.MouseEvent<HTMLDivElement>, name:string) => {
		e.stopPropagation();
		
		e.preventDefault();
		router.push('/' + convertName(name));
		setDisplay(false)
		setSearch('')
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
				Router.push('/all-communities');
				break;
			case 'community':
				Router.push('/communities');
				break;
			case 'posts':
				Router.push('/posts');
				break;
			case 'logout':
				signOut();
				break;
		}

		
		
		

	}



const focusSearch = (e:any) => {
	if (e.target.value === '') {
		setDisplay(false)
	}
	else {
		setDisplay(true)
	}
}

const blurSearch = () => {
	
	setDisplay(false)
}

	
		return (<div className={styles.container}>
			<div className={styles.college} onClick={() => router.push('/')}>
				<img className={styles.akoseLogo} src="https://d18px979babcec.cloudfront.net/static/logo.png" alt="Akose Logo"/>
			</div>
			<div ref={searchRef} className={`${styles.title} ${styles.findCollegeTitle}`}>
          <input onFocus={focusSearch} onBlur={blurSearch} value={searchCollege} onChange={filterColleges} type="search" placeholder="Search for an Akose community" />
        	<SimpleBar  className={styles.searchResults} style={{maxHeight: 380, display:display?'block':'none'}}>
				{reactColleges}
			</SimpleBar>
			</div>
			<div>
			{status === 'unauthenticated' && <button className={styles.login} onClick={() => {setIsOpen(true); setType('Login');}}>Login</button>}
			{status === 'unauthenticated' && <button className={styles.signup} onClick={() => {setIsOpen(true); setType('Sign Up')}}>Sign Up</button>}
			
			</div>
			
			<div className={styles.buttons}>
				 <Dropdown 
					ref={dropDownRef}
					arrowClosed={<RiArrowDownSLine/>}
					arrowOpen={<RiArrowUpSLine/>}
					menuClassName={styles.menu}
					controlClassName={styles.control}
					value={dropdownValue}
					onFocus={() => setDisplay(false)}
					//@ts-ignore
					placeholder={<div className={styles.homeDropdown}><AiTwotoneHome /></div>}
					arrowClassName={styles.arrow}
				className={styles.dropdown} options={status === 'authenticated'?loggedInDropdownOptions:loggedOutDropdownOptions} onChange={changeDashboard} />
			</div>
			<CollegeModal isOpen={isCollegeOpen} setOpen={setIsCollegeOpen} type={'create'}/>
			<AuthModal type={type} setOpen={setIsOpen} isOpen={isOpen} />
		</div>);
	
}

export default Naivgation

