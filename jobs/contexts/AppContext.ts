import React from 'react';
const AppContext = React.createContext<{
		collegeData: any[];
		setEdit: (data:any) => void;
		editableData: any;
}>({
	collegeData: [],
	setEdit: () => {},
	editableData: {}
});
export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;
export default AppContext;