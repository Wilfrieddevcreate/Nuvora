-- CreateTable
CREATE TABLE "TrackingLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "type" TEXT NOT NULL,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    "isRateLimited" BOOLEAN NOT NULL DEFAULT false,
    "isSuspicious" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "TrackingLog_productId_idx" ON "TrackingLog"("productId");

-- CreateIndex
CREATE INDEX "TrackingLog_userId_idx" ON "TrackingLog"("userId");

-- CreateIndex
CREATE INDEX "TrackingLog_ipAddress_idx" ON "TrackingLog"("ipAddress");

-- CreateIndex
CREATE INDEX "TrackingLog_timestamp_idx" ON "TrackingLog"("timestamp");

-- CreateIndex
CREATE INDEX "TrackingLog_isBot_idx" ON "TrackingLog"("isBot");

-- CreateIndex
CREATE INDEX "TrackingLog_isSuspicious_idx" ON "TrackingLog"("isSuspicious");
