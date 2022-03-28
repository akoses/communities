
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

export async function fetchJobs(id:number) {
	  const client = await pool.connect()
  try {
	const res = await client.query('SELECT * FROM jobs WHERE id=$1', [id])
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

const toTitleCase = (phrase:string) => {
  return phrase
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

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

