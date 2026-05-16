/*
  Warnings:

  - You are about to drop the column `sender_id ` on the `messages` table. All the data in the column will be lost.
  - Added the required column `sender_id` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_sender_id _fkey";

-- DropIndex
DROP INDEX "messages_chat_id_sender_id _idx";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "sender_id ",
ADD COLUMN     "sender_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "messages_chat_id_sender_id_idx" ON "messages"("chat_id", "sender_id");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
