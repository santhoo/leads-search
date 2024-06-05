import { useState } from 'react'
import { Flex, Heading, Text, SkeletonText, Box } from '@chakra-ui/react'

import { ChevronRightIcon } from '@chakra-ui/icons'
import { useDetailContext } from '@/context/DetailProvider'
import { useInterval } from '@/util/functions'
import { serchInterval } from '@/util/defaults'

function BackgroundProgress({ value, max = 100, bg = 'gray.300', children }) {
	const progress = (100 * value) / max
	const rightPost = value < max ? `${100 - progress}%` : '100%'

	return (
		<Box>
			<Box position="absolute" left="0" right="0" top="0" bottom="0" zIndex="0">
				<Box
					position="absolute"
					left="0"
					right={rightPost}
					top="0"
					bottom="0"
					bg={bg}
				/>
			</Box>
			<Box zIndex="10">{children}</Box>
		</Box>
	)
}

function CardResult({ error, skeleton, data }) {
	const handleOpen = useDetailContext()
	const [lastElapsed, setLastElapsed] = useState('')

	useInterval(() => {
		if (skeleton) {
			const elapsed = Date.now() - skeleton

			setLastElapsed(elapsed)
		}
	}, 400)

	const isActive =
		!error.error &&
		!skeleton &&
		handleOpen.active.estabelecimento?.cnpj === data.estabelecimento?.cnpj
			? true
			: false
	const isEnabled = !error.error && !skeleton && !isActive ? true : false

	return (
		<Flex
			bg={isActive ? 'blue.100' : error.error ? 'gray.100' : 'gray.200'}
			color={isActive ? 'blue.600' : error.error ? 'gray.500' : 'gray.600'}
			_hover={{ bg: isEnabled && 'gray.300' }}
			direction="column"
			p="2"
			minH="58px"
			justifyContent="center"
			borderBottom="2px"
			borderColor="white"
			position="relative" // bg progress
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
				<BackgroundProgress value={lastElapsed} max={serchInterval}>
					<SkeletonText noOfLines={2} spacing="2" skeletonHeight="3" w="50%" />
				</BackgroundProgress>
			) : (
				<Flex direction="row">
					<Flex
						direction="column"
						flex="1"
						color={
							data.estabelecimento.situacao_cadastral !== 'Ativa' && 'red.600'
						}
					>
						<Heading fontWeight="normal" size="xs">
							{data.estabelecimento.cnpj}
							{data.estabelecimento.situacao_cadastral !== 'Ativa' &&
								` - ${data.estabelecimento.situacao_cadastral}`}
						</Heading>
						<Text fontWeight="semibold" noOfLines={1}>
							{data.razao_social}
						</Text>
					</Flex>

					<ChevronRightIcon w={5} h={5} mr="2" alignSelf="center" />
				</Flex>
			)}
		</Flex>
	)
}

export default function ResultItem({ empresa }) {
	const { error, cnpj, skeleton, ...response } = empresa

	return (
		<CardResult error={{ error, cnpj }} skeleton={skeleton} data={response} />
	)
}
