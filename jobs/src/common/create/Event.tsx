import React from 'react'
import styles from '../../../styles/create.module.scss'
import Router from 'next/router'

// @ts-ignore
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle'

import Event from '../events/Event'
interface EventProps {

}

const CreateEvent: React.FC<EventProps> = ({}) => {
	const [title, setTitle] = React.useState<string>("");
	const [description, setDescription] = React.useState<string>("");
	const [organization, setOrganization] = React.useState<string>("");
	const [location, setLocation] = React.useState<string>("");

	const [logo, setLogo] = React.useState<string>("");
	const [logoFile, setLogoFile] = React.useState<any>()
	const [eventLink, setEventLink] = React.useState<string>("");
	const [date, setDate] = React.useState(new Date());
	
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
			<form className={styles.formBody}>
				<div>
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
				<label>
					<h3>Event Description</h3>
					<p>Enter the event description here.</p>
					<textarea value={description} onChange={(e) => setDescription(e.target.value)} />
				</label>
				</div>
					<input className={styles.submit} type='submit' value='Create Event'/>
			</form>
			<div className={styles.preview}>
			<div className={styles.eventPreview}>
				<Event 
					title={title}
					description={description}
					imgsrc={logo}
					link={eventLink}
					host={organization}
					location={location}
					date={date}
				/>
			
			</div>
			</div>
			</div>
		</div>)
}

export default CreateEvent