import { NextApiResponse, NextApiRequest } from "next";
import { getLinkPreview} from "link-preview-js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		try {
			const preview = await getLinkPreview(req.query.url as string);
			console.log(preview);
			return res.status(200).json(preview);
		}
		catch (err) {
			return res.status(500).send(err);
		}
	}

}