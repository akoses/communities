import React, {useState, useEffect} from 'react'
import Event from './Event'
import styles from '../../../styles/event.module.scss'

interface EventContainerProps {
	events: any[];
}

enum selectEvents {
	past,
	upcoming
}

function convertUTCDateToLocalDate(date:Date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;   
}


const EventContainer: React.FC<EventContainerProps> = ({events}) => {
	const [selected, setSelected] = useState<selectEvents>(selectEvents.upcoming);
	const [shownEvents, setEvents] = useState<any[]>([]);
	useEffect(() => {
		setEvents(
			events.filter((event) => {
				return convertUTCDateToLocalDate(new Date(event.start_date)) > new Date();
			})
		)
	},[events])

		const selectEventType = (eventType: selectEvents) => {
			setSelected(eventType);
			if (eventType === selectEvents.upcoming) {
				setEvents(events.filter((event) => {
					return convertUTCDateToLocalDate(new Date(event.start_date)) > new Date();
				}))
			}
			else {
				setEvents(events.filter((event) => {
					return convertUTCDateToLocalDate(new Date(event.start_date)) < new Date();
				}))
			}
		}
		const filterRequest = (id:number) => {
			setEvents(events.filter((event) => {
				return event.id === id
			}))
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
				return <Event {...event} UTCOffset={false} filter={filterRequest} key={event.title}/>
			})
			}</div>
		</div>);
}
export default EventContainer