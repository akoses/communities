import React from 'react'
import styles from "../../styles/college.module.scss"
import Link from 'next/link'

interface CollegeProps {
	name: string;
	description: string;
	logo: string;
	id: number;
}

const College: React.FC<CollegeProps> = ({name, description, logo}) => {
		return (
			<Link href={`/${name.replace(/\s+/g, '-').replace(/,/g, '').toLowerCase()}`}>
			<a><div className={styles.college}><img src={logo} />
			<div className={styles.content}><h1>{name}</h1>
			{window.innerWidth > 425 && <p> {description.length > 90?description.substring(0, 90) + '...':description}</p>}
			{window.innerWidth <= 425 && <p>{description.length > 40?description.substring(0, 40) + '...':description}</p>}
			</div>
			</div>
			</a>
			</Link>
		);

}
export default College