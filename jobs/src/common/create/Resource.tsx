import React from 'react'
import styles from '../../../styles/create.module.scss'
import { LinkPreview } from '@dhaiwat10/react-link-preview/dist';
import Router from 'next/router'
import resourceStyles from '../../../styles/resource.module.scss'
import axios from 'axios';

interface ResourceProps {
	id: number;
}

const Resource: React.FC<ResourceProps> = ({id}) => {
		const [url, setUrl] = React.useState<string>("");
		const [customTitle, setCustomTitle] = React.useState<string>("");
		const [customDescription, setCustomDescription] = React.useState<string>("");

		const formSubmit = async (e:any) => {
			e.preventDefault();
			const formData = {
				url: url,
				custom_title: customTitle,
				custom_description: customDescription,
				college_id: id,
			}
			await axios.post('/api/resources', formData)
			Router.push(`/${Router.query['college']}/resources`)
		}

		return (<div>
			<div>
			<div id={styles.title}>Create Resource
				<div className={styles.cancel} onClick={() => Router.back()}> Cancel</div>
			</div>
			</div>
			<div className={styles.body}>
			<form className={styles.formBody} onSubmit={formSubmit}>
				<div>
				<label>
					<h3>Resource URL</h3>
					<p>Paste the link of any resource you would like to share with the college.</p>
					<input type="text" value={url} onChange={(e) => {setUrl(e.target.value)}} />
				</label>
				<label>
					<h3>Custom Title</h3>
					<p>Enter a custom title if needed.</p>
					<input type="text" value={customTitle} onChange={(e) => {setCustomTitle(e.target.value)}} />
				</label>
				<label>
					<h3>Custom Description</h3>
					<p>Enter a custom description if needed.</p>
					<input type="text" value={customDescription} onChange={(e) => {setCustomDescription(e.target.value)}} />
				</label>
			
				</div>
					<input className={styles.submit} type='submit' value='Create Resource'/>
			</form>
			<div className={styles.preview}>
			<div className={styles.resourcePreview}>
				<LinkPreview customTitle={customTitle} customDescription={customDescription}  fallbackImageSrc={''} imageHeight='200px' className={resourceStyles.link} url={url} />
				<br />
			</div>
			</div>
			</div>
		</div>)
}
export default Resource