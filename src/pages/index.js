import { useState } from 'react'
import Head from 'next/head'
import {
	useToast,
	Container,
	Flex,
	Box,
	Heading,
	Text,
	Divider,
	Input,
	Button,
	IconButton,
	FormControl,
	FormLabel,
	FormHelperText,
} from '@chakra-ui/react'

import { CopyIcon } from '@chakra-ui/icons'

function Consulta({ data }) {
	const toast = useToast()
	function clickCopy(text, label) {
		navigator.clipboard.writeText(text)
		toast({
			title: `${label} copiado!`,
			isClosable: true,
			duration: 1500,
			position: 'top-right',
		})
	}

	const { razao_social, estabelecimento: empresa } = data

	const parse = [
		{
			label: 'Situação Cadastral',
			value: empresa.situacao_cadastral,
			bg:
				empresa.situacao_cadastral !== 'Ativa'
					? 'red.100'
					: 'green.100',
		},
		{
			label: 'Razão Social',
			value: razao_social,
		},
		{
			label: 'Nome Fantasia',
			value: empresa.nome_fantasia,
		},
		{
			label: 'Cidade - UF',
			value: `${empresa.cidade.nome} - ${empresa.estado.sigla}`,
		},
		{
			label: 'E-mail',
			value: empresa.email,
		},
		{
			label: 'Telefones',
			value: `(${empresa.ddd1}) ${empresa.telefone1.replace(
				/(.{4}$)/,
				'-$1'
			)} ${
				data.estabelecimento.ddd2 !== null
					? ` / (${
							data.estabelecimento.ddd2
					  }) ${data.estabelecimento.telefone2.replace(
							/(.{4}$)/,
							'-$1'
					  )}`
					: ''
			}`,
		},
		{
			label: 'Endereço',
			value: `${empresa.tipo_logradouro} ${empresa.logradouro}, ${empresa.numero}, ${empresa.cidade.nome}`,
		},
	]

	return (
		<>
			<Divider my="8" borderColor="gray.400" />

			<Flex direction="column">
				{parse &&
					parse.map((item) => (
						<Flex
							direction="row"
							alignItems="center"
							bg={item.bg ? item.bg : 'gray.100'}
							w="100%"
							p="2"
							mb="4"
							borderRadius="md"
						>
							<Box flex="1">
								<Heading fontWeight="normal" size="xs">
									{item.label}
								</Heading>
								<Text fontWeight="semibold">
									{item.value}
								</Text>
							</Box>
							<IconButton
								colorScheme="blue"
								_hover={{ bg: 'blue.100' }}
								variant="ghost"
								ml="2"
								icon={<CopyIcon />}
								onClick={() =>
									clickCopy(item.value, item.label)
								}
							/>
						</Flex>
					))}
			</Flex>
		</>
	)
}

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

				{current && <Consulta data={current} />}
			</Container>
		</>
	)
}
