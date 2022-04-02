import {pool} from "../../src/lib/pool";
import { deleteResourceFromDB } from "../../src/lib/delete";

export default async function handler(req:any, res:any) {
  if (req.method === 'POST') {
	const client = await pool.connect();
	try {
		await client.query(`INSERT INTO resources (
			url, custom_title, custom_description, college_id
		) VALUES ($1, $2, $3, $4)
		`, [req.body.url, 
			req.body.custom_title, 
			req.body.custom_description, 
			req.body.college_id]);
		}
	catch (err) {
		return res.status(500).send(err);
	}
		return res.status(200).send('ok');
  }
  	else if (req.method === 'PUT'){
	const client = await pool.connect();
	
	try {
		await client.query(`UPDATE resources SET
			url = $1, custom_title = $2, custom_description = $3 WHERE id = $4`, [
			req.body.url, 
			req.body.custom_title, 
			req.body.custom_description,
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
		await deleteResourceFromDB(req.query.id);
		}
	catch (err) {
		return res.status(500).send(err);
	}
	return res.status(200).send('ok');
  }
}