import React, {useRef} from 'react'
import styles from '../../styles/alertTemplate.module.scss'
import {AiOutlineClose} from 'react-icons/ai'
import {AlertTemplateProps} from 'react-alert';


const AlertTemplate: React.FC<AlertTemplateProps> = ({message, close}) => {
		const ref = useRef<HTMLDivElement>(null);
		const handleClick = (e:any) => {
			console.log('hello')
				if (ref.current && !ref.current.contains(e.target)) {
						close();
						ref.current.style.display = 'none';
				}
		}
		return (<div className={styles.container} ref={ref}>
		<div className={styles.alert}>
			{message}
		</div>
		</div>
		);
}
export default AlertTemplate