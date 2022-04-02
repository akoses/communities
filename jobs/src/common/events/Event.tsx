/* eslint-disable @next/next/no-img-element */
import React, {useEffect, useState, useContext} from 'react'
import styles from '../../../styles/event.module.scss'
import  dateFormat from 'dateformat'
import axios from 'axios'
import DeleteModal from '../../common/modal/DeleteModal'
import S3Client from '../../lib/S3'
import EventModal from '../../common/modal/EventModal'
import {AiOutlineEdit} from 'react-icons/ai';
import AppContext from '../../../contexts/AppContext';
import Router from 'next/router'

interface EventProps {
	id:number;
	name: string
	description: string
	organization: string
	start_date: Date | string,
	end_date: Date | string,
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
	start_date,
	end_date,
	location,
	event_link,
	org_logo,
	UTCOffset

}) => {
	const [image, setImage] = useState(org_logo)
	const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
	const [eventModalIsOpen, setEventModalIsOpen] = useState<boolean>(false);
	const [formatStartDate, setFormatStartDate] = useState<string>('');
	const [formatEndDate, setFormatEndDate] = useState<string>('');
	const context = useContext(AppContext);

	useEffect(() => {
		if (org_logo === "") {
			setImage('/default.png')
		}
		else {
			setImage(org_logo)
		}
		let sd = new Date(start_date)
		let ed = new Date(end_date)
		sd.setHours(0, 0, 0, 0)
		ed.setHours(0, 0, 0, 0)
		
		if (start_date) {
			setFormatStartDate(dateFormat(convertUTCDateToLocalDate(new Date(start_date)), "ddd, mmm d yyyy, h:MM TT", UTCOffset))
		}
		
		if (sd.getDate() === ed.getDate()
		&& sd.getMonth() === ed.getMonth()
		&& sd.getFullYear() === ed.getFullYear() 
		) { 
			setFormatEndDate(' - ' + dateFormat(convertUTCDateToLocalDate(new Date(end_date)), "h:MM TT", UTCOffset))
		}
		else {
			setFormatEndDate(' - ' + dateFormat(convertUTCDateToLocalDate(new Date(end_date)), "ddd, mmm d yyyy, h:MM TT", UTCOffset))
		}

	}, [org_logo, start_date, end_date])
	
	const deleteEvent = async () => {
		if (org_logo !== '') {
			let keyName = new URL(org_logo).pathname
			await S3Client.deleteFile(keyName)
		}
		await axios.delete(`/api/events`, {params: {id}})
		window.location.reload()
	}

	const openEventModal = async (e:any) => {
		
		if (e.target.classList.contains('ReactModal__Overlay') || e.target.tagName === 'BUTTON' || e.target.tagName === 'svg') {
			return;
		}
		setEventModalIsOpen(true)
	}

	const openModal = async (e:any) => {
		e.stopPropagation()
		e.preventDefault()
		setModalIsOpen(!modalIsOpen);
	}

	const sendEdit = () => {
		let college_name = Router.asPath.split('/')[1]
		
		context.setEdit({
			type:"EVENT",
			college_name,
			
			id,
			name,
			organization,
			description,
			start_date,
			end_date,
			location,
			event_link,
			logo:org_logo
		})
		Router.push('/edit-post')
	}
		return (<div className={styles.event} onClick={openEventModal}>
			<div className={styles.eventContent}>
			<h1>{name}</h1>
			<h2>{formatStartDate}{formatEndDate}</h2>
		
			  <h3>{location}</h3>
			<h3>{organization}</h3>
			<AiOutlineEdit style={{display: id=== -1? 'none':'block'}} className={styles.editIcon} onClick={sendEdit}/>
			</div>
			<img className={styles.logo} src={image}  alt={name}
				
			/>
			<EventModal event={{
				id,
				name,
				description,
				organization,
				date_str:formatStartDate + formatEndDate,
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