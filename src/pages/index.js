import { useState } from 'react'
import Head from 'next/head'
import {
	Container,
	Flex,
	Box,
	Heading,
	Text,
	Divider,
	Input,
	Button,
	FormControl,
	FormLabel,
	FormHelperText,
} from '@chakra-ui/react'

export default function Home() {
	const [current, setCurrent] = useState(null)
	const [newCnpj, setNewCnpj] = useState('')

	async function searchLead(cnpj) {
		const cnpjSanit = cnpj.trim().replace(/[^0-9]/g, '')

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

				console.log('CURRENT', current)
			}
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<>
			<Head>
				<title>Leads Search - Santiago</title>
			</Head>
			<Container bg="white" as="main" pt="16">
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
							onClick={() => searchLead(newCnpj)}
						>
							Buscar
						</Button>
					</Flex>
					<FormHelperText>
						Digite o CNPJ da empresa que deseja buscar
					</FormHelperText>
				</FormControl>

				{current && (
					<>
						<Divider my="8" borderColor="gray.400" />

						<Flex direction="column">
							<Box
								bg={
									current.estabelecimento
										.situacao_cadastral !== 'Ativa'
										? 'red.100'
										: 'green.100'
								}
								w="100%"
								p="2"
								mb="4"
							>
								<Heading fontWeight="normal" size="xs">
									Situação Cadastral
								</Heading>
								<Text fontWeight="semibold">
									{
										current.estabelecimento
											.situacao_cadastral
									}
								</Text>
							</Box>

							<Box bg="gray.100" w="100%" p="2" mb="4">
								<Heading fontWeight="normal" size="xs">
									Razão Social
								</Heading>
								<Text fontWeight="semibold">
									{current.razao_social}
								</Text>
							</Box>

							<Box bg="gray.100" w="100%" p="2" mb="4">
								<Heading fontWeight="normal" size="xs">
									Nome Fantasia
								</Heading>
								<Text fontWeight="semibold">
									{current.estabelecimento.nome_fantasia}
								</Text>
							</Box>

							<Box bg="gray.100" w="100%" p="2" mb="4">
								<Heading fontWeight="normal" size="xs">
									Cidade - UF
								</Heading>
								<Text fontWeight="semibold">
									{`${current.estabelecimento.cidade.nome} - ${current.estabelecimento.estado.sigla}`}
								</Text>
							</Box>

							<Box bg="gray.100" w="100%" p="2" mb="4">
								<Heading fontWeight="normal" size="xs">
									E-mail
								</Heading>
								<Text fontWeight="semibold">
									{current.estabelecimento.email}
								</Text>
							</Box>

							<Box bg="gray.100" w="100%" p="2" mb="4">
								<Heading fontWeight="normal" size="xs">
									Telefones
								</Heading>
								<Text fontWeight="semibold">
									{`(${
										current.estabelecimento.ddd1
									}) ${current.estabelecimento.telefone1.replace(
										/(.{4}$)/,
										'-$1'
									)}`}
									{current.estabelecimento.ddd2 !== null &&
										`(${
											current.estabelecimento.ddd2
										}) ${current.estabelecimento.telefone2.replace(
											/(.{4}$)/,
											'-$1'
										)}`}
								</Text>
							</Box>

							<Box bg="gray.100" w="100%" p="2" mb="4">
								<Heading fontWeight="normal" size="xs">
									Endereço
								</Heading>
								<Text fontWeight="semibold">
									{`${current.estabelecimento.tipo_logradouro} ${current.estabelecimento.logradouro}, ${current.estabelecimento.numero}, ${current.estabelecimento.cidade.nome}`}
								</Text>
							</Box>
						</Flex>
					</>
				)}
			</Container>
		</>
	)
}
