/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { useState, useEffect } from 'react'
import styles from '../../styles/college.module.scss'
import Tooltip from '@mui/material/Tooltip';
import Router from 'next/router';

import OpportunityContainer from './opportunities/OpportunityContainer'
import ResourceContainer from './resources/ResourceContainer';
import EventContainer from './events/EventContainer';


import {BsFillBellFill, BsFillBellSlashFill, BsPeopleFill} from 'react-icons/bs';
import {FaShare} from 'react-icons/fa';


interface collegeProps {
	college:any;
}

enum CollegeSelect {
	Opportunities = 'opportunities',
	Events = 'events',
	Resources = 'resources'
}



const CommunityPreview: React.FC<collegeProps> = ({college}) => {
	const [selected, setSelected] = useState(CollegeSelect.Opportunities);
	const [isOpen, setIsOpen] = useState(false);
	const [hasJoined] = useState(false);
	const [hasNotifications] = useState(true);
	const [collegeCount, setCollegeCount] = useState('1 - 99');

	useEffect(() => {
		
		let path = Router.asPath.split('/')
		switch (path[path.length-1]) {
			case 'opportunities':
				setSelected(CollegeSelect.Opportunities)
				break;
			case 'events':
				setSelected(CollegeSelect.Events)
				break;
			case 'resources':
				setSelected(CollegeSelect.Resources)
				break;
			default:
				setSelected(CollegeSelect.Opportunities)
		}

		if (college?.collegeCount < 100) {
			setCollegeCount(`1 - 99`)
		}
		else if (college?.collegeCount < 1000) {
			setCollegeCount(`100 - 999`)
		}
		else if (college?.collegeCount >= 1000) {
			setCollegeCount(`1000+`)
		}
		
	}, [college])




	const selectComponent = (collegeSelect: CollegeSelect) => {
		setSelected(collegeSelect);
	}
		return (<div className={styles.collegePage}>
			<div>
			<img className={styles.banner} src={college?.banner}/>
			</div>
			<div className={styles.body}>
				<img className={styles.collegeLogo} src={college?.logo}/>
				<div className={styles.collegeHeader}>
				<div className={styles.topHead}>
				<div>
				<h1 className={styles.name}>{college?.name}</h1>
				<div className={styles.people}><BsPeopleFill /> {collegeCount}</div>
				</div>
				<div className={styles.midHead}>
				<Tooltip title="Create or post an opportunity, event or resources." placement="top">
				<div className={styles.post} >Create Post</div>
				</Tooltip>
				</div>
				</div>	
				<p className={styles.description}>{college?.description}</p>
				<div className={styles.bottomHead}>
				<Tooltip title="Copy Community URL to clipboard." placement="top">
				<div className={styles.url}><span>Share</span><FaShare /></div>
				</Tooltip>
				<div className={styles.subscribe}>{hasJoined?'Joined':'Join'}</div>
			<Tooltip title={!hasNotifications?'Get Email Notifications For This Community':"Turn Off Email Notifications For This Community"}><div className={styles.bellIcon}>{hasNotifications?<BsFillBellFill/>:<BsFillBellSlashFill/>}</div></Tooltip>
				
				</div>
				</div>
				
			</div>
			<div className={styles.options}>
				<ul>
					<li
						onClick={() => {selectComponent(CollegeSelect.Opportunities);}}
					className={selected === CollegeSelect.Opportunities?styles.selected:""}>Opportunities</li>
					<li 
						onClick={() => selectComponent(CollegeSelect.Events)}
					className={selected === CollegeSelect.Events?styles.selected:""}>Events</li>
					<li 
						onClick={() => selectComponent(CollegeSelect.Resources)}
					className={selected === CollegeSelect.Resources?styles.selected:""}>Resources</li>
				</ul>
			</div>
			<div className={styles.objectContent}>
			{selected === CollegeSelect.Opportunities && <OpportunityContainer jobs={[]}/>}
			{selected === CollegeSelect.Events && <EventContainer events={[]}/>}
			{selected === CollegeSelect.Resources && <ResourceContainer resources={[]}/>}
			</div>
		</div>);
}



export default CommunityPreview