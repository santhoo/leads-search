import { Divider } from '@chakra-ui/react'
import ItemDetail from './ItemDetail'

export default function ListItems({ list }) {
	return (
		<>
			<Divider my="8" borderColor="gray.400" />

			<ItemDetail item={list} />
		</>
	)
}
