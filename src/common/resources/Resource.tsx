/* eslint-disable @next/next/no-img-element */
import React, {useContext} from 'react'
import styles from '../../../styles/resource.module.scss'
import LinkPreview from './LinkPreview';
import axios from 'axios'
import DeleteModal from '../../common/modal/DeleteModal'
import {AiOutlineEdit} from 'react-icons/ai';
import AppContext from '../../../contexts/AppContext';
import CommunityContext from '../../../contexts/CommunityContext';
import Router from 'next/router'
import {useSession} from 'next-auth/react'
import { useEffect } from 'react';


interface ResourceProps {
	id: number;
	url: string
	custom_title: string
	custom_description: string
	image: string
	userId: string
}




const Resource: React.FC<ResourceProps> = ({id, userId, url, custom_title, custom_description, image}) => {
		const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);
		const context = useContext(AppContext);
		const communityContext = useContext(CommunityContext);
		const [collegeName] = React.useState<string>(Router.asPath.split('/')[1] || '');
		const [collegeUserId, setCollegeUserId] = React.useState<string>('');

		const {data: session} = useSession();

		const deleteResource = async () => {
			
			await axios.delete(`/api/resources`, {params: {id}})
			window.location.reload()
		}

		useEffect(() => {
			//@ts-ignore
			setCollegeUserId(context.collegeData[collegeName]?.userId)
		}, [session, collegeUserId, context.collegeData, collegeName])

		const sendEdit = () => {
			let collegeName = Router.asPath.split('/')[1]
			context.setEdit({
				type: "RESOURCE",
				collegeName,
				id,
				url,
				custom_title,
				custom_description
			})
			Router.push('/edit-post')
		}

		const openModal = (e:any) => {
			e.stopPropagation()
			setModalIsOpen(true);
		}
		
		return (<div className={styles.resource}>
			<div  key={id}>
				
			<LinkPreview description={custom_description} title={custom_title}  image={image} url={url} key={id} />
			{communityContext.editor && <button onClick={openModal} className={'editorDelete'}>Delete Resource</button>}
			<DeleteModal setOpen={setModalIsOpen} type='resource' func={deleteResource} isOpen={modalIsOpen}/></div>
		</div>);
}
export default Resource