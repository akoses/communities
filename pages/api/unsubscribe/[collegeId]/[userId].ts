import {NextApiResponse, NextApiRequest} from 'next';
import prisma from '../../../../prisma';
import axios from 'axios';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
	if (req.method === 'GET') {
		try {
			await prisma.joined.deleteMany({
				where: {
					userId: req.query.userId as string,
					collegeId: Number(req.query.collegeId),
				}
			})
			let resHTML = await axios.get('https://akosejobs.s3.ca-central-1.amazonaws.com/unsubscribe.html')
			return res.send(resHTML.data)
		}
		catch (err) {
			return res.status(500).send(err);
		}
	}
	
}