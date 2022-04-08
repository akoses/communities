import React, {useContext, useEffect} from 'react'
import Job from '../opportunities/Opportunity'
import styles from '../../../styles/create.module.scss'
import jobStyles from '../../../styles/college.module.scss'
import Router from 'next/router'
import 'react-quill/dist/quill.snow.css'; // ES6
import ReactQuill from '../quill/QuillSSR'; 
import { useRouter } from 'next/router'
import axios from 'axios';
import AppContext from '../../../contexts/AppContext';
import {useSession}	from 'next-auth/react';
import {validateText} from './Resource';
import {useAlert} from 'react-alert'


interface OpportunityProps {
	id?:number; 
	opportunity?:any;
}



const Opportunity: React.FC<OpportunityProps> = ({id, opportunity}) => {
	const [title, setTitle] = React.useState<string>(opportunity?.name || "");
	const [page, setPage] = React.useState<number>(1);
	const [description, setDescription] = React.useState<string>(opportunity?.description || "");
	const [organization, setOrganization] = React.useState<string>(opportunity?.organization || "");
	const [location, setLocation] = React.useState<string>(opportunity?.location || "");
	const [workstyle, setWorkstyle] = React.useState<string>(opportunity?.workstyle || "remote");
	const [logo, setLogo] = React.useState<string>(opportunity?.logo || "");
	const [logoFile, setLogoFile] = React.useState<any>(opportunity?.logo || null);
	const [applyLink, setApplyLink] = React.useState<string>(opportunity?.apply_link || "");
	const [disciplines, setDisciplines] = React.useState<string>(opportunity?.disciplines || '');
	const router = useRouter()
	const context = useContext(AppContext);
	const alert = useAlert();
	const {data: session} = useSession();

	

	const formSubmit = async (e:any) => {

		e.preventDefault();

		if ((title === '') || (organization === '') || (location === '') || (applyLink === '') || (logoFile === undefined)) {
			alert.error('Please fill out all the required fields.', {timeout: 3000});
			return;
		}
		let s3Link = {
			location:null
		};
		
		if(logoFile && typeof logoFile !== 'string') {
			let form = new FormData();
			form.append('file', logoFile);
			let res = await axios.post('/api/file', form, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			s3Link = res.data;
		}
			
		if (id) {
		const formData = {
			name: title,
			description: description,
			organization: organization,
			location: location,
			workstyle: workstyle,
			disciplines: Array.from(new Set(disciplines.trim().replace(/\s*,\s*/g, ",").split(','))).join(','),
			college_id: id,
			apply_link: applyLink,
			org_logo: s3Link.location,
			user_id: session?.user?.id || ''
		}

		await axios.post('/api/opportunities', formData)
	} 
	else if (opportunity){
		const formData = {
			name: title,
			description: description,
			organization: organization,
			location: location,
			workstyle: workstyle,
			disciplines: Array.from(new Set(disciplines.trim().replace(/\s*,\s*/g, ",").split(','))).join(','),
			apply_link: applyLink,
			org_logo: s3Link.location || opportunity.logo,
			id: opportunity.id
		}
		await axios.put(`/api/opportunities`, formData)
	}
		router.push(`/${router.query['college'] || context.editableData?.collegeName}/opportunities`)
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
			<div id={styles.title}>{opportunity? "Edit Opportunity" :"Create Opportunity"}
				<div className={styles.cancel} onClick={() => {router.push(`/${router.query['college'] || context.editableData?.collegeName}`); context.setEdit({})}}> Cancel</div>
			</div>
			</div>
			<div className={styles.body}>
			<form className={styles.formBody} onSubmit={formSubmit}>
				<div id={styles.pageOne} style={{display:page== 1?"block":"none"}}>
				<label>
					<h3>Opportunity Name <span className="required">*</span></h3>
					<input type="text" value={title} onChange={(e) => {validateText(e, setTitle)}} />
				</label>
				<label>
					<h3>Organization <span className="required">*</span></h3>
					<input type='text'	value={organization} onChange={(e) => validateText(e, setOrganization)} />
				</label>
				<label htmlFor="workstyle">
					<h3>Style of Work <span className="required">*</span></h3>
				</label>
					<select id="workstyle" name="workstyle" value={workstyle} onChange={(e) => validateText(e, setWorkstyle)}>
  						<option defaultValue={"remote"} value="remote">Remote</option>
  						<option value="onsite">Onsite</option>
  						<option value="hybrid">Hybrid</option>
					</select>
				<label>
					<h3>Location <span className="required">*</span></h3>
					<input type='text'	value={location} onChange={(e) => validateText(e, setLocation)} />
				</label>
				<label>
					<h3>Link to Apply <span className="required">*</span></h3>
					<p>Enter the link or email applicants will use to apply here.</p>
					<input type='text'	value={applyLink} onChange={(e) => validateText(e, setApplyLink)} />
				</label>
				<label>
					<h3>Disciplines</h3>
					<p>Name any disciplines related to this opportunity. Use a comma to separate them.</p>
					<input type='text'	value={disciplines} onChange={(e) => setDisciplines(e.target.value)} />
				</label>
				
				<label>
					<h3>Company Logo <span className="required">*</span></h3>
					<p>Enter the company logo here.</p>
					<input type='file' onChange={setImageUrl} accept="image/jpeg, image/png"/>
					<div className={styles.file}>Choose File</div>
				</label>
				</div>
				
				<div  style={{display:page== 2?"block":"none"}}>
				<label>
					<h3>Description</h3>
					<p>Enter the description for this opportunity if applicable.</p>
				</label>
					<br />
					{
						typeof document !== undefined && <ReactQuill value={description} onChange={(e) => setDescription(e)} />
					}

				
				</div>
				
				<input className={styles.submit} style={{display:page== 2?"block":"none"}} type='submit' value={opportunity? "Edit Opportunity" :"Create Opportunity"}/>
				<div className={styles.pages}>
					<li style={{opacity:page === 1?0.5:1}} onClick={() => {setPage(1)}}>{'Previous'}</li>
					<li style={{opacity:page === 2?0.5:1}} onClick={() => setPage(2)}>{'Next'}</li>
					
				</div>
			</form>
			<div className={styles.preview}>
			<div className={jobStyles.jobsContainer}>
				<Job 
					id={-1}
					name={title}
					company={organization}
					logo={logo}
					location={location}
					workstyle={workstyle.at(0)?.toUpperCase() + workstyle.slice(1)}
					disciplines={disciplines}
					apply_link={applyLink}
					description={description}
					userId={''}
				/>
			</div>
			</div>
			</div>
		</div>);
}
export default Opportunity