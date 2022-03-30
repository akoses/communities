import {pool} from "../../src/lib/pool";
import { deleteEventFromDB } from "../../src/lib/delete";
export default async function handler(req:any, res:any) {
	
  if (req.method === 'POST') {
	const client = await pool.connect();
	try {
		await client.query(`INSERT INTO events (
			name, organization, description, location, event_link, date, org_logo, college_id
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		`, [req.body.name, 
			req.body.organization, 
			req.body.description, 
			req.body.location,
			req.body.event_link,
			req.body.date,
			req.body.org_logo,
			req.body.college_id]);
		}
	catch (err) {
		return res.status(500).send(err);
	}
	return res.status(200).send('ok');
  } else if (req.method === 'DELETE') {
	  
	try {
		
		await deleteEventFromDB(req.query.id);
		}
	catch (err) {
		return res.status(500).send(err);
	}
	return res.status(200).send('ok');
  }

}