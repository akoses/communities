import {NextApiResponse, NextApiRequest} from "next";
import S3Client from "../../src/lib/S3";
import {PutObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect';
import fs from 'fs';
import {getSession} from 'next-auth/react';

const handler = nextConnect();

handler.use(middleware);

export const config = {
  api: {
    bodyParser: false
  }
}

interface NextApiRequestWithFiles extends NextApiRequest {
	  files: any
}

function getUrlFromBucket(s3Bucket:any,fileName:string):string {
	return `https://${s3Bucket}.s3.ca-central-1.amazonaws.com/${fileName}`;
    
};

handler.post((req:NextApiRequestWithFiles, res:NextApiResponse) => {
		getSession({req}).then(session => {
			if (!session)
				res.status(401).send('Unauthorized');
				let file = req.files.file;
				const fileName = uuidv4();
				const func = async () => {
				const command = new PutObjectCommand(
				{
					Bucket: process.env.BUCKET_NAME || '',
					Key: process.env.S3_KEY_PREFIX + fileName,
					Body: fs.createReadStream(file.filepath),
				}
			)
			await S3Client.send(command);
			let link = getUrlFromBucket(process.env.BUCKET_NAME, process.env.S3_KEY_PREFIX + fileName);
			res.status(200).json({
				location: link
			});
		}
		func()
		});
		
})

handler.delete((req:NextApiRequest, res:NextApiResponse) => {
	getSession({req}).then(session => {
		if (!session)
			res.status(401).send('Unauthorized');
		const func = async () => {
		const command = new DeleteObjectCommand(
			{
				Bucket: process.env.BUCKET_NAME || '',
				Key: req.query.keyName as string,
			}
		)
		await S3Client.send(command)
		res.status(200).send("ok");
	}
	func()
		
	})
	
})

export default handler