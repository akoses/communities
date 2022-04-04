/* eslint-disable @next/next/no-img-element */
import React, {useContext} from 'react'
import styles from '../../../styles/resource.module.scss'
import { LinkPreview } from '@dhaiwat10/react-link-preview/dist';
import axios from 'axios'
import DeleteModal from '../../common/modal/DeleteModal'
import {AiOutlineEdit} from 'react-icons/ai';
import AppContext from '../../../contexts/AppContext';
import Router from 'next/router'
import {useSession} from 'next-auth/react'
import { useEffect } from 'react';

interface ResourceProps {
	id: number;
	url: string
	custom_title: string
	custom_description: string
	userId: string
	filter: (id:number) => void
}

const Resource: React.FC<ResourceProps> = ({id, userId, url, custom_title, custom_description}) => {
		const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);
		const context = useContext(AppContext);
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
			let college_name = Router.asPath.split('/')[1]
			context.setEdit({
				type: "RESOURCE",
				college_name,
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
				{(collegeUserId === session?.user?.id || userId === session?.user?.id) && <img src={'/delete.png'} 
				onClick={openModal}
				 className={`${styles.delete} delete`}
				style={{display: id=== -1? 'none':'block'}}
			alt='delete'/>}
			{userId === session?.user?.id &&  <AiOutlineEdit style={{display: id=== -1? 'none':'block'}} className={styles.editIcon} onClick={sendEdit}/>}
			<LinkPreview customDescription={custom_description} customTitle={custom_title} fallback={null} fallbackImageSrc={''} imageHeight='200px' 
			className={styles.link} 
			key={url} 
			url={url} />
			<DeleteModal setOpen={setModalIsOpen} type='resource' func={deleteResource} isOpen={modalIsOpen}/></div>
		</div>);
}
export default Resource