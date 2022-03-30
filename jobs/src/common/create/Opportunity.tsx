import React from 'react'
import Job from '../jobs/Job'
import styles from '../../../styles/create.module.scss'
import jobStyles from '../../../styles/college.module.scss'
import Router from 'next/router'
import 'react-quill/dist/quill.snow.css'; // ES6
import ReactQuill from '../quill/QuillSSR'; 
import { useRouter } from 'next/router'
import S3Client from '../../lib/S3'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

interface OpportunityProps {
	id:number;
}



const Opportunity: React.FC<OpportunityProps> = ({id}) => {
	const [title, setTitle] = React.useState<string>("");
	const [page, setPage] = React.useState<number>(1);
	const [description, setDescription] = React.useState<string>("");
	const [organization, setOrganization] = React.useState<string>("");
	const [location, setLocation] = React.useState<string>("");
	const [workstyle, setWorkstyle] = React.useState<string>("remote");
	const [logo, setLogo] = React.useState<string>("");
	const [logoFile, setLogoFile] = React.useState<any>()
	const [applyLink, setApplyLink] = React.useState<string>("");
	const [disciplines, setDisciplines] = React.useState<string>('');
	const router = useRouter()
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
			workstyle: workstyle,
			disciplines: disciplines,
			college_id: id,
			apply_link: applyLink,
			org_logo: s3Link.location,
		}

		await axios.post('/api/opportunities', formData)
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
			<div id={styles.title}>Create Opportunity
				<div className={styles.cancel} onClick={() => Router.back()}> Cancel</div>
			</div>
			</div>
			<div className={styles.body}>
			<form className={styles.formBody} onSubmit={formSubmit}>
				<div id={styles.pageOne} style={{display:page== 1?"block":"none"}}>
				<label>
					<h3>Opportunity Name</h3>
					<input type="text" value={title} onChange={(e) => {setTitle(e.target.value)}} />
				</label>
				<label>
					<h3>Organization</h3>
					<input type='text'	value={organization} onChange={(e) => setOrganization(e.target.value)} />
				</label>
				<label htmlFor="workstyle">
					<h3>Style of Work</h3>
				</label>
					<select id="workstyle" name="workstyle" value={workstyle} onChange={(e) => setWorkstyle(e.target.value)}>
  						<option defaultValue={"remote"} value="remote">Remote</option>
  						<option value="onsite">Onsite</option>
  						<option value="hybrid">Hybrid</option>
					</select>
				<label>
					<h3>Location</h3>
					<input type='text'	value={location} onChange={(e) => setLocation(e.target.value)} />
				</label>
				<label>
					<h3>Link to Apply</h3>
					<p>Enter the link or email applicants will use to apply here.</p>
					<input type='text'	value={applyLink} onChange={(e) => setApplyLink(e.target.value)} />
				</label>
				<label>
					<h3>Disciplines</h3>
					<p>Name any disciplines related to this opportunity. Use a comma to separate them.</p>
					<input type='text'	value={disciplines} onChange={(e) => setDisciplines(e.target.value)} />
				</label>
				
				<label>
					<h3>Company Logo</h3>
					<p>Enter the company logo here.</p>
					<input type='file' onChange={setImageUrl} />
					<div className={styles.file}>Choose File</div>
				</label>
				</div>
				
				<div  style={{display:page== 2?"block":"none"}}>
				<label>
					<h3>Job Description</h3>
					<p>Enter the job description here if applicable.</p>
					<br />
					{
						typeof document !== undefined && <ReactQuill value={description} onChange={(e) => setDescription(e)} />
					}

				</label>
				</div>
				
				<input className={styles.submit} style={{display:page== 2?"block":"none"}} type='submit' value='Create Opportunity'/>
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
				/>
			</div>
			</div>
			</div>
		</div>);
}
export default Opportunity