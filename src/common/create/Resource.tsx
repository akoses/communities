import React, {useContext, useEffect, useRef} from 'react'
import styles from '../../../styles/create.module.scss'
//import { LinkPreview } from '@dhaiwat10/react-link-preview/dist';
import Router from 'next/router'
import axios from 'axios';
import AppContext from '../../../contexts/AppContext';
import {useSession}	from 'next-auth/react';
import LinkPreview from '../resources/LinkPreview';
import {useAlert} from 'react-alert'

interface ResourceProps {
	id?: number;
	resource?: any;
}

export const validateText = (e:any, stateUpdate:React.Dispatch<any>) => {
			if (e.target.value.length == 0) {
				e.target.classList.add('errorInput');
			}
			else {
				e.target.classList.remove('errorInput');
			}
			stateUpdate(e.target.value);
		}	


const Resource: React.FC<ResourceProps> = ({id, resource}) => {
		const [url, setUrl] = React.useState<string>(resource?.url || "");
		const [title, setTitle] = React.useState<string>(resource?.custom_title || "");
		const [description, setDescription] = React.useState<string>(resource?.custom_description || "");
		const [image, setImage] = React.useState<string>(resource?.image || "");
		const context = useContext(AppContext);
		const {data: session} = useSession();
		const alert = useAlert();


		useEffect(() => {
    		const delayDebounceFn = setTimeout(async () => {
				try {
					let res = await axios.get('/api/link-preview', {
						params: {
							url: url
						}
					})
					
					if (res.data.title) {
						setTitle(res.data.title);
					} else {
						setTitle('');
					}
					if (res.data.description) {
						setDescription(res.data.description);
					} else {
						setDescription('');
					}
					if (res.data.images) {
						setImage(res.data.images[0]);
					} else {
						if (res.data.favicons) {
							setImage(res.data.favicons[0]);
						}
						setImage('')
					}
					
				} catch (error) {
					console.log(error);
				}
    		}, 500)

    		return () => clearTimeout(delayDebounceFn)
  			}, [url])

		const formSubmit = async (e:any) => {
			e.preventDefault();	
			if (url.length === 0) {
				alert.error("Please fill in the URL field.", {timeout: 3000});
				return;
			}
			if(id){
			const formData = {
				url: url,
				custom_title:title,
				custom_description:description,
				image: image,
				college_id: id,
				user_id: session?.user?.id || ''
			}
			await axios.post('/api/resources', formData)
		}
		else if (resource){
			const formData = {
				url: url,
				custom_title:title,
				custom_description: description,
				image: image,
				id: resource.id,
			}

			await axios.put('/api/resources', formData)
		}
			Router.push(`/${Router.query['community'] || context.editableData?.college_name}/resources`)
		}

		
		return (<div>
			<div>
			<div id={styles.title}>{resource? "Edit Resource" :"Create Resource"}
				<div className={styles.cancel} onClick={() => {Router.push(`/${Router.query['community'] || context.editableData?.collegeName}`); context.setEdit({})}}> Cancel</div>
			</div>
			</div>
			<div className={styles.body}>
			<form className={styles.formBody} onSubmit={formSubmit}>
				<div>
				<label>
					<h3>Resource URL <span className="required">*</span></h3>
					<p>Paste the link of any resource you would like to share with the college.</p>
					<input  type="text" value={url} onChange={(e) => {validateText(e, setUrl)}} />
				</label>
				<label>
					<h3>Title</h3>
					<p>Enter a custom title if needed.</p>
					<input  type="text" value={title} onChange={(e) => {setTitle(e.target.value)}} />
				</label>
				<label>
					<h3>Description</h3>
					<p>Enter a custom description if needed.</p>
					<textarea value={description} onChange={(e) => {setDescription(e.target.value)}} />
				</label>
				</div>
					<input className={styles.submit} type='submit' value={resource? "Edit Resource" :"Create Resource"}/>
			</form>
			<div className={styles.preview}>
			<div className={styles.resourcePreview}>
				<LinkPreview title={title} description={description} url={url} image={image} />
				<br />
			</div>
			</div>
			</div>
		</div>)
}
export default Resource