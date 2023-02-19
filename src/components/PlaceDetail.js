import Link from 'next/link'
import {
	useToast,
	Heading,
	Card,
	CardHeader,
	CardBody,
	Stack,
	StackDivider,
	Badge,
	Box,
	Text,
	Flex,
	IconButton,
	Link as TextLink,
} from '@chakra-ui/react'

import {
	CopyIcon,
	ExternalLinkIcon,
} from '@chakra-ui/icons'

const queryResponse = {
	candidates: [
		{
			place_id: 'ChIJzUjxMJYZqwcRv9jrjyKtTNU',
		},
		{
			place_id: 'ChIJJ3II-64ZqwcRskrRirUCGho',
		},
	],
	status: 'OK',
}

const idResponse = {
	html_attributions: [],
	result: {
		business_status: 'OPERATIONAL',
		formatted_address:
			'R. Benjamin Constant, 2597 - Vila Nova, Blumenau - SC, 89035-100, Brazil',
		formatted_phone_number: '(47) 3309-3700',
		name: 'Cooper Vila Nova Blumenau',
		url: 'https://maps.google.com/?cid=3329914037473559904',
		website: 'https://www.cooper.coop.br/',
	},
	status: 'OK',
}

const labels = {
	formatted_phone_number: 'Telefone',
	business_status: 'Condição',
	formatted_address: 'Endereço',
	name: 'Nome',
	url: 'URL no Google',
	website: 'Site próprio',
}

export default function PlaceDetail({ item: rawItem }) {
	function parseFindList(itemObj) {
		const { razao_social, estabelecimento: empresa } =
			itemObj

		if (Object.keys(empresa)?.length) {
			let queryList = [
				`(${empresa.ddd1}) ${empresa.telefone1.replace(
					/(.{4}$)/,
					'-$1'
				)}`,
				...(empresa.ddd2
					? [
							`(${
								empresa.ddd2
							}) ${empresa.telefone2.replace(
								/(.{4}$)/,
								'-$1'
							)}`,
					  ]
					: []),
				`${razao_social} ${empresa.cidade.nome} ${empresa.estado.nome}`,
				`${empresa.tipo_logradouro} ${empresa.logradouro}, ${empresa.numero}, ${empresa.cidade.nome} - ${empresa.estado.nome}`,
			]

			return queryList
		}
	}

	function getPlaces(item) {
		const list = parseFindList(item)

		if (list.length > 0) {
			let detailList = []

			list.map((query) => {
				const candidates = findPlaceId(query)

				if (candidates?.length > 0) {
					candidates.map((item) => {
						detailList.push({ query: query, ...item })
					})
				}
			})

			if (detailList?.length > 0) {
				let placesList = []

				detailList.map((item) => {
					const result = placeDetail(item.place_id)

					if (Object.keys(result)?.length > 0) {
						placesList.push({
							query: item.query,
							place: result,
						})
					}
				})

				if (placesList?.length > 0) {
					return placesList
				}
			}
		}
	}

	function findPlaceId(query) {
		const response = queryResponse

		if (
			response.status === 'OK' &&
			response.candidates?.length > 0
		) {
			return response.candidates
		}
	}

	function placeDetail(placeId) {
		const response = idResponse

		if (
			response.status === 'OK' &&
			Object.keys(response?.result).length > 0
		) {
			// console.log('tem result')
			return response.result
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

	const placesList = getPlaces(rawItem)

	return (
		<>
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

			{placesList?.length > 0 &&
				placesList.map(({ query, place }, key) => (
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
						<CardHeader px="2" pt="2" pb="0">
							<Heading size="xs" color="gray.500"></Heading>
						</CardHeader>
						<CardBody p="2">
							{Object.keys(place)?.length > 0 && (
								<Stack
									divider={<StackDivider />}
									spacing="3"
								>
									{Object.entries(place).map(
										(prop, index) => (
											<Box key={index}>
												<Flex alignItems="center">
													<Box flex="1">
														<Heading
															fontWeight="normal"
															size="xs"
														>
															{labels[prop[0]] || prop[0]}
														</Heading>
														<Text
															noOfLines={1}
															fontWeight="semibold"
														>
															{prop[0] === 'url' ||
															prop[0] === 'website' ? (
																<Link
																	href={prop[1]}
																	passHref
																	legacyBehavior
																>
																	<TextLink
																		color="blue.500"
																		isExternal
																	>
																		{prop[1]}{' '}
																		<ExternalLinkIcon
																			mb="1"
																			ml="1"
																			w="4"
																			h="4"
																		/>
																	</TextLink>
																</Link>
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
														onClick={() =>
															clickCopy(prop[1], prop[0])
														}
													/>
												</Flex>
											</Box>
										)
									)}
								</Stack>
							)}
						</CardBody>
					</Card>
				))}
		</>
	)
}
