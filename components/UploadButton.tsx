'use client'

import { useState, useEffect, useCallback } from 'react'
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

export default function UploadButton() {
  const [selectedFile, setSelectedFile] = useState<FileDetails>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const options = {
    cMapUrl: 'cmaps/',
    standardFontDataUrl: 'standard_fonts/',
  }
  const handleFileSelect = (event: any) => {
    const file = event.target.files[0]
    setSelectedFile(file)
    handleFileUpload(file)
  }

  const handleFileUpload = useCallback(
    (file: FileDetails) => {
      if (!file) {
        return
      }
      setLoading(true)
      const data = new FormData()
      data.append('file', file, file.name)
      fetch('/api/upload', {
        method: 'POST',
        body: data,
      }).then((response) => {
        response.json().then((data) => {
          console.log(data)
          router.push(`/view/${data.id}`)
        })
        setLoading(false)
      })
    },
    [router]
  )

  useEffect(() => {
    if (selectedFile) {
      handleFileUpload(selectedFile)
    }
  }, [handleFileUpload, selectedFile])

  return (
    <>
      <Input type="file" display="none" id="file-upload" onChange={handleFileSelect} />
      <label htmlFor="file-upload">
        <Button
          as="span"
          cursor={'pointer'}
          colorScheme={'white'}
          rounded={'full'}
          px={8}
          w={60}
          variant={'outline'}
          mb={8}
          size={'lg'}
          isDisabled={loading}
        >
          {loading ? 'Loading PDF' : `Upload PDF`}
        </Button>
      </label>
    </>
  )
}
