import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'langchain/llms/openai'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PrismaVectorStore } from 'langchain/vectorstores/prisma'
import { PrismaClient, Prisma, Document } from '@prisma/client'

import { RetrievalQAChain } from 'langchain/chains'

export async function POST(req: NextRequest, res: NextResponse) {
  const { id, query } = await req.json()

  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 })

  const model = new OpenAI()

  const db = new PrismaClient()

  const vectorStore = PrismaVectorStore.withModel<Document>(db).create(new OpenAIEmbeddings(), {
    prisma: Prisma,
    tableName: 'Document',
    vectorColumnName: 'vector',
    columns: {
      id: PrismaVectorStore.IdColumn,
      content: PrismaVectorStore.ContentColumn,
    },
  })

  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(4, { documentId: id }))

  const response = await chain.call({
    query,
  })

  return NextResponse.json({ id, response })
}
