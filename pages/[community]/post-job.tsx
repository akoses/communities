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
		      
				<Opportunity id={college.id}/>


		</div>
		);
}


export default CreatePost