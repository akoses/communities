/* eslint-disable @next/next/no-img-element */
import React from 'react'
import styles from '../../../styles/resource.module.scss'
import { LinkPreview } from '@dhaiwat10/react-link-preview/dist';
import axios from 'axios'
import DeleteModal from '../../common/modal/DeleteModal'

interface ResourceProps {
	id: number;
	url: string
	custom_title: string
	custom_description: string
	filter: (id:number) => void
}

const Resource: React.FC<ResourceProps> = ({filter, id, url, custom_title, custom_description}) => {
		const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);
		const deleteResource = async () => {
			
			await axios.delete(`/api/resources`, {params: {id}})
			window.location.reload()
		}

		const openModal = (e:any) => {
			e.stopPropagation()
			setModalIsOpen(true);
		}
		
		return (<div className={styles.resource}>
			<div  key={id}><img src={'/delete.png'} 
				onClick={openModal}
				 className={`${styles.delete} delete`}
				style={{display: id=== -1? 'none':'block'}}
			alt='delete'/><LinkPreview customDescription={custom_description} customTitle={custom_title} fallback={null} fallbackImageSrc={''} imageHeight='200px' 
			className={styles.link} 
			key={url} 
			url={url} />
			<DeleteModal setOpen={setModalIsOpen} type='resource' func={deleteResource} isOpen={modalIsOpen}/></div>
		</div>);
}
export default Resource