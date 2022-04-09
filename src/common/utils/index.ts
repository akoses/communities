export const convertName = (name: string) => {
	return name.replace(/\s\s+/g, ' ').replace(/\s+/g, '-').replace(/,/g, '').toLowerCase()
}

