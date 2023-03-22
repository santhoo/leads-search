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
			textColor:
				empresa.situacao_cadastral !== 'Ativa'
					? 'red.400'
					: 'green.400',
		},
		{
			label: 'Razão Social',
			value: razao_social,
		},
		{
			label: 'Nome Fantasia',
			value: empresa?.nome_fantasia,
		},
		{
			label: 'Cidade - UF',
			value: `${empresa.cidade.nome} - ${empresa.estado.sigla}`,
		},
		{
			label: 'E-mail',
			value: empresa?.email,
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

	const invalidDomains = [
		'gmail.com',
		'outlook.com',
		'hotmail.com',
		'live.com',
		'bol.com.br',
		'terra.com.br',
		'yahoo.com',
		'yahoo.com.br',
		'ig.com.br',
		'uol.com.br',
	]

	const sanitDomain = [
		'assessoria',
		'contabilidade',
		'contabil',
	]

	const emailDomain = empresa.email.split('@')[1]

	if (!invalidDomains.includes(emailDomain)) {
		// Se domínio de e-mail não for genérico

		// const emailTeste = 'endereco@dominio.com'
		// if (!invalidDomains.includes(emailTeste.split('@')[1])) {

		const domainAlert = sanitDomain.some((w) =>
			emailDomain.includes(w)
		)

		parse.push({
			label: 'Possível site',
			value: `https://www.${empresa.email.split('@')[1]}`,
			alert: domainAlert,
		})
	}

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
