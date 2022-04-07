import React, {useEffect} from 'react'
import Navigation from '../src/common/Navigation'
import {useSession, getSession} from 'next-auth/react'
import Router from 'next/router'
import styles from '../styles/personal.module.scss'
import {fetchUserPosts} from '../src/lib/fetch'
import {Events, Resources, Opportunities} from '@prisma/client'
import Event from '../src/common/events/Event'
import Resource from '../src/common/resources/Resource'
import Opportunity from '../src/common/opportunities/Opportunity'
import Link from 'next/link'
import Head from 'next/head'
import { convertName } from '../src/common/utils'
export type TypeEvent = Events & {type: string, college: {name: string}}
export type TypeResource = Resources & {type: string,  college: {name: string}}
export type TypeOpportunity = Opportunities & {type: string,  college: {name: string}}

interface postsProps {
	posts: {
		events: TypeEvent[];
		opportunities: TypeOpportunity[];
		resources: TypeResource[];
	}
}

type PostOption = 'all' | 'events' | 'resources' | 'opportunities'

	export const renderEvent= (event: TypeEvent) => {

		return <div>
			<div className={styles.collegeName}><Link href={convertName(event.college.name)}><a >{event.college.name}</a></Link></div>
			<Event key={event.id}
			id={event.id}
			name={event.name}
					description={event.description}
					orgLogo={event.orgLogo}
					eventLink={event.eventLink}
					organization={event.organization}
					location={event.location}
					startDate={event.startDate}
					endDate={event.endDate}
					UTCOffset={true}
					userId={event.userId}
			/>
			</div>
	}

	export const renderResource = (resource: TypeResource) => {
		return <div>
			<div className={styles.collegeName}><Link href={convertName(resource.college.name)}><a className={styles.collegeName}>{resource.college.name}</a></Link></div>
			<Resource key={resource.id}
			id={resource.id}
			custom_title={resource.customTitle}
			custom_description={resource.customDescription}
			url={resource.url}
			userId={resource.userId}
			image={resource.image}
			/></div>
	}

	export const renderOpportunity = (opportunity: TypeOpportunity) => {
		return <div>
		<div className={styles.collegeName}><Link href={convertName(opportunity.college.name)}><a className={styles.collegeName}>{opportunity.college.name}</a></Link></div>
		<Opportunity key={opportunity.id}
			id={opportunity.id}	
			name={opportunity.name}
			description={opportunity.description}
			logo={opportunity.orgLogo}
			apply_link={opportunity.applyLink}
			company={opportunity.organization}
			location={opportunity.location}
			disciplines={opportunity.disciplines}
			workstyle={opportunity.workstyle}	
			userId={opportunity.userId}
			/>
		</div>
	}

const Posts: React.FC<postsProps> = ({posts}) => {
	const [options, setOptions] = React.useState<PostOption>('all');
	const {events, opportunities, resources} = posts;
	const [allPosts] = React.useState([...events, ...opportunities, ...resources]);
	const [shownPosts, setShownPosts] = React.useState<JSX.Element[]>([]);

	const {data: session, status} = useSession({
		required: true,
		onUnauthenticated: () => {
			Router.push('/')
		}
	})



	useEffect(() => {
		let datePosts:(TypeEvent | TypeOpportunity | TypeResource)[];
		switch (options) {
			case 'all':
			datePosts = allPosts.sort((a, b) => {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			});
			break;
			case 'events':
			datePosts = events.sort((a, b) => {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			});
			break;
			case 'resources':
			datePosts = resources.sort((a, b) => {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			}
			);
			break;
			case 'opportunities':
			datePosts = opportunities.sort((a, b) => {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			}	
			);
			break;
			default:
			datePosts = allPosts.sort((a, b) => {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			}
			);
		}
		
	
		
		const reactPosts = datePosts.map(post => {
			if (post.type === 'event') {
				return renderEvent(post as TypeEvent)
			} else if (post.type === 'opportunity') {
				return renderOpportunity(post as TypeOpportunity)
			} else if (post.type === 'resource') {
				return renderResource(post as TypeResource)
			}
			else 
				return <></>
		})
		setShownPosts(reactPosts)
	},[posts, allPosts, options, opportunities, events, resources])



	const changeOptions = (option: PostOption) => {
		setOptions(option);
	}
		return (<div>
			<Head>
			<title>{session?.user?.name} | Posts</title>
			</Head>
			{status === 'authenticated' && <><Navigation/>
			<div className={styles.container}>
			
				<div className={styles.options}>
					<button onClick={() => changeOptions('all')}
					 className={options === 'all'?styles.selected:''}>All</button>
					<button onClick={() => changeOptions('events')}
					className={options === 'events'?styles.selected:'' }  >Events</button>
					<button  onClick={() => changeOptions('opportunities')}
					className={options === 'opportunities'?styles.selected:''}>Opportunities</button>
					<button  onClick={() => changeOptions('resources')}
					className ={options === 'resources'?styles.selected:''}>Resources</button>
				</div>
				<div className={styles.posts}>
					{shownPosts}
				</div>
				{
					shownPosts.length === 0 && <div className={styles.empty}>
						<h1>No posts yet</h1>
						<p>Go post in your favorite colleges!</p>
					</div>
				}
			</div></>}
		</div>);
}
export default Posts

export async function getServerSideProps({req}:any) {
	const session = await getSession({req})

	if (session) {
		const posts = await fetchUserPosts(session?.user?.id || '')
		if (posts?.opportunities && posts?.events && posts?.resources) {
			let typedOpportunities = posts.opportunities.map(opportunity => ({
				...opportunity,
				type: 'opportunity'
			}))
			let typedEvents = posts.events.map(event => ({
				...event,
				type: 'event'
			}))
			let typedResources = posts.resources.map(resource => ({
				...resource,
				type: 'resource'
			}))

			return {props: {
				posts: {
					events: typedEvents,
					opportunities: typedOpportunities,
					resources: typedResources
				}
			}}
		}
		
	}

	return {
		props: {
			posts:{
				events:[], opportunities:[], resources:[]
			}
		}
	}
}