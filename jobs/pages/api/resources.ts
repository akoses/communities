import prisma from '../../prisma';
import SendMails, { ResourceInformation } from '../../src/lib/email/send';
import {fetchJoinedNotifications} from '../../src/lib/fetch';

export default async function handler(req:any, res:any) {
  if (req.method === 'POST') {
	
	try {
		await prisma.resources.create({
			data: {
				customTitle: req.body.custom_title,
				customDescription: req.body.custom_description,
				url: req.body.url,
				collegeId: req.body.college_id,
				userId: req.body.user_id,
				image: req.body.image,
				hostname: req.body.hostname,
			}
		});
		let notifiedUsers = await fetchJoinedNotifications(req.body.college_id)

		let notifiedUsersObjects:ResourceInformation[] = notifiedUsers.map(user => {
			return ({
				name: user.user.name || '',
				email: user.user.email || '',
				college: user.college.name || '',
				resourceTitle: req.body.custom_title,
				resourceImage: req.body.image,
				resourceLink: req.body.url,
				resourceHostname: req.body.hostname,
				resourceDescription: req.body.custom_description,
				unsubscribeLink:'http://localhost:3000' + '/unsubscribe/' + user.user.id + '/' + user.college.id
			})	
		})
			 res.status(200).send('ok');
			await SendMails(notifiedUsersObjects, 'Resource')

		}
	catch (err) {
		return res.status(500).send(err);
	}
		
  }
  	else if (req.method === 'PUT'){

	try {
		await prisma.resources.update({
			where: {
				id: req.body.id
			}, data: {
				customTitle: req.body.custom_title,
				customDescription: req.body.custom_description,
				url: req.body.url,
				image: req.body.image,
				hostname: req.body.hostname,
			}
		})
		}
	catch (err) {
		console.error(err);
		return res.status(500).send(err);
	}
		return res.status(200).send('ok');
  }
	  
  else if (req.method === 'DELETE') {
	try {
		await prisma.resources.delete({
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