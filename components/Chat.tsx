'use client'
import 'react-chat-elements/dist/main.css'
import { useState, useRef, useEffect } from 'react'

import { MessageList, Input, Button } from 'react-chat-elements'
import { Box } from '@chakra-ui/react'

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([
    {
      position: 'right',
      type: 'text',
      title: 'User',
      text: 'How can PDFPilot help me analyze my research papers?',
    },
    {
      position: 'left',
      type: 'text',
      title: 'PDF Pilot',
      text: 'Our app allows you to ask questions, extract key information, and delve deeper into the content of your PDFs. Whether you need to quickly find relevant sections, summarize complex concepts, or uncover hidden insights, PDFPilot has got you covered. Get ready to navigate your documents with ease and unlock a whole new level of document analysis!',
    },
    {
      position: 'right',
      type: 'text',
      title: 'User',
      text: 'How can PDFPilot help me analyze my research papers?',
    },
    {
      position: 'left',
      type: 'text',
      title: 'PDF Pilot',
      text: 'Our app allows you to ask questions, extract key information, and delve deeper into the content of your PDFs. Whether you need to quickly find relevant sections, summarize complex concepts, or uncover hidden insights, PDFPilot has got you covered. Get ready to navigate your documents with ease and unlock a whole new level of document analysis!',
    },
    {
      position: 'right',
      type: 'text',
      title: 'User',
      text: 'How can PDFPilot help me analyze my research papers?',
    },
    {
      position: 'left',
      type: 'text',
      title: 'PDF Pilot',
      text: 'Our app allows you to ask questions, extract key information, and delve deeper into the content of your PDFs. Whether you need to quickly find relevant sections, summarize complex concepts, or uncover hidden insights, PDFPilot has got you covered. Get ready to navigate your documents with ease and unlock a whole new level of document analysis!',
    },
    {
      position: 'right',
      type: 'text',
      title: 'User',
      text: 'How can PDFPilot help me analyze my research papers?',
    },
    {
      position: 'left',
      type: 'text',
      title: 'PDF Pilot',
      text: 'Our app allows you to ask questions, extract key information, and delve deeper into the content of your PDFs. Whether you need to quickly find relevant sections, summarize complex concepts, or uncover hidden insights, PDFPilot has got you covered. Get ready to navigate your documents with ease and unlock a whole new level of document analysis!',
    },
    {
      position: 'right',
      type: 'text',
      title: 'User',
      text: 'How can PDFPilot help me analyze my research papers?',
    },
    {
      position: 'left',
      type: 'text',
      title: 'PDF Pilot',
      text: 'Our app allows you to ask questions, extract key information, and delve deeper into the content of your PDFs. Whether you need to quickly find relevant sections, summarize complex concepts, or uncover hidden insights, PDFPilot has got you covered. Get ready to navigate your documents with ease and unlock a whole new level of document analysis!',
    },
  ])
  const chatRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleSend = (e: any) => {
    e.preventDefault()
    if (inputRef?.current) {
      setMessages([...messages, { position: 'right', title: 'User', type: 'text', text: inputRef?.current?.value }])
      inputRef.current.value = ''
    }
  }
  const scrollToPage = () => {
    if (chatRef.current) {
      const pageElement = chatRef.current.querySelector('.rce-container-mbox:last-child')
      if (pageElement) {
        setTimeout(() => {
          pageElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
        }, 100)
      }
    }
  }
  useEffect(() => {
    scrollToPage()
  }, [chatRef, messages])

  return (
    <Box display={'flex'} flexDirection={'column'} w={'full'} h={'full'}>
      <Box h={'full'} bg="gray.700" p={4} overflow={'hidden'}>
        <Box
          h={'full'}
          ref={chatRef}
          bg={'white'}
          borderRadius={'lg'}
          border={'1px solid black'}
          py={4}
          overflowY={'scroll'}
        >
          <MessageList
            referance={chatRef}
            className={'message-list'}
            lockable={false}
            toBottomHeight={'100%'}
            dataSource={messages}
          />{' '}
        </Box>
      </Box>
      <Box p={4} bg="gray.800" style={{ minHeight: ` 76px` }}>
        <form onSubmit={handleSend}>
          <Input
            rightButtons={<Button type="submit" color="white" backgroundColor="black" text="Send" />}
            maxHeight={500}
            referance={inputRef}
            className={'input_message'}
            placeholder={'Ask a question'}
            type={'text'}
          />
        </form>
      </Box>
    </Box>
  )
}
