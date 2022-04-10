import {pool} from './pool';


export const deleteOppFromDB = async (id:number) => {
	  const client = await pool.connect()
  try {
	await client.query('DELETE FROM opportunities WHERE id = $1', [id])
  } catch (err) {
	console.error(err)
  } finally {
	client.release()
  }
}

export const deleteEventFromDB = async (id:number) => {
	  const client = await pool.connect()
  try {
	await client.query('DELETE FROM events WHERE id = $1', [id])
  } catch (err) {
	console.error(err)
  } finally {
	client.release()
  }
}

export const deleteResourceFromDB = async (id:number) => {
	  const client = await pool.connect()
  try {
	await client.query('DELETE FROM resources WHERE id = $1', [id])
  } catch (err) {
	console.error(err)
  } finally {
	client.release()
  }
}