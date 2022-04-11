
import prisma from '../../prisma';
export async function fetchColleges() {
  try {
	const res = await prisma.colleges.findMany()
	return res
  } catch (err) {
	console.error(err)
  }
  
}

export async function fetchFeaturedColleges() {
	try {
	  const res = await prisma.colleges.findMany({
		  take:3
	  })
	  return res
	} catch (err) {
	  console.error(err)
	} 

}

export async function fetchData(id: number) {
	const data:any = {
		opportunities: [],
		events: [],
		resources: [],

	};
	[data.opportunities, data.events, data.resources] = await Promise.all([
	fetchOpportunities(id),
	fetchEvents(id),
	fetchResources(id)
	]);
	return data;
}

async function fetchOpportunities(id:number) {
  try {
	const res = await prisma.opportunities.findMany({
		where: {
			collegeId: id
		},
		orderBy: {
			createdAt: 'desc'
		}
	})
	return res
  } catch (err) {
	console.error(err)
  } 
}


async function fetchEvents(id:number) {
  try {
	const res = await prisma.events.findMany({
		where: {
			collegeId: id
		},
		orderBy: {
			createdAt: 'desc'
		}
	})
	return res
  } catch (err) {
	console.error(err)
  }
}

async function fetchResources(id:number) {
  try {
	const res = await prisma.resources.findMany({
		where: {
			collegeId: id
		},
		orderBy: {
			createdAt: 'desc'
		}
	})
	return res
  } catch (err) {
	console.error(err)
  } finally {
  }
}

export async function fetchCollegesNameID() {
  try {
	const res = await prisma.colleges.findMany(
		{
			select:{
				id: true,
				name: true
			}
		}
	)
	return res
  } catch (err) {
	console.error(err)
  } finally {

  }
}


export async function fetchCollege(name:string) {

	//@ts-ignore
	let collegeName = name.replace(/-/g, ' ');
	
	 
  try {
	const res = await prisma.colleges.findFirst({
		where: {
			name: {
				equals: collegeName,
				mode: 'insensitive'
			},
			
		},
	
	})
	const collegeCount = await prisma.joined.count({
		where: {
			college:{name: {equals: collegeName, mode: 'insensitive'}}
		}
	})
	if (!res)
		return null;
	return {...res, collegeCount}
  } catch (err) {
	console.error(err)
  } 
}


export async function fetchCollegeName(id:string) {

	  
  try {
	const res = await prisma.colleges.findFirst({
		where: {
			id: Number(id)
		},
		select: {
			name: true
		}
	});

	return res?.name
  } catch (err) {
	console.error(err)
  } 
}

export async function fetchJoinedCollege(userId:string, collegeId:number) {
	try {
		const res = await prisma.joined.findMany({
			where: {
				userId: userId,
				collegeId: Number(collegeId)
			}
		})
		return res
	} catch (err) {
		console.error(err)
		return []
	}
}

export async function fetchUserColleges(id:string) {
	try {
		const allRes = await Promise.all([prisma.joined.findMany({
			select:{
				college:true
			},
			where: {
				userId: id
			}
		}),prisma.colleges.findMany({
			where: {
				userId: id
			}
		})])
		return allRes
	} catch (err) {
		console.error(err)
		return []
	}
}

export async function fetchUserPosts(id:string) {
	try {
		const res = await prisma.user.findUnique({
			select:{
				events: {
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
					}
				},
				opportunities: {
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
					}
				},
				resources: {
					select: {
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
					}
				},
				
			},
			where: {
				id: id
			}
		})
		return res
	} catch (err) {
		console.error(err)
		return {
			events: [],
			opportunities: [],
			resources: []
		}
	}
}

export async function fetchJoinedNotifications(collegeId:number, userId:string) {
	let users = await prisma.joined.findMany({
			where: {
				emailNotification: true,
				collegeId: collegeId,
				NOT:{
					userId: userId
				}
			},
			select:{
				user:{
					select:{
						name: true,
						email: true,
						id: true
					}
				},
				college:{
					select:{
						name: true,
						id: true
					}
				}
			}
		})
	return users
}