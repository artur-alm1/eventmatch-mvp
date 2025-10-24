-- DropForeignKey
ALTER TABLE "public"."ResumeFile" DROP CONSTRAINT "resume_user_fk";

-- AlterTable
ALTER TABLE "ResumeFile" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "ResumeFile" ADD CONSTRAINT "ResumeFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "resume_user_created_idx" RENAME TO "ResumeFile_userId_createdAt_idx";
