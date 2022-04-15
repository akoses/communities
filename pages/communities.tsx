import React from 'react'
import axios from 'axios'
import Navigation from '../src/common/Navigation'
import {useSession, getSession} from 'next-auth/react'
import Router from 'next/router'
import Head from 'next/head'
import styles from '../styles/personal.module.scss'
import {fetchUserColleges} from '../src/lib/fetch'
import College from '../src/common/College'
import {Colleges as TypeColleges} from '@prisma/client'
import { NextPage } from 'next'
import DeleteModal from '../src/common/modal/DeleteModal'
import Link from 'next/link'
import CollegeModal from '../src/common/modal/CollegeModal'

interface collegesProps {
	joinedColleges: TypeColleges[];
	createdColleges: {college:TypeColleges}[];
}

const Colleges: NextPage<collegesProps> = ({joinedColleges, createdColleges}) => {
	const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);
	const [collegeOpen, setCollegeOpen] = React.useState<boolean>(false);
	const [deleteCollege, setDeleteCollege] = React.useState<number>(-1);
	const {data: session, status} = useSession({
		required: true,
		onUnauthenticated: () => {
			Router.push('/', undefined, { shallow: true })
		}
	})

	const deleteCollegeByID = (id:number) => {
		axios.delete(`/api/colleges`, {params: {
			id,
			userId: session?.user?.id
		}}).then(() => {
			Router.reload()
		})

	}
		return (<div>
			<Head>
				<title>{session?.user?.name} | Communities</title>
			</Head>
			{status === 'authenticated' && <><Navigation/>
			<div className={styles.container}>
			
			{createdColleges.length > 0 && <div className={styles.createdColleges}>
				<h2 className={styles.college}>Created Communities</h2>
				<div className={styles.colleges}>
					{createdColleges.map((college: any) => {
						return (
						<div key={college.id} className={styles.collegeCreate}>
							<College name={college.name}
							description={college.description}
							logo={college.logo}
							id={college.id}
						/>
						
						</div>)
					})}
				</div>
			</div>}
			{joinedColleges.length > 0 && <div className={styles.joinedColleges}>
				<h2 className={styles.college}>Joined Communities</h2>
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
				(joinedColleges.length === 0 && createdColleges.length === 0) && <div className={styles.empty}>
					<h2>You have not joined or created any communities yet.</h2>
					<p><Link href="/find-communities"><a>Join</a></Link> or <Link href="/communities"><a onClick={() => setCollegeOpen(true)}>create a community</a></Link> to get started.</p>
				</div>
			}
			</div>
			<div></div>
			<DeleteModal setOpen={setModalIsOpen} type='community' func={() => deleteCollegeByID(deleteCollege)} isOpen={modalIsOpen}/>
			<CollegeModal type='create' setOpen={setCollegeOpen} isOpen={collegeOpen} />
			</>}
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