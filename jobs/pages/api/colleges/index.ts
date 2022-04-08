import { NextApiResponse, NextApiRequest } from "next";
import  prisma from '../../../prisma';
import {getSession} from 'next-auth/react';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
	  const session = await getSession({req});
	if (req.method === 'GET') {
		try {
			const colleges = await prisma.colleges.findMany()
			return res.status(200).json(colleges);
		} catch (e) {
			return res.status(500).json({error: e});
		}
	}

else if (req.method === 'POST') {
		try {
			await prisma.colleges.create({
				data: {
					name: req.body.name,
					description: req.body.description,
					logo: req.body.logo,
					banner: req.body.banner,
					userId: req.body.userId,
				}
			});
		} catch (e) {
			return res.status(500).json({error: e});
		}
		return res.status(200).json({message: 'ok'});
	}
  else if (req.method === 'PUT') {
	
	try {
		await prisma.colleges.update({
			where: {
				id: req.body.id
			},
			data: {
				name: req.body.name,
				description: req.body.description,
				logo: req.body.logo,
				banner: req.body.banner
			}
		})
		return res.status(200).json({message: 'ok'});
	}

	catch (err) {
		return res.status(500).send(err);
	}
		return res.status(200).send('ok');
  }
  else if (req.method === 'DELETE') {
	  if (!session){
		  return res.status(401).send('Unauthorized');
	  }
	  if (!req.query.id) {
		  return res.status(400).send('id is required');
	  }
	  if (req.query.userId !== session?.user?.id) {
		  return res.status(400).send('userId must be same as session id');
	  }
	try {
		await prisma.colleges.deleteMany({
			where: {
				id: Number(req.query.id),
				userId: req.query.userId as string
			}
		})
		return res.status(200).json({message: 'ok'});
	}

	catch (err) {
		return res.status(500).send(err);
	}
  }
 
}