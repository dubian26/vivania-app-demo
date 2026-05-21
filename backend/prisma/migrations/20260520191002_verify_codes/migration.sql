-- CreateTable
CREATE TABLE "VerifyCodes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "purpose" VARCHAR(50) NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerifyCodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VerifyCodes" ADD CONSTRAINT "VerifyCodes_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
