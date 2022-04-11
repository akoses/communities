import prisma from '../../prisma';

import { NextApiResponse, NextApiRequest } from "next";
import SendMails, {OpportunityInformation} from "../../src/lib/email/send";
import {fetchJoinedNotifications} from "../../src/lib/fetch";
import {getSession} from 'next-auth/react';
import {convertName} from "../../src/common/utils";
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  let session = await getSession({req});
  if (!session) {
		return res.status(401).send('Unauthorized');
	}
  if (req.method === 'POST') {
	
	try {
		if (req.body.user_id !== session?.user?.id) {
			return res.status(401).send('Unauthorized');
		}

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

		let notifiedUsers = await fetchJoinedNotifications(req.body.college_id, req.body.user_id)

		let notifiedUsersObjects:OpportunityInformation[] = notifiedUsers.map(user => {
			return ({
				name: user.user.name || '',
				email: user.user.email || '',
				college: user.college.name || '',
				opportunityTitle: req.body.name,
				opportunityImage: req.body.org_logo,
				opportunityLink: 'https://akose.ca/' + convertName(user.college.name) + '/opportunities',
				opportunityLocation: req.body.location,
				opportunityOrganization: req.body.organization,
				opportunityWorkStyle: req.body.workstyle,
				unsubscribeLink:'https://akose.ca' + '/unsubscribe/' + user.user.id + '/' + user.college.id
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
		await prisma.opportunities.updateMany({
			where: {
				id: req.body.id,
				userId: session?.user?.id || ''
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
		await prisma.opportunities.deleteMany({
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