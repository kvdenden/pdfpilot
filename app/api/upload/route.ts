import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1',
  forcePathStyle: true,
})

function s3Key(id: string) {
  return `uploads/${id}.pdf`
}

function s3Url(id: string) {
  const key = s3Key(id)
  return `${process.env.S3_ENDPOINT || 'https://s3.amazonaws.com'}/${process.env.S3_BUCKET_NAME}/${key}` // TODO: fix
}

export async function POST(req: NextRequest, res: NextResponse) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) return NextResponse.json({ error: 'missing file' }, { status: 400 })
  if (file.type !== 'application/pdf') return NextResponse.json({ error: 'invalid file' }, { status: 400 })

  const id = randomUUID()
  const buffer = await file.arrayBuffer()

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key(id),
      ContentType: file.type,
      Body: Buffer.from(buffer),
    })
  )

  return NextResponse.json({ id, url: s3Url(id) })
}

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 })

  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key(id),
      })
    )
  } catch (e) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  return NextResponse.redirect(s3Url(id))
}
