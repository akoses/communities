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
	func?: () => void;
	imgsrc?: string
	reversed?: boolean
	vidsrc?: string;
	className?: string;
}

const Content: React.FC<ContentProps> = ({title, className, description, link, linkDescription, func, imgsrc, reversed, vidsrc}) => {
		return (<div className={`${styles.content} ${className}`} style={{flexDirection:reversed?'row':'row-reverse'}}>
			<div className={styles.contentHead}>
		<h2>{title}</h2>
		<p>{description}</p>
		<div onClick={func?func:() => {}}>{link && <Link href={link}><a className={styles.linkContent}><span>{linkDescription}</span><AiOutlineArrowRight /></a></Link>}</div>
		</div>
		<div className={styles.contentImg}>
		{imgsrc && <img src={imgsrc} alt={title}/> }
		{vidsrc && <video src={vidsrc} autoPlay loop muted />}
		</div>
		</div>);
}
export default Content