import { Flex, Heading } from '@chakra-ui/react'

import CardItem from '@/components/CardItem'
import PlaceDetail from '@/components/PlaceDetail'

export default function ItemDetail({ item }) {
	// console.log('ITEM:', item)
	const { razao_social, estabelecimento: empresa } = item

	const parse = [
		{
			label: 'Situação Cadastral',
			value: empresa.situacao_cadastral,
			bg:
				empresa.situacao_cadastral !== 'Ativa'
					? 'red.100'
					: 'green.100',
		},
		{
			label: 'Razão Social',
			value: razao_social,
		},
		{
			label: 'Nome Fantasia',
			value: empresa.nome_fantasia,
		},
		{
			label: 'Cidade - UF',
			value: `${empresa.cidade.nome} - ${empresa.estado.sigla}`,
		},
		{
			label: 'E-mail',
			value: empresa.email,
		},
		{
			label: 'Telefones',
			value: `(${empresa.ddd1}) ${empresa.telefone1.replace(
				/(.{4}$)/,
				'-$1'
			)} ${
				empresa.ddd2 !== null
					? ` / (${
							empresa.ddd2
					  }) ${empresa.telefone2.replace(
							/(.{4}$)/,
							'-$1'
					  )}`
					: ''
			}`,
		},
		{
			label: 'Endereço',
			value: `${empresa.tipo_logradouro} ${empresa.logradouro}, ${empresa.numero}, ${empresa.cidade.nome}`,
		},
	]

	return (
		<Flex direction="column">
			{parse && item?.razao_social && (
				<>
					<Heading
						textTransform="uppercase"
						size="xs"
						mb="4"
						py="1"
						bg="gray.100"
						color="gray.500"
						textAlign="center"
					>
						Dados CNPJ
					</Heading>
					{parse.map((item, index) => (
						<CardItem key={index} item={item} />
					))}
				</>
			)}

			<PlaceDetail item={item} />
		</Flex>
	)
}
