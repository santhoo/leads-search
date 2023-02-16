import { createContext, useContext, useState } from 'react'

const DetailContext = createContext()

export function DetailProvider({ children }) {
	const emptyState = {
		empty:
			'Realize a busca para visualizar os detalhes do CNPJ.',
	}
	const [open, setOpen] = useState(emptyState)

	const handleOpen = {
		active: open,
		setActive: (obj) => setOpen(obj),
		reset: () => setOpen(emptyState),
	}

	return (
		<DetailContext.Provider value={handleOpen}>
			{children}
		</DetailContext.Provider>
	)
}

export function useDetailContext() {
	return useContext(DetailContext)
}
