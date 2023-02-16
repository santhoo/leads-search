import { useState } from 'react'
import Head from 'next/head'
import {
	Container,
	Box,
	Flex,
	Heading,
	Textarea,
	Button,
	FormControl,
	FormLabel,
	FormHelperText,
	Text,
	Tooltip,
} from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'

import { useDetailContext } from '@/context/DetailProvider'
import ListResults from '@/components/ListResults'
import ItemDetail from '@/components/ItemDetail'

export default function Bulk() {
	const [loading, setLoading] = useState(false)

	const [textareaValue, setTextareaValue] = useState('')
	const [textList, setTextList] = useState([])
	function handleTextList(value) {
		setTextareaValue(value)

		const list = value.split('\n')
		setTextList(list)

		parseSearch(list)
	}

	const [searchList, setSearchList] = useState([])
	function parseSearch(list) {
		// Monta Array com linhas da Textarea
		const valid = list.filter(function (entry) {
			const sanit = entry.trim()
			if (
				sanit !== '' && // Limpa linhas vazias
				sanit.replace(/[^0-9]/g, '').length === 14 // Aceita apenas CNPJs
			) {
				return true
			}
		})

		setSearchList(valid)
	}

	const [resultList, setResultList] = useState([])
	async function handleFetch() {
		if (searchList.length > 0) {
			setLoading(true)

			setResultList([])
			handleOpen.reset()

			searchList.forEach((cnpj, i) => {
				setTimeout(async () => {
					const response = await fetchCnpj(cnpj)
					setResultList((resultList) => [
						...resultList,
						response,
					])

					// Cria log de cada consulta
					let today = new Date()
					console.log(
						'Buscando:',
						cnpj,
						today.getHours() +
							':' +
							today.getMinutes() +
							':' +
							today.getSeconds()
					)

					// Para o Loading se for o último fetch
					i + 1 === searchList.length && setLoading(false)
				}, i * 40000)
			})
		}
	}

	async function fetchCnpj(cnpj) {
		try {
			const response = await fetch(
				`https://publica.cnpj.ws/cnpj/${cnpj}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)

			if (response.status === 200) {
				return await response.json()
			} else {
				return {
					cnpj: cnpj,
					error: 'Erro ao buscar CNPJ',
				}
			}
		} catch (err) {
			// throw new Error(err)
			return {
				cnpj: cnpj,
				error: 'Erro ao buscar CNPJ',
			}
		}
	}

	const handleOpen = useDetailContext()

	return (
		<>
			<Head>
				<title>Busca em Massa de Leads - Santiago</title>
			</Head>

			<Flex direction="row" w="100%" h="100vh" maxH="100vh">
				<Flex
					bg="gray.200"
					flex="0 0 40%"
					w="40%"
					p="8"
					direction="column"
				>
					<Heading fontSize="2xl" mb="2">
						Busca em massa de Leads
					</Heading>
					<FormControl as={Flex} direction="column">
						<FormLabel>Digite um CNPJ por linha</FormLabel>
						<Textarea
							bg="white"
							value={textareaValue}
							resize="none"
							fontSize="sm"
							rows="5"
							placeholder={`__.___.___/____-__\n__.___.___/____-__\n__.___.___/____-__`}
							isDisabled={loading}
							onChange={(e) =>
								handleTextList(e.target.value)
							}
						/>
						<FormHelperText
							as={Flex}
							fontWeight="semibold"
							color="gray.500"
						>
							<Text>Linhas: {textList.length} |</Text>

							<Tooltip
								label={`${
									textList.length - searchList.length
								} linhas não são CNPJ válidos`}
								isDisabled={
									textList.length === searchList.length
								}
							>
								<Text
									ml="1"
									color={
										textList.length !== searchList.length &&
										'red.500'
									}
								>
									CNPJs: {searchList.length}
								</Text>
							</Tooltip>
						</FormHelperText>
						<Button
							mr="0"
							ml="auto"
							colorScheme="blue"
							size="sm"
							isLoading={loading}
							onClick={() => handleFetch()}
						>
							Buscar todos
						</Button>
					</FormControl>

					<ListResults
						loading={loading}
						list={resultList}
					/>
				</Flex>

				<Box
					bg="gray.50"
					flex="1"
					h="100%"
					position="relative"
				>
					<Flex
						position="absolute"
						left="0"
						right="0"
						top="0"
						bottom="0"
						overflowY="auto"
						p="8"
					>
						{handleOpen.active?.empty ? (
							<Flex
								flex="1"
								justifyContent="center"
								alignItems="center"
								alignSelf="center"
								textAlign="center"
								direction="column"
							>
								<Search2Icon
									boxSize={12}
									mb="6"
									color="gray.300"
								/>
								<Heading size="md" color="gray.400">
									{handleOpen.active.empty}
								</Heading>
							</Flex>
						) : (
							<Container>
								<ItemDetail item={handleOpen.active} />
							</Container>
						)}
					</Flex>
				</Box>
			</Flex>
		</>
	)
}
