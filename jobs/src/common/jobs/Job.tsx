/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react'
import Link from 'next/link'
import styles from '../../../styles/college.module.scss'
import axios from 'axios'
import DeleteModal from '../../common/modal/DeleteModal'
import S3Client from '../../lib/S3';

interface JobProps {
	id: number;
	name: string;
	company: string;
	logo: string;
	location: string;
	workstyle: string;
	disciplines: string;
	apply_link: string;
}

const validateEmail = (email:string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const Opportunity: React.FC<JobProps> = ({id, name, company, logo, location, workstyle, apply_link}) => {
	const [dlogo, setLogo] = React.useState<string>(logo);
	const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);
	const [applyLink, setApplyLink] = React.useState<string>(apply_link);
	useEffect(() => {
		if (logo === '') {
			setLogo('/default.png')
		}
		else {
			setLogo(logo)
		}
		if (validateEmail(apply_link)) {
			setApplyLink("mailto:"+ apply_link)
		}
		else{
			setApplyLink(apply_link)
		}
	}, [logo, apply_link])

	const deleteOpportunity = async () => {
		if (logo !== '') {
			let keyName = new URL(logo).pathname
			await S3Client.deleteFile(keyName)
		}
		
		await axios.delete(`/api/opportunities`, {params: {id}})
		window.location.reload()
	}

	const openModal = (e:any) => {
		e.preventDefault();
		e.stopPropagation();
		setModalIsOpen(true);
	}

	return (
		<Link href={applyLink}><a target="_blank" ><div className={styles.job}>
			<img className={styles.logo} src={dlogo} 
				onError={i => i.target.style.display='none'}
			/>
			<div className={styles.jobContent}><h1>{name}</h1>
			<h2>{company}</h2>
			<h3>{location} {location !== '' && workstyle !== ''?"|":''} {workstyle.charAt(0)?.toUpperCase() + workstyle.slice(1)}</h3>
			</div>

			<img onClick={openModal} style={{display: id=== -1? 'none':'block'}} src={'/delete.png'} alt='delete' className={`${styles.delete} delete`}/>
		</div>
		<DeleteModal setOpen={setModalIsOpen} type='opportunity' func={deleteOpportunity} isOpen={modalIsOpen}/>
		</a>
		</Link>);
}
export default Opportunity;