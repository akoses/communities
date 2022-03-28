import React from 'react'
import styles from "../styles/create.module.scss"
import Opportunity from '../src/common/create/Opportunity'
import Event from '../src/common/create/Event'
import Resource from '../src/common/create/Resource'
import Router from 'next/router'

interface CreatePostProps {

}

enum selectedComponent {
	opportunity,
	event,
	resource,
	none
}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
	const [selected, setSelected] = React.useState<selectedComponent>(selectedComponent.none)
		return (
			<div>
		{selected===selectedComponent.none && <div className={styles.container}>
			<div id={styles.title}>What would you like to create?
				<div className={styles.cancel} onClick={() => Router.back()}> Cancel</div>
			</div>
			<div className={styles.create}>

			<div 
			onClick={() => setSelected(selectedComponent.opportunity)} className={styles.createContent} >
				<img src='/images/opportunity.png'  alt='opportunity'/>
				<h2>Opportunity</h2>
				<p>Use this to post any new opportunities. This could be research positions, job postings  or any other opportunities.</p>
			</div>

			<div 
			onClick={() => setSelected(selectedComponent.event)}
			className={styles.createContent}>
				<img src='/images/event.jpg'  alt='event'/>
				<h2>Event</h2>
				<p>Use this post about any related events to this college.</p>
			</div>

			<div className={styles.createContent}
			onClick={() => setSelected(selectedComponent.resource)}
			>
				<img src='/images/resources.jpg'  alt='resources'/>
				<h2>Resource</h2>
				<p>Use this to post any resources you think may be useful.</p>
			</div>
			</div>
		</div>}
		{selected===selectedComponent.opportunity && <Opportunity />}
		{selected===selectedComponent.event && <Event />}
		{selected===selectedComponent.resource && <Resource />}

		</div>);
}
export default CreatePost