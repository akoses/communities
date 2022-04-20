import React, {useState, useEffect} from 'react'
import Opportunity from './Opportunity'
import styles from '../../../styles/college.module.scss'
import {Opportunities} from '@prisma/client'
import Select from 'react-select/creatable';
import {MdClear} from 'react-icons/md';

interface OpportunityContainerProps {
	jobs: Opportunities[];
}
const coalesce = (...args: any) =>
  args.find((_:any) => ![null,undefined].includes(_)
);

const OpportunityContainer: React.FC<OpportunityContainerProps> = ({jobs}) => {
	const [displayedJobs, setDisplayedJobs] = useState(jobs);
	const [filter, setFilter] = useState<string>("")
	const [dropdownItems, setDropdownItems] = useState<any[]>([]);
	const [jobName, setJobName] = useState<string>('');
	const [disciplines, setDisciplines] = useState<(any)[]>([]);
	const [selectedFilter, setSelectedFilter] = useState<{
		value: string;
		label: string;
	}| null>(null);
	useEffect(() => {
		findDropDownOptions(jobs);
		findDisciplines(jobs);
	},[])

	const findDisciplines = (jobs: any[]) => {
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
		setDisciplines(temp);
	}

	const findDropDownOptions = (jobs: any[]) => {
		let dropDownOptions = jobs.map(job => {
			return {
				value: job.location,
				label: job.location
			}
		})
		setDropdownItems(dropDownOptions)
	}

	



	const handleFilter = (filtername:string, payload:any=null) => {
		let locationPayload: any;
		let jobNamePayload:any;
		let disciplinePayload: any;

		if (filtername === "location") {
			locationPayload = payload;
			setSelectedFilter(payload);
		}
		else if (filtername === "jobName") {
			jobNamePayload = payload;
			setJobName(payload);
		}
		else if (filtername === "discipline") {
			disciplinePayload = payload;
			if (filter === payload) {
				setFilter("");
				disciplinePayload = '';
			} else  {
				setFilter(payload);
			}
			
		}
		else if (filtername === "clear") {
			setSelectedFilter(null);
			locationPayload = {
				value: "",
				label: ""
			};
		}
		
		setDisplayedJobs(
			jobs.filter(job => {
				return job.location.includes(coalesce(locationPayload?.value, selectedFilter?.value, '')) && job.name.includes(coalesce(jobNamePayload, jobName, '')) && job.disciplines.includes(coalesce(disciplinePayload, filter, ''))
			})
		)
	}

		return (
			<div>
				
			<div>
				<div className={styles.disciplines}>
					{disciplines.map((discipline, index) => {
			if (discipline[0] !== "") {
			return <div key={index} className={`${styles.discipline} ${filter === discipline[0]?styles.filter:''}`} onClick={() => {handleFilter('discipline',discipline[0])}}>{discipline[0]} ({discipline[1]})</div>
				}
			}
		
			)}
				</div>
				<div className={styles.searchJobs}>
					<input type="text" placeholder="Search For Jobs" onChange={(e) => handleFilter('jobName', e.target.value)}/>
					<div className={styles.drop}>
					<Select 
					className={styles.dropdown}
						options={dropdownItems}
						placeholder="Filter By Location"
						formatCreateLabel={(inputValue: string) => `Search For ${inputValue}`}
						onChange={e => {handleFilter("location", e)}}
						value={selectedFilter}
						
					/>
					<MdClear className={styles.clear} onClick={() => {handleFilter('clear')}}/>
					</div>
				</div>
			</div>
			<div className={styles.jobsContainer}> 
				{displayedJobs.length > 0?displayedJobs.map((job) => {
					return <Opportunity key={job.id} 
						id={job.id}
						name={job.name}
						description={job.description}
						company={job.organization}
						logo={job.orgLogo}
						location={job.location}
						workstyle={job.workstyle}
						disciplines={job.disciplines}
					    apply_link={job.applyLink}
						userId={job.userId}
				    />
				}):<h2 className={styles.nojobs}>There are no opportunities available.</h2>}
			</div>
			</div>
		);
}
export default OpportunityContainer