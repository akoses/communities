import React, {useRef} from 'react'
import styles from '../../styles/alertTemplate.module.scss'
import {AlertTemplateProps} from 'react-alert';


const AlertTemplate: React.FC<AlertTemplateProps> = ({message, style, options}) => {
		const ref = useRef<HTMLDivElement>(null);
		return (<div className={`${styles.container} ${options.type === 'success'? styles.success:''}`} style={style} ref={ref}>
		<div className={styles.alert}>
			{message}
		</div>
		</div>
		);
}
export default AlertTemplate