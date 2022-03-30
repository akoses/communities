export const convertName = (name: string) => {
	return name.replace(/\s+/g, '-').replace(/,/g, '').toLowerCase()
}

