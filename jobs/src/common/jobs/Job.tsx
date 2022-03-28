import React, { useEffect } from 'react'
import Link from 'next/link'
import styles from '../../../styles/college.module.scss'

interface JobProps {
	name: string;
	company: string;
	logo: string;
	location: string;
	workstyle: string;
	disciplines: string;
	applyLink: string;
}

const Job: React.FC<JobProps> = ({name, company, logo, location, workstyle, applyLink}) => {
	const [dlogo, setLogo] = React.useState<string>(logo);
	useEffect(() => {
		if (logo === '') {
			setLogo('https://via.placeholder.com/150')
		}
		else {
			setLogo(logo)
		}
	}, [logo])
	
	return (
		<Link href={applyLink}><a target="_blank" ><div className={styles.job}>
			<img src={dlogo} />
			<div className={styles.jobContent}><h1>{name}</h1>
			<h2>{company}</h2>
			<h3>{location} {location !== '' && workstyle !== ''?"|":''} {workstyle}</h3>
			</div>
		</div></a></Link>);
}
export default Job