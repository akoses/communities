/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../../styles/college.module.scss'
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link'
import Router from 'next/router';

import {fetchCollegesNameID, fetchData,  fetchCollege} from '../../src/lib/fetch'
import JobsContainer from '../../src/common/jobs/JobsContainer'
import ResourceContainer from '../../src/common/resources/ResourceContainer';
import EventContainer from '../../src/common/events/EventContainer';
import EditCollegeModal from '../../src/common/modal/EditCollegeModal';
import {convertName} from '../../src/common/utils'

interface collegeProps {
	opportunities: any[];
	events: any[];
	resources: any[];
	college:any;
}

enum CollegeSelect {
	Opportunities = 'opportunities',
	Events = 'events',
	Resources = 'resources'
}



const College: React.FC<collegeProps> = ({opportunities, events, resources, college}) => {
	const [selected, setSelected] = useState(CollegeSelect.Opportunities);
	const [isOpen, setIsOpen] = useState(false);
	
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
	}, [])

	const selectComponent = (collegeSelect: CollegeSelect) => {
		setSelected(collegeSelect);
		Router.push(`${convertName(college.name)}/${collegeSelect}`, undefined, {shallow: true});
	}

		return (<div className={styles.collegePage}>
			<Head>
				<title>{college.name} | College</title>
			</Head>
			<Link href='/'><a className={styles.backToColleges}><div >Back to Colleges</div></a></Link>
			<div>
			<img className={styles.banner} src={college.banner}/>
			</div>
			<div className={styles.body}>
				<img className={styles.collegeLogo} src={college.logo}/>
				<div className={styles.collegeHeader}>
				<div className={styles.topHead}>
				<h1 className={styles.name}>{college.name}</h1>
				<div className={styles.midHead}>
				<Tooltip title="Create or post an opportunity, event or resources." placement="top">
				<div onClick={() => Router.push({
					pathname: `/${convertName(college.name)}/create-post`},
					undefined, {shallow: true}
					)} className={styles.post} >Create Post</div>
				</Tooltip>
				<img className={styles.edit} 
					onClick={() => setIsOpen(true)}
				src="/edit.png" />
				</div>
				</div>	
				<p>{college.description}</p>
				<div className={styles.subscribe}>Subscribe to {college.name}</div>
				</div>
				<EditCollegeModal college={college} isOpen={isOpen} setOpen={setIsOpen}/>
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
			{selected === CollegeSelect.Opportunities && <JobsContainer jobs={opportunities}/>}
			{selected === CollegeSelect.Events && <EventContainer events={events}/>}
			{selected === CollegeSelect.Resources && <ResourceContainer resources={resources}/>}
		</div>);
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
	const collegeNameIDs = await fetchCollegesNameID();

  // Get the paths we want to pre-render based on posts
  if (!collegeNameIDs)
    return { paths: [], fallback: true };

  const paths = collegeNameIDs.map(({name}) => 
  {
	return {
	  params: {
		  college: convertName(name),
	  }
	}
  })

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export async function getStaticProps({ params }:any) {
	
	  // Call an external API endpoint to get jobs
	  const collegeInfo = await fetchCollege(params.college);
	  console.log(params.college)
	  if (!collegeInfo)
		return { props: {}, revalidate: 1 };
	
	   const {opportunities, events, resources }= await fetchData(collegeInfo.id);
		
	   let mappedEvents = events.map((event:any) => {
			return {
				...event,
				date: event.date.toString()
			}
		})
		
	   
	  return {
		props: {
		  opportunities,
		  events:mappedEvents,
		  resources,
		  college:collegeInfo
		},
		// By returning the value of the `nextUpdate` key here,
		// Next.js will optimize the page away if no data needs to be refreshed.
		revalidate: 1
	  }

}	

export default College