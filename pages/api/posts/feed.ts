import {NextApiResponse, NextApiRequest} from 'next';
import prisma from '../../../prisma';
import { getSession } from 'next-auth/react';
import {
	Events,
	Opportunities,
	Resources,
} from '@prisma/client';

const getAllColledgeIds = async (userId: string) => {
	let ids = await prisma.user.findMany({
		where: {
			id: userId
		},
		select: {
			joined: {
				select: {
					collegeId: true
				}
			},
			colleges: {
				select: {
					id: true
				}
			}
		},
	});
	let flatIds = ids.map(id => id.joined.map(j => j.collegeId)).flat();
	let collegeIds = ids.map(id => id.colleges.map(c => c.id)).flat();
	return [...new Set([...flatIds, ...collegeIds])];
}

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
	if (req.method === 'GET') {
		const session = await getSession({ req });
		if (!session) {
			return res.status(401).send('Unauthorized');
		}

		const userId = session?.user?.id || '';
		let collegeIds = await getAllColledgeIds(userId);
		
		collegeIds = Array.from(new Set(collegeIds));
		
		let events:Events[];
		let resources:Resources[];
		let opportunities:Opportunities[];

		if (req.query.eventCursor && req.query.opportunityCursor && req.query.resourceCursor) {
			[events, opportunities, resources] = await Promise.all([prisma.events.findMany({
			take: Number(req.query.take) || 5,
			skip: Number(req.query.skip) || 0,
			where: {
				collegeId: {
					in: collegeIds
				}
			},
			select: {
						id: true,
						name: true,
						description: true,
						college: {
							select: {
								name: true
							}
						},
						collegeId: true,
						createdAt: true,
						updatedAt: true,
						startDate: true,
						endDate: true,
						organization:true,
						location:true,
						orgLogo:true,
						userId: true,
						eventLink: true,
					},
			orderBy: {
				createdAt: 'desc'
			},
			cursor:{
				id: Number(req.query.eventCursor) || 0
			}

		}), prisma.opportunities.findMany({
			take: Number(req.query.take) || 5,
			skip: Number(req.query.skip) || 0,
			where: {
				collegeId: {
					in: collegeIds
				}
			},
			select: {
						id: true,
						createdAt: true,
						updatedAt: true,
						name: true,
						description: true,
						location: true,
						organization: true,
						disciplines: true,
						college: {
							select: {
								name: true
							}
						},
						collegeId: true,
						userId: true,
						applyLink: true,
						orgLogo: true,
						workstyle: true,
					},
			orderBy: {
				createdAt: 'desc'
			},
			cursor:{
				id: Number(req.query.opportunityCursor) || 0
			},

		}), prisma.resources.findMany({
			take: Number(req.query.take) || 5,
			skip: Number(req.query.skip) || 0,
			where: {
				collegeId: {
					in: collegeIds
				},
			},
			select: {
						id: true,
						createdAt: true,
						updatedAt: true,
						customTitle: true,
						customDescription: true,
						image: true,
						collegeId: true,
						
						college: {
							select: {
								name: true
							}
						},
						userId: true,
						url: true,
					},
			orderBy: {
				createdAt: 'desc'
			},
			cursor:{
				id: Number(req.query.resourceCursor) || 0
			},
		})]);

		} else {
			[events, opportunities, resources] = await Promise.all([prisma.events.findMany({
			take: Number(req.query.take) || 6,
			skip: Number(req.query.skip) || 0,
			where: {
				collegeId: {
					in: collegeIds
				}
			},
			select: {
						id: true,
						name: true,
						description: true,
						college: {
							select: {
								name: true
							}
						},
						createdAt: true,
						updatedAt: true,
						startDate: true,
						endDate: true,
						organization:true,
						location:true,
						orgLogo:true,
						userId: true,
						eventLink: true,
						collegeId: true,
					},
			orderBy: {
				createdAt: 'desc'
			},

		}), prisma.opportunities.findMany({
			take: Number(req.query.take) || 6,
			skip: Number(req.query.skip) || 0,
			where: {
				collegeId: {
					in: collegeIds
				}
			},
			select: {
						id: true,
						createdAt: true,
						updatedAt: true,
						name: true,
						description: true,
						location: true,
						organization: true,
						disciplines: true,
						college: {
							select: {
								name: true
							}
						},
						userId: true,
						applyLink: true,
						orgLogo: true,
						workstyle: true,
						collegeId: true,
					}
			,
			orderBy: {
				createdAt: 'desc'
			},

		}), prisma.resources.findMany({
			take: Number(req.query.take) || 6,
			skip: Number(req.query.skip) || 0,
			where: {
				collegeId: {
					in: collegeIds
				},
			},select: {
						id: true,
						createdAt: true,
						updatedAt: true,
						customTitle: true,
						customDescription: true,
						image: true,
						college: {
							select: {
								name: true
							}
						},
						userId: true,
						url: true,
						collegeId: true,
					},
			orderBy: {
				createdAt: 'desc'
			},
		})]);
		}
		

		events = events.map(e => {
			return {
				...e,
				type: 'event'
			}
		})
		opportunities = opportunities.map(o => {
			return {
				...o,
				type: 'opportunity'
			}
		})
		resources = resources.map(r => {
			return {
				...r,
				type: 'resource'
			}
		})

		let posts = [...events, ...opportunities, ...resources];
		posts.sort((a, b) => {
			return b.createdAt.getTime() - a.createdAt.getTime();
		})

		let cursors = {
			eventCursor: events.length > 0 ? events[events.length - 1].id : 0,
			opportunityCursor: opportunities.length > 0 ? opportunities[opportunities.length - 1].id : 0,
			resourceCursor: resources.length > 0 ? resources[resources.length - 1].id : 0,
		}
		
		res.status(200).json({cursors, posts});
	}

}