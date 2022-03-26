import React from 'react'
import { useState } from 'react'
import styles from '../../styles/college.module.scss'
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link'
import {fetchCollegesNameID, fetchJobs, fetchCollege} from '../../lib/fetch'
import JobsContainer from '../../src/common/jobs/JobsContainer'
import ResourceContainer from '../../src/common/resources/ResourceContainer';
import EventContainer from '../../src/common/events/EventContainer';

interface collegeProps {
	jobs: any[];
	college:any;
}

enum CollegeSelect {
	Opportunities,
	Events,
	Resources
}

const data = [
	{	id: 0,
		name: "Civil Engineering Co Op",
		company: "AimCo",
		logo:"https://picsum.photos/200",
		location:"Toronto, ON",
		workstyle:"Remote",
		disciplines:"Civil",
		applyLink:"https://www.aimco.ca/jobs/details.html?jobId=986&jobTitle=Analyst%2C%20Investment%20Finance%20Quality%20Control",
	},
	{	
		id: 1,
		name: "Structural Engineering Co Op",
		company: "Manlaw",
		logo:"https://picsum.photos/200",
		location:"Edmonton, AB",
		workstyle:"Remote",
		disciplines:"Structural",
		applyLink:"https://www.aimco.ca/jobs/details.html?jobId=986&jobTitle=Analyst%2C%20Investment%20Finance%20Quality%20Control",

	},
	{	
		id: 2,
		name: "Chemical Engineering Co Op",
		company: "Manitoba Oil & Gas",
		logo:"https://picsum.photos/200",
		workstyle:"Onsite",
		location:"Winnepeg, MB",
		disciplines:"Chemical",
		applyLink:"https://www.aimco.ca/jobs/details.html?jobId=986&jobTitle=Analyst%2C%20Investment%20Finance%20Quality%20Control",

	},
	{	
		id: 3,
		name: "Engineering Co Op",
		company: "Manterey",
		logo:"https://picsum.photos/200",
		workstyle:"Onsite",
		disciplines:"",
		location:"Vancouver, BC",
		applyLink:"https://www.aimco.ca/jobs/details.html?jobId=986&jobTitle=Analyst%2C%20Investment%20Finance%20Quality%20Control",

	},
	{	
		id: 4,
		name: "Civil Engineering Intern",
		company: "Mondano",
		logo:"https://picsum.photos/200",
		workstyle:"Onsite",
		location:"Montreal, QC",
		disciplines:"Civil",
		applyLink:"https://www.aimco.ca/jobs/details.html?jobId=986&jobTitle=Analyst%2C%20Investment%20Finance%20Quality%20Control",

	},
	{	
		id: 5,
		name: "Mechanical Engineering Co Op",
		company: "Stantec",
		logo:"https://picsum.photos/200",
		workstyle:"Onsite",
		location:"Calgary, AB",
		disciplines:"Mechanical",
		applyLink:"https://www.aimco.ca/jobs/details.html?jobId=986&jobTitle=Analyst%2C%20Investment%20Finance%20Quality%20Control",

	},
	{	
		id: 6,
		name: "Computer Engineering Co Op",
		company: "Citadel",
		logo:"https://picsum.photos/200",
		location:"Edmonton, AB",
		workstyle:"Remote",
		disciplines:"Computer",
		applyLink:"https://www.aimco.ca/jobs/details.html?jobId=986&jobTitle=Analyst%2C%20Investment%20Finance%20Quality%20Control",

	},
]

let resources = [
	{link: "https://www.kaptest.com/mcat"},
	{link: "https://medium.com/@neelesh-arora/stop-using-conditional-statements-everywhere-in-javascript-use-an-object-literal-instead-e780debcda18"},
	{link: "https://medium.com/gitconnected/a-guide-to-service-workers-in-react-js-82aec1d6a22d"},
	{link: "https://www.youtube.com"},

]



let events = [
	{
		id: 0,
		title:'Mentor Night',
		link: "https://www.facebook.com/events/238972408749093/",
		host: "Mentee Mentor",
		imgsrc:"https://picsum.photos/200",
		date: new Date(2022, 5, 1, 19, 0, 0, 0),
		location: 'Toronto, ON',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	},
	{
		id: 1,
		title:'Minecraft Night',
		link: "https://www.facebook.com/events/238972408749093/",
		host: "School Day",
		imgsrc:"https://picsum.photos/200",
		date: new Date(2022, 5, 1, 19, 0, 0, 0),
		location: 'Edmonton, AB',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	},
	{
		id: 2,
		title:'Career Day',
		link: "https://www.facebook.com/events/238972408749093/",
		host: "UACS",
		imgsrc:"https://picsum.photos/200",
		date: new Date(2022, 6, 1, 19, 0, 0, 0),
		location: 'Edmonton, AB',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	},
]
const College: React.FC<collegeProps> = ({jobs, college}) => {
	const [selected, setSelected] = useState(CollegeSelect.Opportunities);
		return (<div className={styles.collegePage}>
			<Link href='/'><a className={styles.backToColleges}><div > {'<'} Back to Colleges</div></a></Link>
			<div>
			<img className={styles.banner} src={college.banner}/>
			</div>
			<div className={styles.body}>
				
				<img className={styles.collegeLogo} src={college.logo}/>
				<div className={styles.collegeHeader}>
					
				<h1 className={styles.name}>{college.name}</h1>
				<Tooltip title="Create or post an opportunity, event or resources." placement="top">
				<div className={styles.post} >Create Post</div>
				</Tooltip>
				
				<p>{college.description}</p>
				<div className={styles.subscribe}>Subscribe to {college.name}</div>
				</div>
			</div>
			<div className={styles.options}>
				<ul>
					<li
						onClick={() => setSelected(CollegeSelect.Opportunities)}
					className={selected === CollegeSelect.Opportunities?styles.selected:""}>Opportunities</li>
					<li 
						onClick={() => setSelected(CollegeSelect.Events)}
					className={selected === CollegeSelect.Events?styles.selected:""}>Events</li>
					<li 
						onClick={() => setSelected(CollegeSelect.Resources)}
					className={selected === CollegeSelect.Resources?styles.selected:""}>Resources</li>
				</ul>
			</div>
			{selected === CollegeSelect.Opportunities && <JobsContainer jobs={data}/>}
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

  const paths = collegeNameIDs.map(({name, id}) => 
  {
	return {
	  params: {
		college:name.replace(/\s+/g, '-').toLowerCase(),
		id
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
	   const jobs = await fetchJobs(collegeInfo.id);
	  if (!jobs)
		return { props: {}, revalidate: 1 };

	  return {
		props: {
		  jobs,
		  college:collegeInfo
		},
		// By returning the value of the `nextUpdate` key here,
		// Next.js will optimize the page away if no data needs to be refreshed.
		revalidate: 1
	  }

}	

export default College