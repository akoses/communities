import React from 'react'
import styles from "../../styles/college.module.scss"
import Link from 'next/link'

interface CollegeProps {
	name: string;
	description: string;
	logo: string;
	id: number;
}

const College: React.FC<CollegeProps> = ({name, description, logo, id}) => {

		return (
			<Link href={`/${id}/${name.replace(/\s+/g, '-').replace(/,/g, '').toLowerCase()}`}>
			<a><div className={styles.college}><img src={logo} />
			<div className={styles.content}><h1>{name}</h1>
			<p>{description}</p></div>
			</div>
			</a>
			</Link>
		);

}
export default College