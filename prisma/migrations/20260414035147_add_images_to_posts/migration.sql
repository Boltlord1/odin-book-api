-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "postId" UUID NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_public_id_key" ON "Image"("public_id");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
