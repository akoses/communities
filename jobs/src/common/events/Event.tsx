/* eslint-disable @next/next/no-img-element */
import React, {useEffect, useState, useContext} from 'react'
import styles from '../../../styles/event.module.scss'
import  dateFormat from 'dateformat'
import axios from 'axios'
import DeleteModal from '../../common/modal/DeleteModal'
import EventModal from '../../common/modal/EventModal'
import {AiOutlineEdit} from 'react-icons/ai';
import AppContext from '../../../contexts/AppContext';
import Router from 'next/router'
import {useSession} from 'next-auth/react'

interface EventProps {
	id:number;
	name: string
	description: string
	organization: string
	startDate: Date | string,
	endDate: Date | string,
	orgLogo: string
	location: string
	eventLink: string;
	UTCOffset: boolean
	userId: string
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
	startDate,
	endDate,
	location,
	eventLink,
	orgLogo,
	UTCOffset,
	userId

}) => {
	const [image, setImage] = useState(orgLogo)
	const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
	const [eventModalIsOpen, setEventModalIsOpen] = useState<boolean>(false);
	const [formatStartDate, setFormatStartDate] = useState<string>('');
	const [formatEndDate, setFormatEndDate] = useState<string>('');
	const context = useContext(AppContext);
	const [collegeName] = React.useState<string>(Router.asPath.split('/')[1] || '');
	const [collegeUserId, setCollegeUserId] = React.useState<string>('');
	const {data: session} = useSession();
	useEffect(() => {
		if (orgLogo === "") {
			setImage('/default.png')
		}
		else {
			setImage(orgLogo)
		}
		let sd = new Date(startDate)
		let ed = new Date(endDate)
		sd.setHours(0, 0, 0, 0)
		ed.setHours(0, 0, 0, 0)
		
		if (startDate) {
			setFormatStartDate(dateFormat(convertUTCDateToLocalDate(new Date(startDate)), "ddd, mmm d yyyy, h:MM TT", UTCOffset))
		}
		
		if (sd.getDate() === ed.getDate()
		&& sd.getMonth() === ed.getMonth()
		&& sd.getFullYear() === ed.getFullYear() 
		) { 
			setFormatEndDate(' - ' + dateFormat(convertUTCDateToLocalDate(new Date(endDate)), "h:MM TT", UTCOffset))
		}
		else {
			setFormatEndDate(' - ' + dateFormat(convertUTCDateToLocalDate(new Date(endDate)), "ddd, mmm d yyyy, h:MM TT", UTCOffset))
		}
		// @ts-ignore
		setCollegeUserId(context.collegeData[collegeName]?.userId)
	}, [orgLogo, startDate, endDate, collegeUserId, session, context.collegeData, collegeName, UTCOffset])
	
	const deleteEvent = async () => {
		if (orgLogo !== '') {
			let keyName = new URL(orgLogo).pathname
			axios.delete('/api/file', {
				params:{
					keyName
				}
			})
			
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
			startDate,
			endDate,
			location,
			eventLink,
			logo:orgLogo
		})
		Router.push('/edit-post')
	}
		return (<div className={styles.event} onClick={openEventModal}>
			<div className={styles.eventContent}>
			<h1>{name}</h1>
			<h2>{formatStartDate}{formatEndDate}</h2>
		
			  <h3>{location}</h3>
			<h3>{organization}</h3>
			{userId === session?.user?.id && <AiOutlineEdit style={{display: id=== -1? 'none':'block'}} className={styles.editIcon} onClick={sendEdit}/>}
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
				eventLink,
				orgLogo

			}}
				isOpen={eventModalIsOpen}
				setOpen={setEventModalIsOpen}
			/>
			{(collegeUserId === session?.user?.id || userId === session?.user?.id) && <img
				onClick={openModal}
			 src={'/delete.png'} alt='delete'
			className={`${styles.delete} delete`}
			style={{display: id=== -1? 'none':'block'}}/>}
			<DeleteModal setOpen={setModalIsOpen} type='event' func={deleteEvent} isOpen={modalIsOpen}/>
		</div>);
}
export default Event