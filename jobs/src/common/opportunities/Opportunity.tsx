/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useContext } from 'react'
import Link from 'next/link'
import styles from '../../../styles/college.module.scss'
import axios from 'axios'
import DeleteModal from '../modal/DeleteModal'
import {AiOutlineEdit} from 'react-icons/ai';
import AppContext from '../../../contexts/AppContext';
import Router, {useRouter} from 'next/router'
import OpportunityModal from '../modal/OpportunityModal'
import { useSession } from 'next-auth/react'

interface JobProps {
	id: number;
	name: string;
	company: string;
	logo: string;
	location: string;
	workstyle: string;
	disciplines: string;
	apply_link: string;
	description: string;
	userId: string;
}

const validateEmail = (email:string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const Opportunity: React.FC<JobProps> = ({id, userId, name, company, logo, location, workstyle, apply_link, disciplines, description}) => {
	const [dlogo, setLogo] = React.useState<string>(logo);
	const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);
	const [opportunityModalIsOpen, setOpportunityModalIsOpen] = React.useState<boolean>(false);
	const [applyLink, setApplyLink] = React.useState<string>(apply_link);
	const router = useRouter()
	const [collegeName] = React.useState<string>(router.asPath.split('/')[1] || '');
	const context = useContext(AppContext);
	const [collegeUserId, setCollegeUserId] = React.useState<string>('');
	const {data: session} = useSession();
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
		// @ts-ignore
		setCollegeUserId(context.collegeData[collegeName]?.userId)
	}, [logo, apply_link, collegeUserId, session])

	const deleteOpportunity = async () => {
		if (logo !== '') {
			let keyName = new URL(logo).pathname
			axios.delete('/api/file', {
				params:{
					keyName
				}
			})
		}
		
		await axios.delete(`/api/opportunities`, {params: {id}})
		window.location.reload()
	}

	const sendEdit = (e:any) => {
		e.preventDefault();
		e.stopPropagation();
		 
		
		
		context.setEdit({
			type: "OPPORTUNITY",
			collegeName,
			id,
			name,
			organization:company,
			description,
			logo,
			location,
			workstyle,
			disciplines,
			apply_link
		})
		Router.push('/edit-post')
	}

	const openModal = (e:any) => {
		e.preventDefault();
		e.stopPropagation();
		setModalIsOpen(true);
	}

	const linkClick = (e:any) => {
		if (description !== '') {
			e.preventDefault();
			e.stopPropagation();
			if (e.target.classList.contains('ReactModal__Overlay') || e.target.tagName === 'BUTTON' || e.target.tagName === 'svg') {
				return;
			}
			setOpportunityModalIsOpen(!opportunityModalIsOpen);
		}
		
		
	}



	return (
		<div>
		<Link  href={applyLink}><a target="_blank" onClick={linkClick}><div className={styles.job}>
			<img className={styles.logo} src={dlogo} 
			/>
			<div className={styles.jobContent}><h1>{name}</h1>
			<h2>{company}</h2>
			<h3>{location} {location !== '' && workstyle !== ''?"|":''} {workstyle.charAt(0)?.toUpperCase() + workstyle.slice(1)}</h3>
			</div>
			{userId === session?.user?.id && <AiOutlineEdit style={{display: id=== -1? 'none':'block'}} className={styles.editIcon} onClick={sendEdit}/>}
			{(collegeUserId === session?.user?.id || userId === session?.user?.id) && <img onClick={openModal} style={{display: id=== -1? 'none':'block'}} src={'/delete.png'} alt='delete' className={`${styles.delete} delete`}/>}
		</div>
		<DeleteModal setOpen={setModalIsOpen} type='opportunity' func={deleteOpportunity} isOpen={modalIsOpen}/>
		
		</a>
		</Link>
		<OpportunityModal opportunity={{
			name,
			organization:company,
			logo,
			location,
			workstyle,
			apply_link,
			description
		}
		} setOpen={setOpportunityModalIsOpen} isOpen={opportunityModalIsOpen}/>
		</div>
		
		);
}
export default Opportunity;