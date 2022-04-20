import {type NextPage, type NextPageContext} from 'next'
import React from 'react';
import {fetchJob}from '../../../src/lib/fetch'
import {Opportunities} from '@prisma/client'

interface JobProps {
	Job: Opportunities
}

const JobId:NextPage<JobProps> = ({Job}) => {
  return (
	<div>
	  <h1>Job</h1>
	</div>
  )
}

export default JobId;

export const getServerSideProps = async ({params}:any) => {
	const Job = await fetchJob(Number(params.id))
	  return {
	props: {
		Job
	},
  }
}