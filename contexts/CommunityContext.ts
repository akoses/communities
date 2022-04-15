import React from 'react';
const CommunityContext = React.createContext<{
		
		editor:boolean;
		
}>({
	editor:false
});

export const CommunityProvider = CommunityContext.Provider;
export const CommunityConsumer = CommunityContext.Consumer;
export default CommunityContext;