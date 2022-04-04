import prisma from '../../prisma';

export default async function handler(req:any, res:any) {
  if (req.method === 'POST') {
	
	try {
		await prisma.resources.create({
			data: {
				customTitle: req.body.custom_title,
				customDescription: req.body.custom_description,
				url: req.body.url,
				collegeId: req.body.college_id,
				userId: req.body.user_id,
			}
		});
		}
	catch (err) {
		return res.status(500).send(err);
	}
		return res.status(200).send('ok');
  }
  	else if (req.method === 'PUT'){

	try {
		await prisma.resources.update({
			where: {
				id: req.body.id
			}, data: {
				customTitle: req.body.custom_title,
				customDescription: req.body.custom_description,
				url: req.body.url,
			}
		})
		}
	catch (err) {
		console.error(err);
		return res.status(500).send(err);
	}
		return res.status(200).send('ok');
  }
	  
  else if (req.method === 'DELETE') {
	try {
		await prisma.resources.delete({
			where: {
				id: Number(req.query.id)
			}
		})
		}
	catch (err) {
		return res.status(500).send(err);
	}
	return res.status(200).send('ok');
  }
}