import {NextApiResponse, NextApiRequest} from 'next';
import prisma from '../../../prisma';
import {getSession} from 'next-auth/react';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
	let session = await getSession({req});
	if (!session) {
		return res.status(401).send('Unauthorized');
	}
	if (req.method === 'PUT') {
		
		try {
			await prisma.joined.updateMany({
			where: {
				userId: req.body.userId,
				collegeId: Number(req.body.collegeId),
			},
			data: {
				emailNotification: req.body.emailNotification,
			},
			
		})
		res.status(200).send('ok');
	}
	catch (err) {
		return res.status(500).send(err);
	}
		
	}
}