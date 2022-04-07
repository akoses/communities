import React, {useContext} from 'react'
import styles from '../../../styles/create.module.scss'
import Router from 'next/router'
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
import { useRouter } from 'next/router'
import axios from 'axios'
import Event from '../events/Event'
import ReactQuill from '../quill/QuillSSR'; 
import AppContext from '../../../contexts/AppContext';
import {useSession}	from 'next-auth/react';
import {validateText} from './Resource';
import {useAlert} from 'react-alert';

interface EventProps {
	id?:number;
	event?:any;
	UTCOffset?:boolean;
}

const CreateEvent: React.FC<EventProps> = ({id, event, UTCOffset}) => {
	const [title, setTitle] = React.useState<string>(event?.name || "");
	const [description, setDescription] = React.useState<string>(event?.description || "");
	const [organization, setOrganization] = React.useState<string>(event?.organization || "");
	const [location, setLocation] = React.useState<string>( event?.location || "");
	const [logo, setLogo] = React.useState<string>( event?.logo || "");
	const [logoFile, setLogoFile] = React.useState<any>(event?.logo || null);
	const [eventLink, setEventLink] = React.useState<string>( event?.eventLink || "");
	const [startDate, setStartDate] = React.useState(event?.start_date || new Date());
	const [endDate, setEndDate] = React.useState(event?.end_date || new Date());		
	const router = useRouter();
	 const alert = useAlert()
	const context = useContext(AppContext);
	const {data: session} = useSession();

	const [page, setPage] = React.useState<number>(1);

	const formSubmit = async (e:any) => {
		
		e.preventDefault();
		if (title === '' || organization === '' || location === '' || logoFile === undefined) {
			alert.error('Please fill out all the required fields.',{timeout: 3000});
			return;
		}
		let s3Link = {
			location:null
		};
		if(logoFile && typeof logoFile !== 'string') {
			let form = new FormData();
			form.append('file', logoFile);
			let res = await axios.post('/api/file', 
			form, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			s3Link = res.data;
		}

		if (id){
			const formData = {
				name: title,
				description: description,
				organization: organization,
				location: location,
				event_link: eventLink,
				start_date: startDate || new Date(),
				end_date: endDate || new Date(),
				org_logo: s3Link.location || '',
				college_id: id,
				user_id: session?.user?.id || '',
			}
			await axios.post('/api/events', formData)
		}
	
		else if (event) {
			const formData = {
				name: title,
				description: description,
				organization: organization,
				location: location,
				event_link: eventLink,
				start_date: new Date(startDate) || new Date(),
				end_date: new Date(endDate) || new Date(),
				org_logo: s3Link.location || event.logo,
				id: event?.id,
			}
			await axios.put('/api/events', formData)	
		}
		console.log(context.editableData)
		router.push(`/${router.query['college'] || context.editableData?.college_name}/events`)
	}

	const onDateChange = (date:any) => {
		if (date){
			if (date[0]){
				setStartDate(date[0]._d)
			}
			if (date[1]){
				setEndDate(date[1]._d)
			}

		}
		  
		  setEndDate(date[1]._d)
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
			<div id={styles.title}>{event? "Edit Event" : "Create Event"}
				<div className={styles.cancel} onClick={() => {Router.back(); context.setEdit({})}}> Cancel</div>
			</div>
			</div>
			<div className={styles.body}>
			<form className={styles.formBody} onSubmit={formSubmit}>
				<div style={{display:page== 1?"block":"none"}}>
				
				<label>
					<h3>Event Title <span className="required">*</span></h3>
					<input type="text" value={title} onChange={(e) => {validateText(e, setTitle)}} />
				</label>
				<label>
					<h3>Organization <span className="required">*</span></h3>
					<p>Enter the organization name.</p>
					<input type='text'	value={organization} onChange={(e) => validateText(e, setOrganization)} />
				</label>
				
				<label>
					<h3>Location <span className="required">*</span></h3>
					<input type='text'	value={location} onChange={(e) => validateText(e, setLocation)} />
				</label>
				<label>
					<h3>Event Link</h3>
					<p>Enter the link for the event.</p>
					<input type='text'	value={eventLink} onChange={(e) => setEventLink(e.target.value)} />
				</label>
				<label>
					<h3>Event Image <span className="required">*</span></h3>
					<p>Enter the event image here.</p>
					<input type='file' onChange={setImageUrl} accept="image/jpeg, image/png" />
					<div className={styles.file}>Choose File</div>
				</label>
				
				</div>
				<div style={{display:page === 2?"block":"none"}}>
				<label>
					<h3>Event Date <span className="required">*</span></h3>
					<p>Enter the event date range here.</p>
					
   					<RangePicker
      						showTime={{ format: 'HH:mm' }}
      						format="YYYY-MM-DD HH:mm"
     						onChange={onDateChange}
							 className={styles.eventDate}
							 defaultValue={[moment(startDate), moment(endDate)]}
    					/>
				</label>
				<label>
					<h3>Event Description</h3>
					<p>Enter the event description here.</p>
				</label>
					{
						typeof document !== undefined && <ReactQuill value={description} onChange={(e) => setDescription(e)} />
					}
					<input className={styles.submit} type='submit' value={event? "Edit Event" : "Create Event"}/>
				
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
					orgLogo={logo}
					eventLink={eventLink}
					organization={organization}
					location={location}
					startDate={startDate}
					endDate={endDate}
					UTCOffset={UTCOffset || true}
					userId={''}
				/>
			
			</div>
			</div>
			</div>
		</div>)
}

export default CreateEvent