import {pool} from "../../src/lib/pool";
import {deleteOppFromDB} from "../../src/lib/delete";

export default async function handler(req:any, res:any) {
	
  if (req.method === 'POST') {
	const client = await pool.connect();
	try {
		await client.query(`INSERT INTO opportunities (
			name, organization, college_id, location, workstyle, disciplines, description, org_logo, apply_link
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		`, [req.body.name, 
			req.body.organization, 
			req.body.college_id, 
			req.body.location,
			req.body.workstyle,
			req.body.disciplines,
			req.body.description,
			req.body.org_logo,
			req.body.apply_link]);
		}
	catch (err) {
		return res.status(500).send(err);
	}
	return res.status(200).send('ok');
  }

  else if (req.method === 'PUT'){
	const client = await pool.connect();
	try {
		await client.query(`UPDATE opportunities SET
			name = $1, organization = $2, location = $3, workstyle = $4, disciplines = $5, description = $6, org_logo = $7, apply_link = $8 WHERE id = $9`, [
			req.body.name, 
			req.body.organization, 
			req.body.location,
			req.body.workstyle,
			req.body.disciplines,
			req.body.description,
			req.body.org_logo,
			req.body.apply_link,
			req.body.id]);
		}
	catch (err) {
		return res.status(500).send(err);
	}
	return res.status(200).send('ok');
  }

  else if (req.method === 'DELETE') {
	  
	try {
		await deleteOppFromDB(req.query.id);
		}
	catch (err) {
		return res.status(500).send(err);
	}
	return res.status(200).send('ok');
  }
}