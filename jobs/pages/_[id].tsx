import React, {useEffect} from 'react'
import Router from 'next/router'
import {fetchCollegeName, fetchCollegesNameID} from "../src/lib/fetch"

interface IdRedirectProps {
	name: string
}

const IdRedirect: React.FC<IdRedirectProps> = ({name}) => {

	useEffect(() =>{
		let pathname = window.location.pathname
		Router.push(`/${pathname}/${name.replace(/\s+/g, '-').replace(/,/g, '').toLowerCase()}`, undefined, {shallow: true})
	},[name])
		return (null);
}


export default IdRedirect;

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
	const collegeNameIDs = await fetchCollegesNameID();

  // Get the paths we want to pre-render based on posts
  if (!collegeNameIDs)
    return { paths: [], fallback: true };

  const paths = collegeNameIDs.map(({id}) => 
  {
	return {
	  params: {
		id:String(id),
	  }
	}
  })

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

export async function getStaticProps({params}:any) {
	let name = await fetchCollegeName(params.id)
	
	return {
		props: {
			name: name.name
			
		},
		revalidate: 1
	}
}