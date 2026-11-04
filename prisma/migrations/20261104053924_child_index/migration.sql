-- DropIndex
DROP INDEX "Experience_profileId_key";

-- DropIndex
DROP INDEX "Project_profileId_key";

-- CreateIndex
CREATE INDEX "Experience_profileId_idx" ON "Experience"("profileId");

-- CreateIndex
CREATE INDEX "Project_profileId_idx" ON "Project"("profileId");
