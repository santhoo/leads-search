import { Flex, Divider } from '@chakra-ui/react'
import CardItem from '@/components/CardItem'

export default function ListItems({ list }) {
	const { razao_social, estabelecimento: empresa } = list

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
		<>
			<Divider my="8" borderColor="gray.400" />

			<Flex direction="column">
				{parse &&
					parse.map((item, index) => (
						<CardItem key={index} item={item} />
					))}
			</Flex>
		</>
	)
}
