import ejs from 'ejs';
import transport from './transport';
import axios from 'axios';

interface Information {
	name?: string;
	college: string;
	email?: string;
	unsubscribeLink: string;
}

export interface ResourceInformation extends Information {
	resourceLink: string;
	resourceImage: string;
	resourceTitle: string;
	resourceDescription: string;
	resourceHostname: string;
}

export interface OpportunityInformation extends Information {
	opportunityLink: string;
	opportunityImage: string;
	opportunityTitle: string;
	opportunityOrganization: string;
	opportunityLocation: string;
	opportunityWorkStyle: string;
}

export interface EventInformation extends Information {
	eventLink: string;
	eventImage: string;
	eventTitle: string;
	eventDate: string;
	eventLocation: string;
	eventOrganization: string
}

export type templateType = 'Opportunity' | 'Resource' | 'Event';

async function SendMail(information: ResourceInformation | OpportunityInformation | EventInformation, type:templateType, htmlString:string) {
		

		if (!information.email) {
			return
		}
		
		const html = await ejs.render(htmlString, information);
		let options = {
			from: 'Team Akose <info@akose.ca>',
			replyTo: 'info@akose.ca',
			to: information.email,
			subject: `New ${type} Added to ${information.college}`,
			html: html,
		}

		transport.sendMail(options, (err, info) => {
			if (err) {
				//console.error(err);
				return;
			}
			
		})
}

const sendMails = async (informationArr: (ResourceInformation | OpportunityInformation | EventInformation)[], type:templateType) => {
	let resHTML = await axios.get(`https://akosejobs.s3.ca-central-1.amazonaws.com/${type}.html`)
	let filteredMail = [...new Map(informationArr.map(item =>
  		[item.email, item])).values()];

		filteredMail.forEach(async information => {
			await SendMail(information, type, resHTML.data)
		})
	
}
export default sendMails;
