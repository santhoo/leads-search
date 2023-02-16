import {
	Box,
	Flex,
	Heading,
	Text,
	IconButton,
} from '@chakra-ui/react'

import { ChevronRightIcon } from '@chakra-ui/icons'
import { useDetailContext } from '@/context/DetailProvider'

function CardResult({ error, data }) {
	const handleOpen = useDetailContext()

	return (
		<Flex
			direction="column"
			bg={error.error ? 'gray.200' : 'gray.100'}
			p="2"
			minH="58px"
			justifyContent="center"
			borderBottom="2px"
			borderColor="white"
		>
			{error.error ? (
				<>
					<Heading
						color="red.600"
						fontWeight="normal"
						size="xs"
					>
						{error.cnpj}
					</Heading>
					<Text fontWeight="semibold" color="red.600">
						{error.error}
					</Text>
				</>
			) : (
				<Flex
					direction="row"
					cursor="pointer"
					onClick={() => handleOpen.setActive(data)}
				>
					<Flex direction="column" flex="1">
						<Heading fontWeight="normal" size="xs">
							{data.estabelecimento.cnpj}
						</Heading>
						<Text fontWeight="semibold">
							{data.razao_social}
						</Text>
					</Flex>

					<IconButton
						colorScheme="blue"
						_hover={{ bg: 'blue.100' }}
						variant="ghost"
						ml="2"
						icon={<ChevronRightIcon />}
					/>
				</Flex>
			)}
		</Flex>
	)
}

export default function ResultItem({ empresa }) {
	const { error, cnpj, ...response } = empresa

	return (
		<CardResult error={{ error, cnpj }} data={response} />
	)
}
