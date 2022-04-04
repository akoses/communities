import {pool} from "../../src/lib/pool";
import { NextApiResponse, NextApiRequest } from "next";
import prisma from '../../prisma'


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
		res.status(200).json({message: 'ok'});
	}
	catch (err) {
		return res.status(500).send(err);
	}
	return res.status(200).send('ok');

  } else if (req.method === 'PUT'){
	const client = await pool.connect();
	
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
	return res.status(200).send('ok');

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