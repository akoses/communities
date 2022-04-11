import { NextApiResponse, NextApiRequest } from "next";
import prisma from '../../prisma'
import SendMails, {EventInformation} from "../../src/lib/email/send";
import { fetchJoinedNotifications } from "../../src/lib/fetch";
import  dateFormat from 'dateformat'
import {getSession} from 'next-auth/react';
import {convertName} from '../../src/common/utils';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
let session = await getSession({req});
  if (req.method === 'POST') {
	  
	  if (!session) {
		  return res.status(401).send('Unauthorized');
	  }
	try {
		if (req.body.user_id !== session?.user?.id) {
			return res.status(401).send('Unauthorized');
		}
		await prisma.events.create({
			data: {
				name: req.body.name,
				description: req.body.description,
				organization: req.body.organization,
				location: req.body.location,
				startDate: req.body.start_date,
				endDate: req.body.end_date,
				eventLink: req.body.event_link,
				orgLogo: req.body.org_logo,
				collegeId: req.body.college_id,
				userId: req.body.user_id,
			}
		});
		let notifiedUsers = await fetchJoinedNotifications(req.body.college_id, req.body.user_id)

		let sd = new Date(req.body.start_date)
		let ed = new Date(req.body.end_date)
		let endDate:string;
		if (sd.getDate() === ed.getDate()
		&& sd.getMonth() === ed.getMonth()
		&& sd.getFullYear() === ed.getFullYear() ){
			endDate = dateFormat(ed, "h:MM TT")
		}
		else{
			endDate = dateFormat(ed, "ddd, mmm d yyyy, h:MM TT")
		}
		let startDate = dateFormat(sd, "ddd, mmm d yyyy, h:MM TT")
		
		let notifiedUsersObjects:EventInformation[] = notifiedUsers.map(user => {
			return ({
				name: user.user.name || '',
				email: user.user.email || '',
				college: user.college.name || '',
				eventTitle: req.body.name,
				eventImage: req.body.org_logo,
				eventLink: "https://akose.ca/" + convertName(user.college.name) + "/events/",
				eventLocation: req.body.location,
				eventDate: startDate + " - " + endDate,
				eventOrganization: req.body.organization,
				unsubscribeLink:`https://akose.ca/api/unsubscribe/${user.college.id}/${user.user.id}`
			})	
		})
		res.status(200).json({message: 'ok'});

		await SendMails(notifiedUsersObjects, 'Event')
	}
	catch (err) {
		return res.status(500).send(err);
	}
	

  } else if (req.method === 'PUT'){
	  if (!session) {
		  return res.status(401).send('Unauthorized');
	  }
	
	try {
		await prisma.events.updateMany({
			where: {
				id: req.body.id,
				userId: session?.user?.id || ''
			},
			data: {
				name: req.body.name,
				description: req.body.description,
				organization: req.body.organization,
				location: req.body.location,
				startDate: req.body.start_date,
				endDate: req.body.end_date,
				eventLink: req.body.event_link,
				orgLogo: req.body.org_logo,
			}
		})
		res.status(200).json({message: 'ok'});
		}
	catch (err) {
		console.error(err);
		return res.status(500).send(err);
	}
	

  }
  
  else if (req.method === 'DELETE') {
	  if (!session) {
		  return res.status(401).send('Unauthorized');
	  }
	try {
		await prisma.events.deleteMany({
			where: {
				id: Number(req.query.id),
				
			}
		})
		}
	catch (err) {
		return res.status(500).send(err);
	}
	return res.status(200).send('ok');
  }

}