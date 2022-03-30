
import {pool} from "../../src/lib/pool";

export default async function handler(req:any, res:any) {

	if (req.method === 'GET') {
		try {
			const result = await pool.query(`SELECT * FROM colleges`);
			res.status(200).json(result.rows);
		} catch (e) {
			res.status(500).json({error: e});
		}
	}
  else if (req.method === 'PUT') {
	const client = await pool.connect();
	try {
		await client.query(`UPDATE colleges SET name=$1, description=$2, logo=$3, banner=$4  WHERE id=$5`, 
			[req.body.name, 
			req.body.description,
			req.body.logo,
			req.body.banner,
			req.body.id]);
		}
	catch (err) {
		return res.status(500).send(err);
	}
		return res.status(200).send('ok');
  }
 
}