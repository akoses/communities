import React from 'react'
import Navigation from '../src/common/Navigation'
import {useSession, getSession} from 'next-auth/react'
import Router from 'next/router'
import Head from 'next/head'
import styles from '../styles/personal.module.scss'
import {fetchUserColleges} from '../src/lib/fetch'
import College from '../src/common/College'
import {Colleges as TypeColleges} from '@prisma/client'

interface collegesProps {
	joinedColleges: TypeColleges[];
	createdColleges: {college:TypeColleges}[];
}

const Colleges: React.FC<collegesProps> = ({joinedColleges, createdColleges}) => {
	const {data: session, status} = useSession({
		required: true,
		onUnauthenticated: () => {
			Router.push('/', undefined, { shallow: true })
		}
	})
		return (<div>
			<Head>
				<title>{session?.user?.name} | Colleges</title>
			</Head>
			{status === 'authenticated' && <><Navigation/>
			<div className={styles.container}>
			<h1 className={styles.title}>{session?.user?.name?.endsWith('s')?session.user.name + "'":session?.user?.name + "'s"} Colleges</h1>
			{createdColleges.length > 0 && <div className={styles.createdColleges}>
				<h2 className={styles.college}>Created Colleges</h2>
				<div className={styles.colleges}>
					{createdColleges.map((college: any) => {
						return (<College key={college.id} name={college.name}
							description={college.description}
							logo={college.logo}
							id={college.id}
						/>)
					})}
				</div>
			</div>}
			{joinedColleges.length > 0 && <div className={styles.joinedColleges}>
				<h2 className={styles.college}>Joined Colleges</h2>
				<div className={styles.colleges}>
					{joinedColleges.map((college: any) => {
						return (<College key={college.id} name={college.college.name}
							description={college.college.description}
							logo={college.college.logo}
							id={college.college.id}
						/>)
					})}
				</div>
				</div>}
			{
				(joinedColleges.length === 0 && createdColleges.length === 0) && <div className={styles.noColleges}>
					<h2>You have not joined or created any colleges yet.</h2>
					<h3>Join or create a college to get started.</h3>
				</div>
			}
			</div></>}
		</div>);
}


export async function getServerSideProps({req}:any) {
	const session = await getSession({req});
	if (session) {
		const userColleges = await fetchUserColleges(session?.user?.id || '')
		
		let joinedColleges = [...new Map(userColleges[0].map((college) => [college.college.id, college])).values()]
		joinedColleges = joinedColleges.filter((college) => college.college.userId !== session?.user?.id)
		let createdColleges = [...new Map(userColleges[1].map((college:any) => [college.id, college])).values()]
		
		return {
			props: {
				joinedColleges: joinedColleges,
				createdColleges: createdColleges
			}
		}
	}
	return {
		props: {
			joinedColleges: [],
			createdColleges: []
		}
	}
}	

export default Colleges