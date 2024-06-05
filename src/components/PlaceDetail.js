import { useState, useEffect } from 'react'
import Link from 'next/link'
import { stringSimilarity } from 'string-similarity-js'
import {
	useToast,
	Heading,
	Card,
	CardBody,
	Stack,
	StackDivider,
	Badge,
	Box,
	Text,
	Flex,
	IconButton,
	Link as TextLink,
	Spinner,
} from '@chakra-ui/react'

import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons'

import { fetchGet } from '@/util/functions'

const labels = {
	formatted_phone_number: 'Telefone',
	business_status: 'Condição',
	formatted_address: 'Endereço',
	name: 'Nome',
	url: 'URL no Google Maps',
	website: 'Site próprio',
	rank: 'Qualidade',
}

export default function PlaceDetail({ item: rawItem }) {
	const [loading, setLoading] = useState(false)

	function parseFindList(itemObj) {
		const { razao_social, estabelecimento: empresa } = itemObj

		if (Object.keys(empresa)?.length) {
			let queryList = [
				{
					label: `Telefone primário (${
						empresa.ddd1
					}) ${empresa.telefone1.replace(/(.{4}$)/, '-$1')}`,
					query: `${empresa.ddd1}${empresa.telefone1}`,
				},
				...(empresa.ddd2
					? [
							{
								label: `Telefone secundário (${
									empresa.ddd2
								}) ${empresa.telefone2.replace(/(.{4}$)/, '-$1')}`,
								query: `${empresa.ddd2}${empresa.telefone2}`,
							},
					  ]
					: []),
				...(empresa.nome_fantasia
					? [
							{
								label: 'Nome Fantasia e Cidade',
								query: `${empresa.nome_fantasia} ${empresa.cidade.nome} ${empresa.estado.nome}`,
							},
					  ]
					: [
							{
								label: 'Razão Social e Cidade',
								query: `${razao_social} ${empresa.cidade.nome} ${empresa.estado.nome}`,
							},
					  ]),
				{
					label: 'Endereço e Cidade',
					query: `${empresa.tipo_logradouro} ${empresa.logradouro}, ${empresa.numero}, ${empresa.cidade.nome} - ${empresa.estado.nome}`,
				},
			]

			// Remove duplicates (telefone)
			const queryFiltered = queryList.filter(
				(obj, index) =>
					queryList.findIndex((item) => item.query === obj.query) === index
			)

			return queryFiltered
		}
	}

	async function parseCandidates(list) {
		if (list.length > 0) {
			let candidatesList = []

			await Promise.all(
				list.map(async (item) => {
					const candidates = await findPlaceId(item.query)

					if (candidates?.length > 0) {
						// Get first 3
						const slicedCandidate = candidates.slice(0, 3)

						slicedCandidate.map((candidate) => {
							candidate.business_status &&
								candidatesList.push({
									query: item.label,
									...candidate,
								})
						})
					}
				})
			)

			// Remove place_id duplicados
			const candidatesFiltered = candidatesList.filter(
				(obj, index) =>
					candidatesList.findIndex((item) => item.place_id === obj.place_id) ===
					index
			)

			if (candidatesFiltered.length > 0) {
				return candidatesFiltered
			}
		}
	}

	async function getPlaces(item) {
		const list = parseFindList(item)

		if (list.length > 0) {
			const placesId = await parseCandidates(list)

			if (placesId?.length > 0) {
				let placesList = []

				await Promise.all(
					placesId.map(async (item) => {
						const result = await placeDetail(item.place_id)

						if (Object.keys(result)?.length > 0) {
							placesList.push({
								query: item.query,
								place: result,
							})
						}
					})
				)

				if (placesList?.length > 0) {
					return placesList
				}
			}
		}
	}

	async function findPlaceId(query) {
		try {
			const { data } = await fetchGet('placeId', encodeURI(query))

			if (data.status === 'OK' && data.candidates?.length > 0) {
				return data.candidates
			}
		} catch (err) {
			console.error(err)
		}
	}

	async function placeDetail(placeId) {
		try {
			const { data } = await fetchGet('placeDetails', placeId)

			if (data.status === 'OK' && Object.keys(data?.result).length > 0) {
				const {
					razao_social,
					estabelecimento: { nome_fantasia },
				} = rawItem

				// Rank Place quality
				let rating = 0

				// Place Name <> Nome CNPJ
				rating =
					rating +
					stringSimilarity(nome_fantasia || razao_social, data.result.name)

				// Place Website <> Nome CNPJ
				rating = data.result.website
					? rating +
					  stringSimilarity(nome_fantasia || razao_social, data.result.website)
					: rating

				// If name is 'contabilidade'
				rating = rating - stringSimilarity('contabil', data.result.name)

				return {
					rank: rating,
					...data.result,
				}
			}
		} catch (err) {
			console.error(err)
		}
	}

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

	const [resultList, setResultList] = useState([])

	useEffect(() => {
		setResultList([])

		async function renderFetch() {
			setLoading(true)
			const results = await getPlaces(rawItem)

			setLoading(false)

			if (!results?.length > 0) return

			const sortedResults = results.sort((a, b) =>
				a.place.rank > b.place.rank ? -1 : 1
			)

			setResultList(sortedResults)
		}

		rawItem.estabelecimento.situacao_cadastral === 'Ativa' && renderFetch()
	}, [rawItem])

	return (
		<Flex direction="column" pb="16">
			<Heading
				textTransform="uppercase"
				size="xs"
				mt="8"
				mb="4"
				py="1"
				bg="yellow.100"
				color="yellow.600"
				textAlign="center"
			>
				Endereços encontrados
			</Heading>

			{resultList?.length > 0 ? (
				resultList.map(({ query, place }, key) => (
					<Card key={key} mb="4">
						<Badge
							as={Flex}
							display="flex"
							fontWeight="normal"
							colorScheme="yellow"
							px="2"
							py="1"
							maxWidth="100%"
							direction="row"
							whiteSpace="normal"
						>
							<Text>{key + 1} - Resultados para:</Text>{' '}
							<Text
								display="block"
								noOfLines="1"
								ml="1"
								flex="1"
								fontWeight="bold"
							>
								{query}
							</Text>
						</Badge>
						<CardBody p="2">
							{Object.keys(place)?.length > 0 && (
								<Stack divider={<StackDivider />} spacing="3">
									{Object.entries(place).map((prop, index) => (
										<Box key={index}>
											<Flex alignItems="center">
												<Box flex="1">
													<Heading fontWeight="normal" size="xs">
														{labels[prop[0]] || prop[0]}
													</Heading>
													<Text noOfLines={1} fontWeight="semibold">
														{prop[0] === 'url' || prop[0] === 'website' ? (
															<Link href={prop[1]} passHref legacyBehavior>
																<TextLink color="blue.500" isExternal>
																	{prop[1]}{' '}
																	<ExternalLinkIcon mb="1" ml="1" w="4" h="4" />
																</TextLink>
															</Link>
														) : prop[0] === 'rank' ? (
															prop[1]
														) : (
															prop[1]
														)}
													</Text>
												</Box>
												<IconButton
													colorScheme="blue"
													_hover={{ bg: 'blue.100' }}
													variant="ghost"
													ml="2"
													icon={<CopyIcon />}
													onClick={() => clickCopy(prop[1], prop[0])}
												/>
											</Flex>
										</Box>
									))}
								</Stack>
							)}
						</CardBody>
					</Card>
				))
			) : (
				<>
					{loading ? (
						<Spinner color="yellow.600" thickness="3px" mx="auto" />
					) : (
						<Heading color="gray.400" size="sm" textAlign="center">
							Nenhuma informação encontrada
						</Heading>
					)}
				</>
			)}
		</Flex>
	)
}
