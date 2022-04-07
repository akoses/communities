import {NextApiResponse, NextApiRequest} from 'next';
import prisma from '../../../../prisma';
import fs from 'fs';
import path from 'path';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
	if (req.method === 'GET') {
		try {
			await prisma.joined.deleteMany({
				where: {
					userId: req.query.userId as string,
					collegeId: Number(req.query.collegeId),
				}
			})
			await fs.readFile(path.join(__dirname, '../../../../../../src/lib/email/templates/unsubscribe.html'), 'utf8', (err, data) => {
				if (err) res.status(500).send(err);
				res.status(200).send(data);
			})
		}
		catch (err) {
			return res.status(500).send(err);
		}
	}
	
}