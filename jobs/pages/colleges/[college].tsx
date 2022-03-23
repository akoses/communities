import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import styles from '../../styles/college.module.scss'
import Job from '../../src/common/Job'
import Link from 'next/link'

interface collegeProps {

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

const College: React.FC<collegeProps> = ({}) => {
	const [jobs] = useState(data);
	const [displayedJobs, setDisplayedJobs] = useState(data);
	const [disciplines, setDisciplines] = useState<(JSX.Element| undefined)[]>([]);
	const [filter, setFilter] = useState<string>("");

	const setFilterFn = (filterName:string) => {
		if (filter === filterName) {
			setFilter("");
			setDisplayedJobs(jobs)
		} else {
		setFilter(filterName);
		
		setDisplayedJobs(jobs.filter(job => job.disciplines.includes(filterName)));
		}
	}

	const findDisciplines = () => {
		let map = new Map<string, number>();
		for (let i = 0; i < jobs.length; i++) {
			let disciplines = jobs[i].disciplines.split(",");
			for (let j = 0; j < disciplines.length; j++) {
				if (map.has(disciplines[j])) {
					map.set(disciplines[j], map.get(disciplines[j])! + 1);
				} else {
					map.set(disciplines[j], 1);
				}
			}
			
		}
		const temp = Array.from(map.entries());

		let tempArray = temp.map((discipline, index) => {
			if (discipline[0] !== "") {
			return <div key={index} className={`${styles.discipline} ${filter === discipline[0]?styles.filter:''}`} onClick={() => {setFilterFn(discipline[0])}}>{discipline[0]} ({discipline[1]})</div>
		}
	}
		
		);
		setDisciplines(tempArray);
	
	}
	useEffect(() =>{
		findDisciplines();
	})


		return (<div className={styles.collegePage}>
			<Link href='/'><a className={styles.backToColleges}><div > {'<'} Back to Colleges</div></a></Link>
			<div>
			<img className={styles.banner} src="/images/engbanner.jpg"/>
			</div>
			<div className={styles.body}>
				<img className={styles.collegeLogo} src="/images/engineering.png"/>
				<div className={styles.collegeHeader}>
				<div className={styles.post}>Post a Job</div>
				<h1>Engineering is Love, Engineering is Life</h1>
				<p>Engineering is the science and art of the world. Find your next co-op here.</p>
				</div>
				<div className={styles.disciplines}>
					{disciplines}
				</div>
				
			</div>
			<div className={styles.jobsContainer}> 
				{displayedJobs.map((job) => {
					return <Job key={job.id} 
						name={job.name}
						company={job.company}
						logo={job.logo}
						location={job.location}
						workstyle={job.workstyle}
						disciplines={job.disciplines}
					    applyLink={job.applyLink}
				    />
				})}
			</div>
		</div>);
}
export default College