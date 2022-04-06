import React, {useContext, useEffect} from 'react'
import styles from '../../../styles/create.module.scss'
import { LinkPreview } from '@dhaiwat10/react-link-preview/dist';
import Router from 'next/router'
import resourceStyles from '../../../styles/resource.module.scss'
import axios from 'axios';
import AppContext from '../../../contexts/AppContext';
import {useSession}	from 'next-auth/react';
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";

interface ResourceProps {
	id?: number;
	resource?: any;
}

const Resource: React.FC<ResourceProps> = ({id, resource}) => {
		const [url, setUrl] = React.useState<string>(resource?.url || "");
		const [customTitle, setCustomTitle] = React.useState<string>(resource?.custom_title || "");
		const [customDescription, setCustomDescription] = React.useState<string>(resource?.custom_description || "");
		const context = useContext(AppContext);
		const [apiData, setApiData] = React.useState<any>(null);
		const {data: session} = useSession();
		const [sendUrl, setSendUrl] = React.useState<string>('');


		useEffect(() => {
    		const delayDebounceFn = setTimeout(() => {
			  setSendUrl(url);
    		}, 800)

    		return () => clearTimeout(delayDebounceFn)
  			}, [url])

		const formSubmit = async (e:any) => {
			e.preventDefault();	
			console.log(apiData);	
			if(!apiData) return;
			if(id){
			const formData = {
				url: url,
				custom_title: customTitle === '' ?apiData?.title || '' : customTitle,
				custom_description: customDescription === ''? apiData?.description || '' : customDescription,
				image: apiData?.image || "",
				college_id: id,
				hostname: apiData?.hostname || "",
				user_id: session?.user?.id || ''
			}
			await axios.post('/api/resources', formData)
		}
		else if (resource){
			const formData = {
				url: url,
				custom_title: customTitle === '' ?apiData?.title || '' : customTitle,
				custom_description: customDescription === ''? apiData?.description || '' : customDescription,
				image: apiData?.image || "",
				hostname: apiData?.hostname || "",
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
				
				<LinkPreview setApiData={setApiData} customTitle={customTitle} customDescription={customDescription}  fallbackImageSrc={''} imageHeight='200px' className={resourceStyles.link} url={sendUrl} />
				<br />
			</div>
			</div>
			</div>
		</div>)
}
export default Resource