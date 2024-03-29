/* eslint-disable @next/next/no-img-element */
import React, {useContext, useEffect, useState} from 'react'
import styles from "../../styles/create.module.scss"
import Opportunity from '../../src/common/create/Opportunity'
import Event from '../../src/common/create/Event'
import Resource from '../../src/common/create/Resource'
import Router from 'next/router'
import Head from 'next/head'
import AppContext from '../../contexts/AppContext'
import { useSession } from "next-auth/react"
import { convertName } from '../../src/common/utils'

interface CreatePostProps {
	
}

enum selectedComponent {
	opportunity,
	event,
	resource,
	none
}

const CreatePost: React.FC<CreatePostProps> = () => {
	const [selected, setSelected] = React.useState<selectedComponent>(selectedComponent.none)
	const [college, setCollege] = useState<any>({})
	const context = useContext(AppContext)
	
	useSession({
    required: true,
  })
	useEffect(() => {
		let pathName = window.location.pathname.split('/')[1]
		//@ts-ignore
		setCollege(context.collegeData[pathName])

	}, [context])

		return (
			
			<div>
				<Head>
					<title>{college && college.name + " |"}  Create</title>
				</Head>
		      {selected===selectedComponent.none && <div className={styles.container}>
			<div id={styles.title}>What would you like to create?
				<div className={styles.cancel} onClick={() => Router.push(`/${convertName(college.name)}`)}> Cancel</div>
			</div>
			<div className={styles.create}>
			<div 
			onClick={() => setSelected(selectedComponent.opportunity)} className={styles.createContent} >
				<img src='https://d18px979babcec.cloudfront.net/static/opportunity.png'  alt='opportunity'/>
				<h2>Opportunity</h2>
				<p>Use this to post any new opportunities. This could be research positions, job postings or any other opportunities.</p>
			</div>

			<div 
			onClick={() => setSelected(selectedComponent.event)}
			className={styles.createContent}>
				<img src='https://d18px979babcec.cloudfront.net/static/event.jpg'  alt='event'/>
				<h2>Event</h2>
				<p>Use this post about any related events to this community.</p>
			</div>

			<div className={styles.createContent}
			onClick={() => setSelected(selectedComponent.resource)}
			>
				<img src='https://d18px979babcec.cloudfront.net/static/resources.jpg'  alt='resources'/>
				<h2>Resource</h2>
				<p>Use this to post any resources you think may be useful for this community.</p>
			</div>
			</div>
		</div>}
		{selected===selectedComponent.opportunity && <Opportunity id={college.id}/>}
		{selected===selectedComponent.event && <Event id={college.id} />}
		{selected===selectedComponent.resource && <Resource id={college.id} />}

		</div>
		);
}


export default CreatePost