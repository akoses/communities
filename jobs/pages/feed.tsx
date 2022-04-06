import React, { useEffect } from 'react'
import Navigation from '../src/common/Navigation'
import {useSession} from 'next-auth/react'
import Router from 'next/router'
import Head from 'next/head'
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from '../styles/personal.module.scss';
import Spinner from '../src/common/Spinner';
import {
	TypeEvent,
	TypeResource,
	TypeOpportunity,
	renderEvent,
	renderResource,
	renderOpportunity
} from './posts'
import axios from 'axios'

interface feedProps {

}

const Feed: React.FC<feedProps> = ({}) => {
	const {data: session} = useSession({
		required: true,
		onUnauthenticated: () => {
			Router.push('/')
		}
	})
	const [feedData, setFeedData]  = React.useState<JSX.Element[]>([]);
	const [hasMore, setHasMore] = React.useState<boolean>(true);
	const [start, setStart] = React.useState<boolean>(true);
	const [eventCursor, setEventCursor] = React.useState<number>(0);
	const [resourceCursor, setResourceCursor] = React.useState<number>(0);
	const [opportunityCursor, setOpportunityCursor] = React.useState<number>(0);
	useEffect(() => {
		let fn = async () => {
		let res = await axios.get('/api/posts/feed')
		setEventCursor(res.data.cursors.eventCursor)
		setResourceCursor(res.data.cursors.resourceCursor)
		setOpportunityCursor(res.data.cursors.opportunityCursor)
		setHasMore(res.data.posts.length > 0)
		const reactPosts:JSX.Element[] = res.data.posts.map((post:any) => {
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
		setFeedData(reactPosts)
		}
		fn()
	}, [])
	const fetchData = async () => {
		let res = await axios.get('/api/posts/feed', {
				params: {
					eventCursor,
					opportunityCursor,
					resourceCursor,
					skip:1,
					take:1

				}
			})
		
		setEventCursor(res.data.cursors.eventCursor)
		setResourceCursor(res.data.cursors.resourceCursor)
		setOpportunityCursor(res.data.cursors.opportunityCursor)
		setHasMore(res.data.posts.length > 0)

		const reactPosts:JSX.Element[] = res.data.posts.map((post:any) => {
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
		setFeedData([...feedData, ...reactPosts])
	}
		return (<div>
			<Head><title>{session?.user?.name} | Feed</title></Head>
			<Navigation/>
			<div className={styles.container}>
				<InfiniteScroll
					next={fetchData}
					hasMore={hasMore}
					loader={<Spinner />}
					dataLength={feedData.length}
					>
					{feedData}
				</InfiniteScroll>
			</div>
		</div>);
}
export default Feed