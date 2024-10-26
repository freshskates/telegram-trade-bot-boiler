-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL DEFAULT 'anon',
    "walletPk" TEXT NOT NULL,
    "walletPb" TEXT NOT NULL,
    "referredBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gasFee" DOUBLE PRECISION NOT NULL DEFAULT 70,
    "autoBuy" BOOLEAN NOT NULL DEFAULT false,
    "autoBuyTrx" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "selectedBuySlippage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "slippageBuyCustom" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "slippageBuy" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "selectedSellSlippage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "slippageSell" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "slippageSellCustom" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "selectedBuy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "buyTopLeftX" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "buyTopCenterX" DOUBLE PRECISION NOT NULL DEFAULT 500,
    "buyTopRightX" DOUBLE PRECISION NOT NULL DEFAULT 1000,
    "buyBottomLeftX" DOUBLE PRECISION NOT NULL DEFAULT 1000,
    "buyBottomRightX" DOUBLE PRECISION NOT NULL DEFAULT 5000,
    "buyCustomX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "selectedSellPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sellLeftPercentX" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "sellRightPercentX" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "sellCustomX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "tokenSymbol" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "initialTrx" DOUBLE PRECISION NOT NULL,
    "initialToken" DOUBLE PRECISION NOT NULL,
    "currentTrx" DOUBLE PRECISION NOT NULL,
    "currentToken" DOUBLE PRECISION NOT NULL,
    "currentPricePerToken" DOUBLE PRECISION NOT NULL,
    "currentProfitLoss" DOUBLE PRECISION,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_key_key" ON "Session"("key");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referredBy_fkey" FOREIGN KEY ("referredBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
