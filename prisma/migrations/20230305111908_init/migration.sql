-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "login" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "flow" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Operation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubOperation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "SubOperation_id_fkey" FOREIGN KEY ("id") REFERENCES "Operation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubOperation2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "operationId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "SubOperation2_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "Operation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "User_updatedAt_idx" ON "User"("updatedAt");

-- CreateIndex
CREATE INDEX "User_login_idx" ON "User"("login");

-- CreateIndex
CREATE INDEX "Operation_id_idx" ON "Operation"("id");

-- CreateIndex
CREATE INDEX "Operation_createdAt_idx" ON "Operation"("createdAt");

-- CreateIndex
CREATE INDEX "Operation_updatedAt_idx" ON "Operation"("updatedAt");

-- CreateIndex
CREATE INDEX "Operation_userId_idx" ON "Operation"("userId");

-- CreateIndex
CREATE INDEX "Operation_status_idx" ON "Operation"("status");

-- CreateIndex
CREATE INDEX "SubOperation_id_idx" ON "SubOperation"("id");

-- CreateIndex
CREATE INDEX "SubOperation_createdAt_idx" ON "SubOperation"("createdAt");

-- CreateIndex
CREATE INDEX "SubOperation_updatedAt_idx" ON "SubOperation"("updatedAt");

-- CreateIndex
CREATE INDEX "SubOperation_status_idx" ON "SubOperation"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SubOperation2_operationId_key" ON "SubOperation2"("operationId");

-- CreateIndex
CREATE INDEX "SubOperation2_id_idx" ON "SubOperation2"("id");

-- CreateIndex
CREATE INDEX "SubOperation2_createdAt_idx" ON "SubOperation2"("createdAt");

-- CreateIndex
CREATE INDEX "SubOperation2_updatedAt_idx" ON "SubOperation2"("updatedAt");

-- CreateIndex
CREATE INDEX "SubOperation2_operationId_idx" ON "SubOperation2"("operationId");

-- CreateIndex
CREATE INDEX "SubOperation2_status_idx" ON "SubOperation2"("status");
