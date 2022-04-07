/* eslint-disable @next/next/no-img-element */
import React from 'react'
import styles from "../../styles/Home.module.scss"
interface ContentProps {
	title: string;
	description: string;
}

const Content: React.FC<ContentProps> = ({title, description}) => {
		return (<div className={styles.content}>
			<div className={styles.contentHead}>
		<h2>{title}</h2>
		<p>{description}</p>
		</div>
		</div>);
}
export default Content