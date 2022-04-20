import React, {useEffect} from 'react'
import type {NextPage} from 'next'
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
import {BsThreeDots} from 'react-icons/bs'
export type TypeEvent = Events & {type: string, college: {name: string}}
export type TypeResource = Resources & {type: string,  college: {name: string}}
export type TypeOpportunity = Opportunities & {type: string,  college: {name: string}}

interface postsProps {
	posts: {
		opportunities: TypeOpportunity[];

	}
}



	export const renderOpportunity = (opportunity: TypeOpportunity, session?:any) => {
		return <div>
		<div className={styles.collegeName}><Link href={convertName(opportunity.college.name)}><a className={styles.collegeName}>{opportunity.college.name}</a></Link>
		{session?.user?.id === opportunity.userId && <div className={styles.dots}><BsThreeDots /></div>}
		</div>
		
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

const Posts: NextPage<postsProps> = ({posts}) => {
	
	const  {opportunities} = posts;
	const [allPosts] = React.useState([...opportunities]);
	const [shownPosts, setShownPosts] = React.useState<JSX.Element[]>([]);

	const {data: session, status} = useSession({
		required: true,
		onUnauthenticated: () => {
			Router.push('/')
		}
	})



	useEffect(() => {
		
		const reactPosts = allPosts.map(post => {
			return renderOpportunity(post as TypeOpportunity, session)
		})
		setShownPosts(reactPosts)
	},[posts, allPosts, opportunities, session])




		return (<div>
			<Head>
			<title>{session?.user?.name} | Job Postings</title>
			</Head>
			{status === 'authenticated' && <><Navigation/>
			<div className={styles.container}>
				<div className={styles.posts}>
					{shownPosts}
				</div>
				{
					shownPosts.length === 0 && <div className={styles.empty}>
						<h1>No Job Posted Yet.</h1>
						
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

			let typedOpportunities = posts?.opportunities.map(opportunity => ({
				...opportunity,
				type: 'opportunity'
			}))


			return {props: {
				posts: {
					opportunities: typedOpportunities,
				}
			}}
		
		
	}

	return {
		props: {
			posts:{
				opportunities:[]
			}
		}
	}
}