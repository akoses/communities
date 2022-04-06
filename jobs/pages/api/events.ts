import {pool} from "../../src/lib/pool";
import { NextApiResponse, NextApiRequest } from "next";
import prisma from '../../prisma'
import SendMails, {EventInformation} from "../../src/lib/email/send";
import { fetchJoinedNotifications } from "../../src/lib/fetch";
import  dateFormat from 'dateformat'


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
	
  if (req.method === 'POST') {
	try {
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
		let notifiedUsers = await fetchJoinedNotifications(req.body.college_id)

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
				eventLink: req.body.event_link,
				eventLocation: req.body.location,
				eventDate: startDate + " - " + endDate,
				eventOrganization: req.body.organization,
				unsubscribeLink:'http://localhost:3000' + '/unsubscribe/' + user.user.id + '/' + user.college.id
			})	
		})
		res.status(200).json({message: 'ok'});

		await SendMails(notifiedUsersObjects, 'Event')
	}
	catch (err) {
		return res.status(500).send(err);
	}
	

  } else if (req.method === 'PUT'){
	
	
	try {
		await prisma.events.update({
			where: {
				id: req.body.id
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
	try {
		await prisma.events.delete({
			where: {
				id: Number(req.query.id)
			}
		})
		}
	catch (err) {
		return res.status(500).send(err);
	}
	return res.status(200).send('ok');
  }

}