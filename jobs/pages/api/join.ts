import prisma from '../../prisma'

import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

	if (req.method === 'POST') {
		try {
			await prisma.joined.create({
				data: {
					userId: req.body.userId,
					collegeId: req.body.collegeId,
				}
			});
			res.status(200).send('ok');
		}
		catch (err) {
			return res.status(500).send(err);
		}
	}
	else if (req.method === 'DELETE') {
		try {
			await prisma.joined.deleteMany({
				where: {
					userId: req.query.userId as string,
					collegeId: Number(req.query.collegeId),
				}
			});
			res.status(200).send('ok');
		}
		catch (err) {
			return res.status(500).send(err);
		}
	}
	else if (req.method === 'GET') {
		try {
			const joined = await prisma.joined.count({
				where: {
					userId: req.query.userId as string,
					collegeId: Number(req.query.collegeId),
				}
			});
			res.status(200).json({count:joined});
		}
		catch (err) {
			return res.status(500).send(err);
		}
	}
}