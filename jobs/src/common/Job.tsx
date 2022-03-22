import React from 'react'
import Link from 'next/link'
import styles from '../../styles/college.module.scss'
interface JobProps {
	name: string;
	company: string;
	logo: string;
	location: string;
	workstyle: string;
	disciplines: string;
	applyLink: string;
}

const Job: React.FC<JobProps> = ({name, company, logo, location, workstyle, disciplines, applyLink}) => {
		return (
		<Link href={applyLink}><a><div className={styles.job}>
			<img src={logo} />
			<div className={styles.jobContent}><h1>{name}</h1>
			<h2>{company}</h2>
			<h3>{location} | {workstyle}</h3>
			</div>
		</div></a></Link>);
}
export default Job