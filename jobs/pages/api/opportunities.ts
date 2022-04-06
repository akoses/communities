import prisma from '../../prisma';

import { NextApiResponse, NextApiRequest } from "next";
import SendMails, {OpportunityInformation} from "../../src/lib/email/send";
import {fetchJoinedNotifications} from "../../src/lib/fetch";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
	
  if (req.method === 'POST') {
	
	try {
		await prisma.opportunities.create({
			data: {
				name: req.body.name,
				description: req.body.description,
				organization: req.body.organization,
				location: req.body.location,
				workstyle: req.body.workstyle,
				disciplines: req.body.disciplines,
				collegeId: req.body.college_id,
				userId: req.body.user_id,
				applyLink: req.body.apply_link,
				orgLogo: req.body.org_logo,
			}
		})
		let notifiedUsers = await fetchJoinedNotifications(req.body.college_id)

		let notifiedUsersObjects:OpportunityInformation[] = notifiedUsers.map(user => {
			return ({
				name: user.user.name || '',
				email: user.user.email || '',
				college: user.college.name || '',
				opportunityTitle: req.body.name,
				opportunityImage: req.body.org_logo,
				opportunityLink: req.body.apply_link,
				opportunityLocation: req.body.location,
				opportunityOrganization: req.body.organization,
				opportunityWorkStyle: req.body.workstyle,
				unsubscribeLink:'http://localhost:3000' + '/unsubscribe/' + user.user.id + '/' + user.college.id
			})	
		})

		res.status(200).send('ok');
		
		await SendMails(notifiedUsersObjects, 'Opportunity')

		
		}
	catch (err) {
		return res.status(500).send(err);
	}
	
  }

  else if (req.method === 'PUT'){
	
	try {

		await prisma.opportunities.update({
			where: {
				id: req.body.id
		}, data: {
			name: req.body.name,
			description: req.body.description,
			organization: req.body.organization,
			location: req.body.location,
			workstyle: req.body.workstyle,
			disciplines: req.body.disciplines,
			orgLogo: req.body.org_logo,
			applyLink: req.body.apply_link,
		}
		})
		}
	catch (err) {
		return res.status(500).send(err);
	}
	return res.status(200).send('ok');
  }

  else if (req.method === 'DELETE') {
	  
	try {
		await prisma.opportunities.delete({
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