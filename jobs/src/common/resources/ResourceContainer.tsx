import React, {useEffect, useState} from 'react'
import { LinkPreview } from '@dhaiwat10/react-link-preview/dist';
import styles from '../../../styles/resource.module.scss'
interface Resource {
	link: string;
}

interface ResourceContainerProps {
	resources: Resource[];
}

const ResourceContainer: React.FC<ResourceContainerProps> = ({resources}) => {
	const [showResources, setResources] = useState<JSX.Element[]>([]);
	useEffect(() => {
		setResources(resources.map((res) => {
			return <LinkPreview fallback={null} fallbackImageSrc={''} imageHeight='200px' className={styles.link} key={res.link} url={res.link} />
		}
		))
	},[resources])
		return (<div className={styles.container}>{showResources}</div>);
}
export default ResourceContainer