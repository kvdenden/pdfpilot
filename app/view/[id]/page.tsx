// @ts-nocheck
'use client'

import { useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Box, Text, Input, NumberInput, NumberInputField } from '@chakra-ui/react'
import SplitPane from 'react-split-pane'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5'
import { InView } from 'react-intersection-observer'

import useWindowSize from '@/hooks/useWindowSize'

interface Size {
  width: number | undefined
  height: number | undefined
}

export default function Home() {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number | ''>(1)
  const params = useParams()
  const pdfContainerRef = useRef(null)
  const size: Size = useWindowSize()

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

  return (
    <main style={{ minHeight: `100vh` }}>
      <SplitPane
        split={size?.width >= 768 ? 'vertical' : 'horizontal'}
        maxSize={-80}
        defaultSize={400}
        pane1Style={{ overflow: 'hidden' }}
        resizerStyle={{
          backgroundColor: 'lightgray',
          minWidth: 8,
          minHeight: 8,
          cursor: `${size?.width >= 768 ? 'col-resize' : 'row-resize'}`,
        }}
      >
        <Box position={'relative'} overflow={'hidden'} bg="green.800" w={'full'}>
          <Box w={'full'} p={0} m={0}>
            <Box w={'full'}>
              <Box width={'full'} px={4} borderTopRadius={'lg'} bg="green.800" zIndex={10} position={'sticky'} top={0}>
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  borderTopRadius={'lg'}
                  justifyContent={'center'}
                  bg="gray.800"
                  py={2}
                  marginTop={4}
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
              <Document
                className="pdfdocument"
                file={`http://localhost:9000/pdfpilot/uploads/${params.id}.pdf`}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
                inputRef={pdfContainerRef}
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
            </Box>
          </Box>
        </Box>
        <Box display={'flex'} flexDirection={'column'} w={'full'} h={'full'}>
          <Box h={'full'} bg="green.400" p={4}>
            <Box h={'full'} bg={'white'} borderRadius={'lg'} border={'1px solid black'}></Box>
          </Box>
          <Box p={4} bg="green.600">
            <Input
              placeholder="Ask a question"
              type="text"
              border={'1px solid black'}
              _hover={{ border: '1px solid black' }}
              backgroundColor={'white'}
              color={'black'}
              size={'lg'}
            />
          </Box>
        </Box>
      </SplitPane>
    </main>
  )
}
