/*
  Warnings:

  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Program` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SavedProgram` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_programId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_companyId_fkey";

-- DropForeignKey
ALTER TABLE "SavedProgram" DROP CONSTRAINT "SavedProgram_programId_fkey";

-- DropForeignKey
ALTER TABLE "SavedProgram" DROP CONSTRAINT "SavedProgram_userId_fkey";

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "userId" DROP NOT NULL;

-- DropTable
DROP TABLE "Enrollment";

-- DropTable
DROP TABLE "Program";

-- DropTable
DROP TABLE "SavedProgram";
