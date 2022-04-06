import {NextApiResponse, NextApiRequest} from 'next';
import prisma from '../../../prisma';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
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