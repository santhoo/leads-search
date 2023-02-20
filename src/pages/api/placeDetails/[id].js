const placeKey = process.env.PLACEKEY

export default async function GetPlaceDetails(req, res) {
	const {
		query: { id },
	} = req

	if (id) {
		const response = await fetch(
			`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=name,website,formatted_phone_number,url,formatted_address,business_status&key=${placeKey}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)

		const data = await response.json()

		return res.status(200).json({ data })
	}
}
