import React, {useContext, useEffect } from 'react';
import styles from '../../styles/navigation.module.scss';
import AuthModal from './modal/AuthModal';
import {useRouter} from 'next/router';
import { useSession, signOut } from "next-auth/react";
import CollegeModal from '../common/modal/CollegeModal';
import {Option} from 'react-dropdown';
import {RiArrowUpSLine, RiArrowDownSLine} from 'react-icons/ri';
import {CgProfile} from 'react-icons/cg';
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
const loggedOutDropdownOptions = [{label:'View All Communities', value: 'find'}, {label:'Login', value: 'login'}, {label:'Sign Up', value: 'signup'}, ]

const Naivgation: React.FC<NaivgationProps> = () => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [isCollegeOpen, setIsCollegeOpen] = React.useState(false);
	const [type, setType] = React.useState('Login');
	const {status} = useSession();
	
	
	const context = useContext(AppContext);
	const colleges = Object.values(context.collegeData);
	const [reactColleges, setColleges] = React.useState<any>([]);
	const [searchCollege, setSearch] = React.useState('');
	const [display, setDisplay] = React.useState<boolean>(false)
	const searchRef = React.useRef<any>(null);
	const [openDropDown, setDropDown] = React.useState(false);
	const [gtFour, setGtFour] = React.useState(false);
	const [touchable, setTouchable] = React.useState(true);
	const router = useRouter()
	
	useEffect(() => {
		if (document) {
			document.addEventListener('touchstart', () => {
				if (openDropDown) {
					setDropDown(false);
				}
				
				//console.log('touchstart')
			})
			
			if (document.body.clientWidth > 425) {
				setGtFour(true)
			}else {
				setGtFour(false)
			}
		}
	},[openDropDown])

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
		setColleges(colls.map(mapColleges).slice(0, 4))
		}

	
	const mapColleges = (college:Colleges) => {
		return <Link key={college.id}  passHref href={'/'+ convertName(college.name)}>
			<div onTouchEnd={(e) => clicked(e, college.name)} key={college.id} className={styles.mapCollege}>
			<img src={college.logo} alt={college.name}/>
			<p>{college.name}</p>
			</div>
		</Link>
		
	}
	const openCreate = () => {
		setIsCollegeOpen(true);
	}

	const clicked = (e:React.TouchEvent<HTMLDivElement>, name:string) => {
		e.preventDefault();
		e.stopPropagation();
		router.push('/' + convertName(name));
		setDisplay(false);
		setSearch('');
		document.body.focus();
	}

	const changeDashboard = (event:any, e:Option) => {
		event.preventDefault();
		event.stopPropagation();
		switch (e.value) {
			case 'create':
				openCreate();
				setTimeout(() => {
					setDropDown(false);
				} , 200);
				return;
			case 'feed':
				Router.push('/feed');
				setTimeout(() => {
					setDropDown(false);
				} , 100);
				return;
			case 'find':
				Router.push('/all-communities');
				setTimeout(() => {
					setDropDown(false);
				} , 200);
				return;
			case 'community':
				Router.push('/communities');
				setTimeout(() => {
					setDropDown(false);
				} , 200);
				return;
			case 'posts':
				Router.push('/posts');
				setTimeout(() => {
					setDropDown(false);
				} , 200);
				break;
			case 'login':
				
				setType('Login');
				setIsOpen(true);
				setTimeout(() => {
					setDropDown(false);
				} , 150);
				return;

			case 'signup':
				
				setType('Sign Up');
				setIsOpen(true);
				setTimeout(() => {
					setDropDown(false);
				} , 150);
				return;
			
			case 'logout':
				signOut();
				return;
		}
		
	}


const renderLabels = () => {
	if (status === 'authenticated') {
		return loggedInDropdownOptions.map((option:any) => {
			return <div key={option.value} onTouchEnd={(e) => changeDashboard(e, option)} className={styles.dropdownItem}>{option.label}</div>
		})
	}
	else {
		return loggedOutDropdownOptions.map((option:any) => {
			return <div key={option.value}   onTouchEnd={(e) => changeDashboard(e, option)} className={styles.dropdownItem}>{option.label}</div>
		})
	}
}

const touchBar = (e:any) => {
	if (e.touches.length === 1) {
		setTouchable(true);
		console.log('Hello')
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

const touchInput = (e:any) => {
	
	e.target.focus({preventScroll: true});
}

const blurSearch = () => {
	setDisplay(false)
}

const openDropDownFn = (e:any) => {
	e.preventDefault();
	e.stopPropagation();
	if (openDropDown) {
		setDropDown(false);
	}
	else {
		setDropDown(true);
	}
	
}

	
		return (<div className={styles.container}>
			<div className={styles.containerHeader}>
			<div>
			<div className={styles.college} onClick={() => router.push('/')}>
				<img className={styles.akoseLogo} src="https://d18px979babcec.cloudfront.net/static/logo.png" alt="Akose Logo"/>
			</div>
			</div>
			<div className={styles.buttons}>
			<div onTouchStart={openDropDownFn}  className={styles.homeDropdown}><CgProfile /> {openDropDown?<RiArrowUpSLine/>:<RiArrowDownSLine/>}</div>
			<div className={styles.dropdownMenu} style={{display:openDropDown?'block':'none'}}>
				{renderLabels()}
			</div>
			</div>
			</div>
			<CollegeModal isOpen={isCollegeOpen} setOpen={setIsCollegeOpen} type={'create'}/>
			<AuthModal type={type} setOpen={setIsOpen} isOpen={isOpen} />
			
			<div ref={searchRef} className={`${styles.findCollegeTitle}`}>
				<input onTouchStart={touchInput}  ref={searchRef} onFocus={focusSearch} onBlur={blurSearch} value={searchCollege} onChange={filterColleges} type="search" placeholder="Search for an Akose Community" />
				  <div onTouchStart={() => setTouchable(false)} onTouchMove={touchBar} className={styles.searchResults} style={{ display:display?'block':'none'}}>
					  {reactColleges}
				  </div>
				  </div>
		</div>);
	
}

export default Naivgation

