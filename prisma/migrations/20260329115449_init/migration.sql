-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "hash" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "display" VARCHAR(255) NOT NULL,
    "avatar" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
