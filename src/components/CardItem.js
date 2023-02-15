import {
	useToast,
	Flex,
	Box,
	Heading,
	Text,
	IconButton,
} from '@chakra-ui/react'

import { CopyIcon } from '@chakra-ui/icons'

export default function CardItem({ item }) {
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

	return (
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
				<Text fontWeight="semibold">{item.value}</Text>
			</Box>
			<IconButton
				colorScheme="blue"
				_hover={{ bg: 'blue.100' }}
				variant="ghost"
				ml="2"
				icon={<CopyIcon />}
				onClick={() => clickCopy(item.value, item.label)}
			/>
		</Flex>
	)
}
