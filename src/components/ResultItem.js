import {
	Box,
	Flex,
	Heading,
	Text,
	IconButton,
	SkeletonText,
} from '@chakra-ui/react'

import { ChevronRightIcon } from '@chakra-ui/icons'
import { useDetailContext } from '@/context/DetailProvider'

function CardResult({ error, skeleton, data }) {
	const handleOpen = useDetailContext()

	const isActive =
		!error.error &&
		!skeleton &&
		handleOpen.active.estabelecimento?.cnpj ===
			data.estabelecimento?.cnpj
			? true
			: false
	const isEnabled =
		!error.error && !skeleton && !isActive ? true : false

	return (
		<Flex
			bg={
				isActive
					? 'blue.100'
					: error.error
					? 'gray.100'
					: 'gray.200'
			}
			color={
				isActive
					? 'blue.600'
					: error.error
					? 'gray.500'
					: 'gray.600'
			}
			_hover={{ bg: isEnabled && 'gray.300' }}
			direction="column"
			p="2"
			minH="58px"
			justifyContent="center"
			borderBottom="2px"
			borderColor="white"
			cursor={isEnabled && 'pointer'}
			onClick={() => {
				isEnabled && handleOpen.setActive(data)
			}}
		>
			{error.error ? (
				<>
					<Heading fontWeight="normal" size="xs">
						{error.cnpj}
					</Heading>
					<Text fontWeight="semibold">{error.error}</Text>
				</>
			) : skeleton ? (
				<SkeletonText
					noOfLines={2}
					spacing="2"
					skeletonHeight="3"
					w="50%"
				/>
			) : (
				<Flex direction="row">
					<Flex
						direction="column"
						flex="1"
						color={
							data.estabelecimento.situacao_cadastral !==
								'Ativa' && 'red.600'
						}
					>
						<Heading fontWeight="normal" size="xs">
							{data.estabelecimento.cnpj}
							{data.estabelecimento.situacao_cadastral !==
								'Ativa' &&
								` - ${data.estabelecimento.situacao_cadastral}`}
						</Heading>
						<Text fontWeight="semibold">
							{data.razao_social}
						</Text>
					</Flex>

					<ChevronRightIcon
						w={5}
						h={5}
						mr="2"
						alignSelf="center"
					/>
				</Flex>
			)}
		</Flex>
	)
}

export default function ResultItem({ empresa }) {
	const { error, cnpj, skeleton, ...response } = empresa

	return (
		<CardResult
			error={{ error, cnpj }}
			skeleton={skeleton}
			data={response}
		/>
	)
}
