import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import styles from '../../../styles/event.module.scss'
import  dateFormat from 'dateformat'

interface EventProps {
	title: string
	description: string
	date: Date,
	imgsrc: string
	location: string
	link: string
	host: string
}

const Event: React.FC<EventProps> = ({
	title,
	imgsrc,
	description,
	date,
	location,
	link,
	host
}) => {
	const [image, setImage] = useState(imgsrc)
	useEffect(() => {
		if (imgsrc === "") {
			setImage('https://via.placeholder.com/150')
		}
		else {
			setImage(imgsrc)
		}
	}, [imgsrc])

		return (<div className={styles.event}>
			
			<div className={styles.eventContent}>
			<h1>{title}</h1>
			<h2>{dateFormat(date, "dddd, mmmm dS, yyyy, h:MM:ss TT")}</h2>
			<h3>{location}</h3>
			<h3>{host}</h3>
			
			</div>
			<img src={image}  alt={title}/>
		</div>);
}
export default Event