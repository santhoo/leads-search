import { CopyIcon } from '@chakra-ui/icons'
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
} from '@chakra-ui/react'

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

export default function PlaceDetail({ item: rawItem }) {
	function parseFindList(itemObj) {
		const { razao_social, estabelecimento: empresa } =
			itemObj

		if (Object.keys(empresa)?.length) {
			let queryList = [
				`${razao_social} ${empresa.cidade.nome} ${empresa.estado.nome}`,
				`${empresa.tipo_logradouro} ${empresa.logradouro}, ${empresa.numero}, ${empresa.cidade.nome} - ${empresa.estado.nome}`,
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
				// console.log('TEM LISTA DETALHE', detailList)
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
					// console.log('TEM PLACES', placesList)
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
						<Badge colorScheme="yellow" px="2" py="1">
							{key + 1} - Resultado de local
						</Badge>
						<CardHeader px="2" pt="2" pb="2">
							<Heading size="xs" color="gray.500">
								{query}
							</Heading>
						</CardHeader>
						<CardBody>
							{Object.keys(place)?.length > 0 && (
								<Stack
									divider={<StackDivider />}
									spacing="4"
								>
									{Object.entries(place).map(
										(prop, index) => (
											<Box key={index}>
												<Flex alignItems="center">
													<Box flex="1">
														<Badge colorScheme="linkedin">
															{prop[0]}
														</Badge>
														<Text fontSize="md">
															{prop[1]}
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
