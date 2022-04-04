import { NextApiResponse, NextApiRequest } from "next";
import  prisma from '../../prisma';


export default async function handler(req:NextApiRequest, res:NextApiResponse) {

	if (req.method === 'GET') {
		try {
			const colleges = await prisma.colleges.findMany()
			res.status(200).json(colleges);
		} catch (e) {
			res.status(500).json({error: e});
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
			res.status(500).json({error: e});
		}
		res.status(200).json({message: 'ok'});
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
		res.status(200).json({message: 'ok'});
	}

	catch (err) {
		return res.status(500).send(err);
	}
		return res.status(200).send('ok');
  }
 
}