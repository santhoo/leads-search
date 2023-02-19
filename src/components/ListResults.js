import { Box, Flex, Heading } from '@chakra-ui/react'

import ResultItem from '@/components/ResultItem'

export default function ListResults({
	list,
	searchLength,
	loading,
	searchTime,
}) {
	return (
		<>
			{list?.length > 0 && (
				<Flex
					mt="12"
					direction="column"
					height="100%"
					boxShadow="md"
				>
					<Box
						w="100%"
						p="2"
						bg="blue.200"
						alignSelf="flex-start"
						borderTopRadius="md"
						borderBottom="4px"
						borderColor="blue.400"
					>
						<Heading fontSize="sm" fontWeight="bold">
							{list.length} de {searchLength} CNPJs buscados
						</Heading>
					</Box>

					<Box
						bg="white"
						flex="1"
						overflow="hidden"
						position="relative"
						borderBottomRadius="md"
					>
						<Box
							position="absolute"
							left="0"
							right="0"
							top="0"
							bottom="0"
							overflowY="auto"
						>
							{list.map((item, index) => (
								<ResultItem key={index} empresa={item} />
							))}

							{loading && searchTime && (
								<ResultItem
									empresa={{
										skeleton: searchTime,
									}}
								/>
							)}
						</Box>
					</Box>
				</Flex>
			)}
		</>
	)
}
