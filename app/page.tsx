'use client'
import { Box, Heading, Container, Text, Button, Stack, Input } from '@chakra-ui/react'
import UploadButton from '@/components/UploadButton'

export default function Home() {
  return (
    <main>
      <Container maxW={'3xl'}>
        <Stack as={Box} textAlign={'center'} spacing={{ base: 8, md: 14 }} py={{ base: 20, md: 36 }}>
          <Heading fontWeight={600} fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }} lineHeight={'110%'}>
            Your Intelligent <br />
            <Text as={'span'} color={'green.400'}>
              PDF Assistant
            </Text>
          </Heading>
          <Text color={'gray.200'}>
            Unlock the power of your PDFs with AI-driven analysis, seamless collaboration, and effortless document
            management
          </Text>
          <Stack direction={'column'} spacing={3} align={'center'} alignSelf={'center'} position={'relative'}>
            <Box>
              <UploadButton />
            </Box>
          </Stack>
        </Stack>
      </Container>
    </main>
  )
}
