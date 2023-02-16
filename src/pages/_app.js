import { ChakraProvider } from '@chakra-ui/react'
import { DetailProvider } from '@/context/DetailProvider'

export default function App({ Component, pageProps }) {
	return (
		<DetailProvider>
			<ChakraProvider>
				<Component {...pageProps} />
			</ChakraProvider>
		</DetailProvider>
	)
}
