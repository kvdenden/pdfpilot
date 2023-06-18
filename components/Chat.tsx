'use client'
import 'react-chat-elements/dist/main.css'
import { useState, useRef, useEffect } from 'react'

import { MessageList, Input, Button } from 'react-chat-elements'
import { Box } from '@chakra-ui/react'

interface ChatProps {
  id: string
}

export default function Chat({ id }: ChatProps) {
  const [messages, setMessages] = useState<any[]>([])
  const chatRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleSend = (e: any) => {
    if (inputRef.current === null) return
    setLoading(true)
    e.preventDefault()
    if (inputRef?.current.value !== '') {
      const query = inputRef?.current.value
      setMessages((prevMessages) => [...prevMessages, { position: 'right', title: 'User', type: 'text', text: query }])
      const data = {
        id: id,
        query: query,
      }
      fetch('/api/query', {
        method: 'POST',
        body: JSON.stringify(data),
      }).then((response) => {
        response.json().then((data) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { position: 'left', title: 'PDF Pilot', type: 'text', text: data.response.text },
          ])
        })
      })
    }
    setLoading(false)
    inputRef.current.value = ''
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
            rightButtons={
              <Button
                type="submit"
                color="white"
                backgroundColor="black"
                text={`${loading ? '...' : 'Send'}`}
                disabled={loading}
              />
            }
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
