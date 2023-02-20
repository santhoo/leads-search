import { useEffect, useRef } from 'react'

function useInterval(callback, delay) {
	const savedCallback = useRef()

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback
	}, [callback])

	// Set up the interval.
	useEffect(() => {
		function tick() {
			savedCallback.current()
		}
		if (delay !== null) {
			let id = setInterval(tick, delay)
			return () => clearInterval(id)
		}
	}, [delay])
}

async function fetchGet(endpoint, query) {
	const url = process.env.NEXT_PUBLIC_VERCEL_URL

	const response = await fetch(
		`${url}/${endpoint}/${query}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)

	const data = await response.json()

	return data
}

export { useInterval, fetchGet }
