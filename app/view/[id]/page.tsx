// @ts-nocheck
'use client'
import 'react-chat-elements/dist/main.css'
import { useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Box, Heading, Text, Input, NumberInput, NumberInputField, Spinner, Flex } from '@chakra-ui/react'
import SplitPane from 'react-split-pane'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5'
import { InView } from 'react-intersection-observer'

import useWindowSize from '@/hooks/useWindowSize'
import UploadButton from '@/components/UploadButton'
import Chat from '@/components/Chat'
interface Size {
  width: number | undefined
  height: number | undefined
}

export default function View() {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number | ''>(1)
  const params = useParams()
  const pdfContainerRef = useRef(null)
  const size: Size = useWindowSize()

  const documentUrl = `/api/upload?id=${params.id}`

  const options = {
    cMapUrl: 'cmaps/',
    standardFontDataUrl: 'standard_fonts/',
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number | null }) {
    setNumPages(numPages)
  }

  const scrollToPage = (pageNumber) => {
    if (pdfContainerRef.current) {
      const pageElement = (pdfContainerRef.current as HTMLElement).querySelector(
        `div[data-page-number="${pageNumber}"]`
      )
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const ErrorMessage = () => {
    return (
      <Flex flexDirection={'column'} py={16} w={'full'} h={'full'} align="center" justify="center" my={'auto'}>
        <Heading textAlign={'center'} mb={8}>
          Failed to load pdf
        </Heading>
        <UploadButton />
      </Flex>
    )
  }
  const LoadingMessage = () => {
    return (
      <Flex w={'full'} h={'full'} align="center" justify="center">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="green.500" size="xl" />
      </Flex>
    )
  }

  if (size.width == undefined) {
    return (
      <Flex w={'full'} h={'full'} align="center" justify="center">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="green.500" size="xl" />
      </Flex>
    )
  }
  return (
    <main
      h="full"
      position="relative"
      style={{
        height: `${size.height - 60}px`,
      }}
    >
      <SplitPane
        split={size?.width >= 768 ? 'vertical' : 'horizontal'}
        maxSize={-80}
        defaultSize={400}
        minSize={size.width > 768 ? 400 : '100%'}
        style={{ backgroundColor: '#22543D' }}
        pane1Style={{ overflowY: 'scroll' }}
        pane2Style={{ overflowY: 'hidden' }}
        resizerStyle={{
          backgroundColor: 'lightgray',
          minWidth: 8,
          minHeight: 8,
          cursor: `${size?.width >= 768 ? 'col-resize' : 'row-resize'}`,
        }}
      >
        <Box position={'relative'} h={'full'} w={'full'}>
          <Box w={'full'} p={0} m={0} h={'full'}>
            <Box w={'full'} bg="gray.600" h={'full'} position={'relative'} overflowY={'scroll'}>
              <>
                {numPages && (
                  <Box
                    width={'full'}
                    px={4}
                    borderTopRadius={'lg'}
                    pt={4}
                    zIndex={10}
                    position={'sticky'}
                    bg="gray.600"
                    top={0}
                  >
                    <Box
                      display={'flex'}
                      alignItems={'center'}
                      borderTopRadius={'lg'}
                      justifyContent={'center'}
                      bg="gray.800"
                      py={2}
                    >
                      <NumberInput
                        max={numPages ?? 0}
                        size="lg"
                        w={20}
                        px={0}
                        min={1}
                        value={pageNumber}
                        onChange={(_, pageNumber) => {
                          if (Number.isNaN(pageNumber)) {
                            setPageNumber('')
                          } else {
                            setPageNumber(pageNumber)
                            scrollToPage(pageNumber)
                          }
                        }}
                      >
                        <NumberInputField />
                      </NumberInput>
                      <Text ml={4}>of {numPages}</Text>
                    </Box>
                  </Box>
                )}
                <Document
                  className="pdfdocument"
                  file={documentUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  options={options}
                  inputRef={pdfContainerRef}
                  error={<ErrorMessage />}
                  loading={LoadingMessage}
                >
                  {Array.from(new Array(numPages), (el, index) => {
                    return (
                      <InView
                        as="div"
                        key={`page_${index + 1}`}
                        onChange={(inView, entry) => {
                          inView && setPageNumber(index + 1)
                        }}
                        threshold={0.5}
                      >
                        {({ inView, ref, entry }) => (
                          <Page
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            className="pdfpage"
                            inputRef={ref}
                          />
                        )}
                      </InView>
                    )
                  })}
                </Document>
              </>
            </Box>
          </Box>
        </Box>
        <Chat />
      </SplitPane>
    </main>
  )
}
