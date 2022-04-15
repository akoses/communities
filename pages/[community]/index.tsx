/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../../styles/college.module.scss'
import Tooltip from '@mui/material/Tooltip';
import Router from 'next/router';
import Link from 'next/link';
import {fetchJoinedCollege, fetchData,  fetchCollege} from '../../src/lib/fetch'
import OpportunityContainer from '../../src/common/opportunities/OpportunityContainer'
import ResourceContainer from '../../src/common/resources/ResourceContainer';
import EventContainer from '../../src/common/events/EventContainer';
import CollegeModal from '../../src/common/modal/CollegeModal';
import {convertName} from '../../src/common/utils'
import Navigation from '../../src/common/Navigation';
import { useSession, getSession } from "next-auth/react";
import AuthModal from '../../src/common/modal/AuthModal';
import {BsFillBellFill, BsFillBellSlashFill, BsPeopleFill} from 'react-icons/bs';
import {FaShare, 
	FaTiktok as TikTok, 
	FaInstagram as Instagram,
	FaTiktok as Tiktok,
	FaYoutube as Youtube,
	FaLinkedin as Linkedin,
	FaReddit as Reddit,
	FaDiscord as Discord,
	FaTwitter as Twitter,
	FaSlack as Slack,
	FaFacebook as Facebook,

} from 'react-icons/fa';
import axios from 'axios';
import {useAlert} from 'react-alert'

import {CgWebsite as Personal} from 'react-icons/cg';

interface collegeProps {
	opportunities: any[];
	events: any[];
	resources: any[];
	college:any;
	hasJoinedCollege: boolean;
	emailNotification: boolean;
}

enum CollegeSelect {
	Opportunities = 'opportunities',
	Events = 'events',
	Resources = 'resources'
}

