import React, {useEffect, useState, useContext} from 'react'
import Opportunity from "../src/common/create/Opportunity";
import Event from "../src/common/create/Event";
import Resource from "../src/common/create/Resource";
import AppContext from '../contexts/AppContext'
import Head from 'next/head'

interface EditPostProps {

}

const EditPost:React.FC<EditPostProps> = () => {
	const context = useContext(AppContext);
	const [selected] = useState(context.editableData?.type);
		return (
			<div>
				<Head>
					<title>Edit Post</title>
				</Head>
		{selected=== "OPPORTUNITY" && <Opportunity opportunity={context.editableData}/>}
		{selected=== "EVENT" && <Event event={context.editableData} />}    
		{selected=== "RESOURCE" && <Resource resource={context.editableData}/>}
		</div>
		)
}

export default EditPost;