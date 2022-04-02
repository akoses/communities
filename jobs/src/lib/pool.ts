import {Pool} from 'pg';


export const pool = new Pool(
	{
		user: 'akose_jobs',
		host: 'localhost',
		database: 'akose_jobs',
		password: 'tXC8FxcWxcbxHf',
		port: 5432,
	}
)
