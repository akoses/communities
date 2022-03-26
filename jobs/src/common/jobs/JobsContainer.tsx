import React, {useState, useEffect} from 'react'
import Job from './Job'
import styles from '../../../styles/college.module.scss'

interface JobsContainerProps {
	jobs: any[];
}

const JobsContainer: React.FC<JobsContainerProps> = ({jobs}) => {
	const [displayedJobs, setDisplayedJobs] = useState(jobs);
	const [filter, setFilter] = useState<string>("");
	
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

	

	const setFilterFn = (filterName:string) => {
		if (filter === filterName) {
			setFilter("");
			setDisplayedJobs(jobs)
		} else {
		setFilter(filterName);
		setDisplayedJobs(jobs.filter(job => job.disciplines.includes(filterName)));
		}
	}

	useEffect(() =>{
		findDisciplines();
	},[displayedJobs])
	const [disciplines, setDisciplines] = useState<(JSX.Element| undefined)[]>([]);
		return (
			<div>
			<div className={styles.body}>
				<div className={styles.disciplines}>
					{disciplines}
				</div>
				
			</div>
			<div className={styles.jobsContainer}> 
				{displayedJobs.length > 0?displayedJobs.map((job) => {
					return <Job key={job.id} 
						name={job.name}
						company={job.company}
						logo={job.logo}
						location={job.location}
						workstyle={job.workstyle}
						disciplines={job.disciplines}
					    applyLink={job.applyLink}
				    />
				}):<h2 className={styles.nojobs}>There are no jobs yet.</h2>}
			</div>
			</div>
		);
}
export default JobsContainer