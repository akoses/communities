import React, {useState} from 'react'
import Event from './Event'
import styles from '../../../styles/event.module.scss'

interface EventContainerProps {
	events: any[];
}

enum selectEvents {
	past,
	upcoming
}

const EventContainer: React.FC<EventContainerProps> = ({events}) => {
	const [selected, setSelected] = useState<selectEvents>(selectEvents.upcoming);
	const [shownEvents, setEvents] = useState<any[]>(
		events.filter((event) => {
			return event.date > new Date();
		})
	)

		const selectEventType = (eventType: selectEvents) => {
			setSelected(eventType);
			if (eventType === selectEvents.upcoming) {
				setEvents(events.filter((event) => {
					return event.date > new Date();
				}))
			}
			else {
				setEvents(events.filter((event) => {
					return event.date < new Date();
				}))
			}
		}

		return (
		<div>
			<ul className={styles.eventOptions}>
				<li 
					onClick={() => selectEventType(selectEvents.upcoming)}
				className={selected === selectEvents.upcoming? styles.selected:""}>Upcoming events</li>
				<li 
					onClick={() => selectEventType(selectEvents.past)}
				className={selected === selectEvents.past? styles.selected:""} >Past events</li>
			</ul>
		<div className={styles.container}>{
			shownEvents.length === 0? <div className={styles.noEvents}>Sorry, no events were found.</div>:
			shownEvents.map((event) => {
				return <Event {...event} key={event.title}/>
			})
			}</div>
		</div>);
}
export default EventContainer