'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Heading, Container, Text, Button, Stack, Input } from '@chakra-ui/react'

interface FileDetails extends Blob {
  lastModified: number
  lastModifiedDate: Date
  name: string
  size: number
  type: string
  webkitRelativePath: string
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<FileDetails>()
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const router = useRouter()
  const options = {
    cMapUrl: 'cmaps/',
    standardFontDataUrl: 'standard_fonts/',
  }
  const handleFileSelect = (event: any) => {
    const file = event.target.files[0]
    setSelectedFile(file)
  }
  const handleFileUpload = () => {
    if (!selectedFile) {
      return
    }
    const data = new FormData()
    data.append('file', selectedFile, selectedFile.name)
    console.log(selectedFile, 'data')
    fetch('/api/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((data) => {
        console.log(data.id, 'data')
        router.push(`/view/${data.id}`)
      })
    })
    // Perform your file upload logic here
    // You can use selectedFile for further processing or send it to the server
  }

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
              <Input type="file" display="none" id="file-upload" onChange={handleFileSelect} />
              <label htmlFor="file-upload">
                <Button as="span" colorScheme={'green'} rounded={'full'} px={6} variant={'outline'} mb={8} size={'lg'}>
                  {selectedFile ? `Change file` : `Upload PDF`}
                </Button>
              </label>
              {selectedFile && (
                <Box p={8} border={'1px solid white'} borderRadius={'xl'}>
                  <Text my={2} fontWeight="bold">
                    {selectedFile.name}
                  </Text>
                  <Button
                    colorScheme={'green'}
                    mt={4}
                    bg={'green.400'}
                    rounded={'full'}
                    px={6}
                    color={'white'}
                    _hover={{
                      bg: 'green.500',
                    }}
                    onClick={handleFileUpload}
                  >
                    Analyse document
                  </Button>
                </Box>
              )}
            </Box>
          </Stack>
        </Stack>
      </Container>
    </main>
  )
}
