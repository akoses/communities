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
	const [shownDescription, setDescription] = React.useState<string>(description);
	React.useEffect(() => {
		if (window.innerWidth > 600) {
			setDescription(description.length > 100?description.substring(0, 100) + '...':description);
		}
		else {
			setDescription(description.length > 30?description.substring(0, 30) + '...':description);
		}	
	},[description]);
	window.addEventListener('resize', () => {
		if (window.innerWidth > 600) {
			setDescription(description.length > 100?description.substring(0, 100) + '...':description);
		}
		else {
			setDescription(description.length > 30?description.substring(0, 30) + '...':description);
		}
	})
		return (
			<Link href={`/${name.replace(/\s+/g, '-').replace(/,/g, '').toLowerCase()}`}>
			<a><div className={styles.college}><img src={logo} />
			<div className={styles.content}><h1>{name}</h1>
			 <p>{shownDescription}</p>
			</div>
			</div>
			</a>
			</Link>
		);

}
export default College