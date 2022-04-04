import React, {useContext} from 'react'
import styles from '../../../styles/create.module.scss'
import { LinkPreview } from '@dhaiwat10/react-link-preview/dist';
import Router from 'next/router'
import resourceStyles from '../../../styles/resource.module.scss'
import axios from 'axios';
import AppContext from '../../../contexts/AppContext';
import {useSession}	from 'next-auth/react';

interface ResourceProps {
	id?: number;
	resource?: any;
}

const Resource: React.FC<ResourceProps> = ({id, resource}) => {
		const [url, setUrl] = React.useState<string>(resource?.url || "");
		const [customTitle, setCustomTitle] = React.useState<string>(resource?.custom_title || "");
		const [customDescription, setCustomDescription] = React.useState<string>(resource?.custom_description || "");
		const context = useContext(AppContext);
		const {data: session} = useSession();
		const formSubmit = async (e:any) => {
			e.preventDefault();
			if(id){
			const formData = {
				url: url,
				custom_title: customTitle,
				custom_description: customDescription,
				college_id: id,
				user_id: session?.user?.id || ''
			}
			await axios.post('/api/resources', formData)
		}
		else if (resource){
			const formData = {
				url: url,
				custom_title: customTitle,
				custom_description: customDescription,
				id: resource.id,
			}

			await axios.put('/api/resources', formData)
		}
			Router.push(`/${Router.query['college'] || context.editableData?.college_name}/resources`)
		}

		return (<div>
			<div>
			<div id={styles.title}>{resource? "Edit Resource" :"Create Resource"}
				<div className={styles.cancel} onClick={() => {Router.back(); context.setEdit({})}}> Cancel</div>
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
					<input className={styles.submit} type='submit' value={resource? "Edit Resource" :"Create Resource"}/>
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