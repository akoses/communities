
import {pool} from './pool';
import prisma from '../../prisma';
import {getSession } from "next-auth/react";
export async function fetchColleges() {
  try {
	const res = await prisma.colleges.findMany()
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
		}
	})
	return res
  } catch (err) {
	console.error(err)
  } finally {
  }
}

export async function fetchCollegesNameID() {
	  const client = await pool.connect()
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
				contains: collegeName,
				mode: 'insensitive'
			}
		},

	})
	return res
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
		const res = await prisma.joined.count({
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

