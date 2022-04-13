import React, {useEffect, useState} from 'react'
import NavigationLT from './NavigationLT'
import NavigationGT from './NavigationGT'

interface NavigationProps {

}

const Navigation: React.FC<NavigationProps> = ({
}) => {
	const [size, setSize] = useState<number>(0)
	useEffect(() => {
		setSize(window.innerWidth)
		window.addEventListener('resize', () => {
			setSize(window.innerWidth)
		})
	}, [])
		return (<>
			{size > 425 ? <NavigationGT /> : <NavigationLT />}
		</>);
}
export default Navigation