-- CreateTable
CREATE TABLE "GithubUser" (
    "id" VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "GoogleUser" (
    "id" VARCHAR(255) NOT NULL,
    "userId" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GithubUser_id_key" ON "GithubUser"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GithubUser_userId_key" ON "GithubUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleUser_id_key" ON "GoogleUser"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleUser_userId_key" ON "GoogleUser"("userId");

-- AddForeignKey
ALTER TABLE "GithubUser" ADD CONSTRAINT "GithubUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleUser" ADD CONSTRAINT "GoogleUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
