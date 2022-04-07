import { NextApiResponse, NextApiRequest } from "next";
import  prisma from '../../../prisma';

let ILLEGAL_NAMES = [
	'admin',
	'administrator',
	'administrators',
	'api',
	'feed',
	'colleges',
	'posts',
	'about',
	'contact',
	'login',
	'logout',
	'profile',
	'users',
	'user',
	'chat',
	'chats',
	'find college',
	'edit post',
	'post',
]

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
	if (req.method === 'GET') {
		let collegeName = req.query.name as string;
		
		if (ILLEGAL_NAMES.includes(collegeName.toLowerCase())) {
			return res.status(400).send('Illegal name');
		}
		try {
			const college = await prisma.colleges.findMany({
				where: {
					name: {
						equals: collegeName,
						mode:'insensitive'
					}
					
				},
				
				
			});
			
			if (college.length === 0) {
				
				return res.status(200).send('College not found');
			}
			res.status(400).send('College found');
		}
		catch (err) {
			return res.status(500).send(err);
		}
		
	}
}