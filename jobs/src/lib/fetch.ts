
import {pool} from './pool';

export async function fetchColleges() {
	  const client = await pool.connect()
  try {
	const res = await client.query('SELECT * FROM colleges')
	return res.rows
  } catch (err) {
	console.error(err)
  } finally {
	client.release()
  }
}

export async function fetchData(id: number) {
	const data: any = {};
	[data.opportunities, data.events, data.resources] = await Promise.all([
	fetchOpportunities(id),
	fetchEvents(id),
	fetchResources(id)
	]);

	return data;
}

async function fetchOpportunities(id:number) {
	  const client = await pool.connect()
  try {
	const res = await client.query('SELECT id, name, organization, location, workstyle, disciplines, description, org_logo, apply_link FROM opportunities WHERE college_id=$1', [id])
	return res.rows
  } catch (err) {
	console.error(err)
  } finally {
	client.release()
  }
}


async function fetchEvents(id:number) {
	  const client = await pool.connect()
  try {
	const res = await client.query('SELECT id, name, organization, description, location, event_link, start_date, end_date, org_logo FROM events WHERE college_id=$1', [id])
	return res.rows
  } catch (err) {
	console.error(err)
  } finally {
	client.release()
  }
}

async function fetchResources(id:number) {
	  const client = await pool.connect()
  try {
	const res = await client.query('SELECT id, url, custom_title, custom_description FROM resources WHERE college_id=$1', [id])
	return res.rows
  } catch (err) {
	console.error(err)
  } finally {
	client.release()
  }
}

export async function fetchCollegesNameID() {
	  const client = await pool.connect()
  try {
	const res = await client.query('SELECT id, name FROM colleges')
	return res.rows
  } catch (err) {
	console.error(err)
  } finally {
	client.release()
  }
}


export async function fetchCollege(name:string) {

	//@ts-ignore
	let collegeName = name.replace(/-/g, ' ');
	  const client = await pool.connect()
	  
  try {
	const res = await client.query('SELECT * FROM colleges WHERE LOWER(name)=$1', [collegeName])

	return res.rows[0]
  } catch (err) {
	console.error(err)
  } finally {
	client.release()
  }
}


export async function fetchCollegeName(id:string) {

	//@ts-ignore
	  const client = await pool.connect()
	  
  try {
	const res = await client.query('SELECT name FROM colleges WHERE id=$1', [Number(id)])

	return res.rows[0]
  } catch (err) {
	console.error(err)
  } finally {
	client.release()
  }
}

