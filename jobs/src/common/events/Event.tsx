/* eslint-disable @next/next/no-img-element */
import React, {useEffect, useState} from 'react'
import styles from '../../../styles/event.module.scss'
import  dateFormat from 'dateformat'
import axios from 'axios'
import DeleteModal from '../../common/modal/DeleteModal'
import S3Client from '../../lib/S3'
import EventModal from '../../common/modal/EventModal'

interface EventProps {
	id:number;
	name: string
	description: string
	organization: string
	date: Date | string,
	org_logo: string
	location: string
	event_link: string;
	UTCOffset: boolean
}

function convertUTCDateToLocalDate(date:Date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;   
}

const Event: React.FC<EventProps> = ({
	id,
	name,
	organization,
	description,
	date,
	location,
	event_link,
	org_logo,
	UTCOffset

}) => {
	const [image, setImage] = useState(org_logo)
	const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
	const [eventModalIsOpen, setEventModalIsOpen] = useState<boolean>(false);
	useEffect(() => {
		if (org_logo === "") {
			setImage('/default.png')
		}
		else {
			setImage(org_logo)
		}
	}, [org_logo])
	
	const deleteEvent = async () => {
		if (org_logo !== '') {
			let keyName = new URL(org_logo).pathname
			await S3Client.deleteFile(keyName)
		}
		await axios.delete(`/api/events`, {params: {id}})
		window.location.reload()
	}
	const openEventModal = async (e:any) => {
		console.log(e.target)
		if (e.target.classList.contains('ReactModal__Overlay') || e.target.tagName === 'BUTTON') {
			return;
		}
		setEventModalIsOpen(true)
	}

	const openModal = async (e:any) => {
		e.stopPropagation()
		e.preventDefault()
		setModalIsOpen(!modalIsOpen);
	}
		return (<div className={styles.event} onClick={openEventModal}>
			<div className={styles.eventContent}>
			<h1>{name}</h1>
			<h2>{dateFormat(convertUTCDateToLocalDate(new Date(date)) , "dddd, mmmm dS, yyyy, h:MM:ss TT", UTCOffset)}</h2>
			<h3>{location}</h3>
			<h3>{organization}</h3>
			</div>
			<img className={styles.logo} src={image}  alt={name}
				onError={i => i.target.style.display='none'}
			/>
			<EventModal event={{
				id,
				name,
				description,
				organization,
				date,
				location,
				event_link,
				org_logo
			}}
				isOpen={eventModalIsOpen}
				setOpen={setEventModalIsOpen}
			/>
			<img
				onClick={openModal}
			 src={'/delete.png'} alt='delete'
			className={`${styles.delete} delete`}
			style={{display: id=== -1? 'none':'block'}}/>
			<DeleteModal setOpen={setModalIsOpen} type='event' func={deleteEvent} isOpen={modalIsOpen}/>
		</div>);
}
export default Event