const validURL = (name:string):boolean => {
	return /^(ftp|http|https):\/\/[^ "]+$/.test(name)
}

const College: React.FC<collegeProps> = ({opportunities, events, resources, college, hasJoinedCollege, emailNotification}) => {
	const [selected, setSelected] = useState(CollegeSelect.Opportunities);
	const [isOpen, setIsOpen] = useState(false);
	const {data: session, status} = useSession();
	const [openLogin, setOpenLogin] = useState(false);
	const [hasJoined, setHasJoined] = useState(hasJoinedCollege);
	const [hasNotifications, setHasNotifications] = useState(emailNotification);
	const [collegeCount, setCollegeCount] = useState('');
	const [tryJoin, setTryJoin] = useState(false);
	const alert = useAlert();
	
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
		
	}, [session, college])

	const goToCreatePost = () => {
		setTryJoin(false)
		if (status === 'authenticated') {
		Router.push({
					pathname: `/${convertName(college.name)}/create-post`},
					undefined, {shallow: true}
		)
		} else {
			
			setOpenLogin(true)
	}
	
	}

	const copyToClipboard = async (link:string) => {
		await navigator.clipboard.writeText(link);
		alert.show('Community link copied to clipboard.', {
			type: 'success',
			timeout: 2000,
			containerStyle:{
				backgroundColor: '#2196f3',
			},
			position:"bottom center"
		})
	}

	const joinCollege = async () => {
		setTryJoin(true)
		if (status === 'authenticated') {
			if (!hasJoined){
				await axios.post('/api/join', {userId: session?.user?.id, collegeId: college.id})
				setHasJoined(true);
				setHasNotifications(true);
			}
			else {
				await axios.delete('/api/join', {params: {userId: session?.user?.id, collegeId: college.id}})
				setHasJoined(false)
				
			}
			
		} else {
			setOpenLogin(true)
		}
	}

	const handleNotifications = async () => {
		if (status === 'authenticated') {
			if (hasNotifications) {
				await axios.put('/api/join/notifications', {
					userId: session?.user?.id,
					collegeId: college.id,
					emailNotification: false
				})
				setHasNotifications(false)
			} else {
				await axios.put('/api/join/notifications', {
					userId: session?.user?.id,
					collegeId: college.id,
					emailNotification: true
				})
				setHasNotifications(true)
			}
		} else {
			setOpenLogin(true)
		}
	}

	const selectComponent = (collegeSelect: CollegeSelect) => {
		setSelected(collegeSelect);
		Router.push(`${convertName(college.name)}/${collegeSelect}`, undefined, {shallow: true});
	}
		return (<div className={styles.collegePage}>
			<Head>
				<title>{college?.name} | Community</title>
				<meta name="description" content={college?.description} />
				<meta property="og:title" content={college?.name} />
				<meta property="og:description" content={college?.description} />
				<meta property="og:image" content={college?.image} />
				<meta property="og:url" content={`https://akose.ca/${convertName(college?.name || '')}`} />
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content={"Akose Community"} />
				<meta property="og:locale" content="en_US" />
				<meta property="og:locale:alternate" content="en_US" />
			</Head>
			<Navigation />
			<AuthModal callBackUrl={!tryJoin?`/${convertName(college?.name || '')}/create-post`:`/${convertName(college?.name || '')}`} type={'Login'} setOpen={setOpenLogin} isOpen={openLogin} />
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
				<div onClick={goToCreatePost} className={styles.post} >Create Post</div>
				</Tooltip>
				{college?.userId === session?.user?.id &&<img className={styles.edit} 
					onClick={() => Router.push(`${convertName(college.name)}/edit-community`)}
				src="/edit.png" />}
				</div>
				</div>	
				<p className={styles.description}>{college?.description}</p>
				<div className={styles.bottomHead}>
				<Tooltip title="Copy Community URL to clipboard." placement="top">
				<div className={styles.url} onClick={() => copyToClipboard(`https://akose.ca/${convertName(college?.name || '')}`)}><span>Share</span><FaShare /></div>
				</Tooltip>
				{college?.userId !== session?.user?.id &&<div onClick={joinCollege} className={styles.subscribe}>{hasJoined?'Joined':'Join'}</div>}
				{(college?.userId !== session?.user?.id && hasJoined) && <Tooltip title={!hasNotifications?'Get Email Notifications For This Community':"Turn Off Email Notifications For This Community"}><div className={styles.bellIcon} onClick={handleNotifications}>{hasNotifications?<BsFillBellFill/>:<BsFillBellSlashFill/>}</div></Tooltip>}
				
				</div>
				<div className={styles.socials}>
					{ validURL(college?.instagram) && <Link  href={college.instagram || ''}><a target="_blank" rel="noreferrer"><Instagram /></a></Link>}
					{ validURL(college?.facebook)  && <Link href={college.facebook || ''} ><a target="_blank" rel="noreferrer"><Facebook /></a></Link>}
					{ validURL(college?.reddit)  && <Link href={college.reddit || ''} ><a target="_blank" rel="noreferrer"><Reddit /></a></Link>}
					{ validURL(college?.discord) && <Link href={college.discord || ''} ><a target="_blank" rel="noreferrer"><Discord /></a></Link>}
					{ validURL(college?.linkedin) && <Link href={college.linkedin || ''} ><a target="_blank" rel="noreferrer"> <Linkedin /></a></Link>}
					{ validURL(college?.slack) && <Link href={college.slack || ''} ><a target="_blank" rel="noreferrer"><Slack /></a></Link>}
					{ validURL(college?.youtube) && <Link href={college.youtube || ''} ><a target="_blank" rel="noreferrer"><Youtube/></a></Link>}
					{ validURL(college?.personal) && <Link href={college.personal || ''} ><a target="_blank" rel="noreferrer"><Personal /></a></Link>}
					{ validURL(college?.twitter)  && <Link href={college.twitter || ''} ><a target="_blank" rel="noreferrer"><Twitter /></a></Link>}
					{ validURL(college?.tiktok) && <Link href={college.tiktok || ''} ><a target="_blank" rel="noreferrer"><Tiktok /></a></Link>}
				</div>
				</div>
				<CollegeModal type={'edit'} college={college} isOpen={isOpen} setOpen={setIsOpen}/>
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
			{selected === CollegeSelect.Opportunities && <OpportunityContainer jobs={opportunities}/>}
			{selected === CollegeSelect.Events && <EventContainer events={events}/>}
			{selected === CollegeSelect.Resources && <ResourceContainer resources={resources}/>}
			</div>
		</div>);
}

export async function getServerSideProps({ params, req}:any) {
	
	  // Call an external API endpoint to get jobs

	  const collegeInfo = await fetchCollege(params.community);
	 
	  let session = await getSession({req});
	
	  if (!collegeInfo)

		return { 
			notFound: true
		};

	  const joinedCollege = await fetchJoinedCollege(session?.user?.id || '', collegeInfo?.id || -1);
	   const {opportunities, events, resources }= await fetchData(collegeInfo.id || -1);
	      
	  return {
		props: {
			key:collegeInfo.id,
		  opportunities,
		  events,
		  resources,
		  college:collegeInfo,
		  hasJoinedCollege: joinedCollege.length > 0 && session,
		  emailNotification: joinedCollege.length > 0 && joinedCollege[0].emailNotification
		
		},
		// By returning the value of the `nextUpdate` key here,
		// Next.js will optimize the page away if no data needs to be refreshed.
	  }

}	


export default College