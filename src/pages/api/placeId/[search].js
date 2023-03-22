const placeKey = process.env.PLACEKEY

export default async function GetPlaceId(req, res) {
	const {
		query: { search },
	} = req

	if (search) {
		const sanitizePhone = search.replace(/[^\d]+/g, '')

		const endpoint =
			sanitizePhone.length > 8
				? `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=%2B55${sanitizePhone}&inputtype=phonenumber&fields=place_id,name,business_status&key=${placeKey}`
				: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${search}&inputtype=textquery&fields=place_id,name,business_status&key=${placeKey}`

		const response = await fetch(endpoint, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		const data = await response.json()
		console.log('API placeId:', search, data)

		return res.status(200).json({ data })
	}
}
