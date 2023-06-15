CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "vector" vector,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Document_documentId_idx" ON "Document"("documentId");
