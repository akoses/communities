import React from 'react'
import styles from '../../../styles/create.module.scss'
import Router from 'next/router'

// @ts-ignore
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle'
import { useRouter } from 'next/router'
import S3Client from '../../lib/S3'
import axios from 'axios'
import Event from '../events/Event'
import ReactQuill from '../quill/QuillSSR'; 

import { v4 as uuidv4 } from 'uuid';

interface EventProps {
	id:number;
}

const CreateEvent: React.FC<EventProps> = ({id}) => {
	const [title, setTitle] = React.useState<string>("");
	const [description, setDescription] = React.useState<string>("");
	const [organization, setOrganization] = React.useState<string>("");
	const [location, setLocation] = React.useState<string>("");
	const [logo, setLogo] = React.useState<string>("");
	const [logoFile, setLogoFile] = React.useState<any>()
	const [eventLink, setEventLink] = React.useState<string>("");
	const [date, setDate] = React.useState(new Date());
	const router = useRouter()
	const [page, setPage] = React.useState<number>(1);

	const formSubmit = async (e:any) => {
		e.preventDefault();
		let s3Link = {
			location:''
		};
		if(logoFile)
			s3Link = await S3Client.uploadFile(logoFile, uuidv4());

		const formData = {
			name: title,
			description: description,
			organization: organization,
			location: location,
			event_link: eventLink,
			date: date,
			org_logo: s3Link.location,
			college_id: id,
		}
		await axios.post('/api/events', formData)
		router.push(`/${router.query['college']}`)
	}

	const setImageUrl = (evt:any) => {
		let file = evt.target.files[0]
		
  	if (file) {
		  let url = URL.createObjectURL(file)
		setLogoFile(file)
    	setLogo(url)
 	 }
	}

		return (<div>
			<div>
			<div id={styles.title}>Create Event
				<div className={styles.cancel} onClick={() => Router.back()}> Cancel</div>
			</div>
			</div>
			<div className={styles.body}>
			<form className={styles.formBody} onSubmit={formSubmit}>
				<div style={{display:page== 1?"block":"none"}}>
				
				<label>
					<h3>Event Title</h3>
					<input type="text" value={title} onChange={(e) => {setTitle(e.target.value)}} />
				</label>
				<label>
					<h3>Organization</h3>
					<p>Enter the organization name.</p>
					<input type='text'	value={organization} onChange={(e) => setOrganization(e.target.value)} />
				</label>
				
				<label>
					<h3>Location</h3>
					<input type='text'	value={location} onChange={(e) => setLocation(e.target.value)} />
				</label>
				<label>
					<h3>Event Link</h3>
					<p>Enter the link for the event.</p>
					<input type='text'	value={eventLink} onChange={(e) => setEventLink(e.target.value)} />
				</label>
				<label>
					<h3>Event Image</h3>
					<p>Enter the event image here.</p>
					<input type='file' onChange={setImageUrl} />
					<div className={styles.file}>Choose File</div>
				</label>
				<label>
					<h3>Event Date</h3>
					<p>Enter the event date here.</p>
					<DateTimePicker className={styles.eventDate} onChange={setDate} value={date} />
				</label>
				</div>
				<div style={{display:page === 2?"block":"none"}}>
				<label>
					<h3>Event Description</h3>
					<p>Enter the event description here.</p>
					{
						typeof document !== undefined && <ReactQuill value={description} onChange={(e) => setDescription(e)} />
					}
					<input className={styles.submit} type='submit' value='Create Event'/>
				</label>
				</div>
				
				<div className={styles.pages}>
					<li style={{opacity:page === 1?0.5:1}} onClick={() => {setPage(1)}}>{'Previous'}</li>
					<li style={{opacity:page === 2?0.5:1}} onClick={() => setPage(2)}>{'Next'}</li>
				</div>
					
			</form>
			<div className={styles.preview}>
			<div className={styles.eventPreview}>
				<Event 
					id={-1}
					name={title}
					description={description}
					org_logo={logo}
					event_link={eventLink}
					organization={organization}
					location={location}
					date={date}
					UTCOffset={true}
				/>
			
			</div>
			</div>
			</div>
		</div>)
}

export default CreateEvent