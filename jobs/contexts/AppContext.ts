import React from 'react';
const AppContext = React.createContext<{
		collegeData: Map<string, any>;
		setEdit: (data:any) => void;
		editableData: any;
}>({
	collegeData: new Map(),
	setEdit: () => {},
	editableData: {}
});
export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;
export default AppContext;