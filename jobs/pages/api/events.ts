import {pool} from "../../src/lib/pool";
import { deleteEventFromDB } from "../../src/lib/delete";
export default async function handler(req:any, res:any) {
	
  if (req.method === 'POST') {
	const client = await pool.connect();
	try {
		await client.query(`INSERT INTO events (
			name, organization, description, location, event_link, start_date, end_date, org_logo, college_id
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		`, [req.body.name, 
			req.body.organization, 
			req.body.description, 
			req.body.location,
			req.body.event_link,
			req.body.start_date,
			req.body.end_date,
			req.body.org_logo,
			req.body.college_id]);
		}
	catch (err) {
		return res.status(500).send(err);
	}
	return res.status(200).send('ok');

  } else if (req.method === 'PUT'){
	const client = await pool.connect();
	console.log(req.body);
	try {
		await client.query(`UPDATE events SET
			name = $1, organization = $2, description = $3, location = $4, event_link = $5, start_date = $6, end_date = $7, org_logo = $8 WHERE id = $9`, [
			req.body.name, 
			req.body.organization, 
			req.body.description, 
			req.body.location,
			req.body.event_link,
			req.body.start_date,
			req.body.end_date,
			req.body.org_logo,
			req.body.id]);
		}
	catch (err) {
		console.error(err);
		return res.status(500).send(err);
	}
	return res.status(200).send('ok');

  }
  
  else if (req.method === 'DELETE') {
	  
	try {
		
		await deleteEventFromDB(req.query.id);
		}
	catch (err) {
		return res.status(500).send(err);
	}
	return res.status(200).send('ok');
  }

}