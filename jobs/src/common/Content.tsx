/* eslint-disable @next/next/no-img-element */
import React from 'react'
import styles from "../../styles/Home.module.scss"
import Link from 'next/link'
import {AiOutlineArrowRight} from 'react-icons/ai'
interface ContentProps {
	title: string;
	description: string;
	link?: string
	linkDescription?: string
	func?: () => void
}

const Content: React.FC<ContentProps> = ({title, description, link, linkDescription, func}) => {
		return (<div className={styles.content}>
			<div className={styles.contentHead}>
		<h2>{title}</h2>
		<p>{description}</p>
		<div onClick={func?func:() => {}}>{link && <Link href={link}><a className={styles.linkContent}><span>{linkDescription}</span><AiOutlineArrowRight /></a></Link>}</div>
		</div>
		</div>);
}
export default Content