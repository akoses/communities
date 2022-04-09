import React, {useEffect, useState} from 'react'
import styles from '../../../styles/resource.module.scss'
import Resource from './Resource'
import {Resources} from "@prisma/client";


interface ResourceContainerProps {
	resources: Resources[];
}

const ResourceContainer: React.FC<ResourceContainerProps> = ({resources}) => {
	const [showResources, setResources] = useState<JSX.Element[]>([]);
	useEffect(() => {
		setResources(resources.map((res) => {
			return <Resource image={res.image} userId={res.userId}key={res.id} id={res.id} url={res.url} custom_title={res.customTitle} custom_description={res.customDescription}/>
		}
		))
	},[resources])
	

		return (<>
		{showResources.length > 0?<div className={styles.container}>{showResources}</div>:<div className={styles.container}><h2>There are no resources available yet.</h2></div>}
		</>
		);
}
export default ResourceContainer