import { useState } from 'react'
import Head from 'next/head'
import {
	Container,
	Flex,
	Box,
	Heading,
	Input,
	Button,
	FormControl,
	FormLabel,
	FormHelperText,
} from '@chakra-ui/react'

import ListItems from '@/components/ListItems'

export default function Home() {
	const [loading, setLoading] = useState(false)

	const [current, setCurrent] = useState(null)
	const [newCnpj, setNewCnpj] = useState('')

	async function searchLead(cnpj) {
		const cnpjSanit = cnpj.trim().replace(/[^0-9]/g, '')

		setCurrent(null)
		setLoading(true)
		try {
			const res = await fetch(
				`https://publica.cnpj.ws/cnpj/${cnpjSanit}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)

			if (res.status === 200) {
				const data = await res.json()
				setCurrent(data)
				setLoading(false)
				console.log('CURRENT', current)
			}
		} catch (err) {
			console.log(err)
			setLoading(false)
		}
	}

	return (
		<>
			<Head>
				<title>Leads Search - Santiago</title>
			</Head>
			<Container bg="white" as="main" pt="8" pb="16">
				<Heading mb="8">Buscar Leads</Heading>

				<FormControl>
					<Flex alignItems="flex-end">
						<Box flex="1">
							<FormLabel>CNPJ</FormLabel>
							<Input
								variant="filled"
								placeholder="__.___.___/____-__"
								onChange={(e) => setNewCnpj(e.target.value)}
							/>
						</Box>
						<Button
							ml="2"
							colorScheme="blue"
							isLoading={loading}
							onClick={() => searchLead(newCnpj)}
						>
							Buscar
						</Button>
					</Flex>
					<FormHelperText>
						Digite o CNPJ da empresa que deseja buscar
					</FormHelperText>
				</FormControl>

				{current && <ListItems list={current} />}
			</Container>
		</>
	)
}
