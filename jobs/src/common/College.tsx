import React from 'react'
import styles from "../../styles/college.module.scss"
import Link from 'next/link'

interface CollegeProps {
	name: string;
	description: string;
	logo: string;
}

const College: React.FC<CollegeProps> = ({name, description, logo}) => {
		return (
			<Link href={`/colleges/${name.replace(/\s+/g, '-').toLowerCase()}`}>
			<a><div className={styles.college}><img src={logo} />
			<div className={styles.content}><h1>{name}</h1>
			<p>{description}</p></div>
			</div>
			</a>
			</Link>
		);

}
export default College