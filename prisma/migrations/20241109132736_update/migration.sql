/*
  Warnings:

  - You are about to drop the column `autoBuyTrx` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `buyBottomLeftX` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `buyBottomRightX` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `buyCustomX` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `buyTopCenterX` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `buyTopLeftX` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `buyTopRightX` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `selectedBuy` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `selectedBuySlippage` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `selectedSellPercent` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `selectedSellSlippage` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `sellCustomX` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `sellLeftPercentX` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `sellRightPercentX` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `slippageBuy` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `slippageBuyCustom` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `slippageSell` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `slippageSellCustom` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `walletPb` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `walletPk` on the `User` table. All the data in the column will be lost.
  - Added the required column `walletPrivateKey` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletPublicKey` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Settings"
DROP COLUMN "buyBottomLeftX",
DROP COLUMN "buyBottomRightX",
DROP COLUMN "buyCustomX",
DROP COLUMN "buyTopCenterX",
DROP COLUMN "buyTopLeftX",
DROP COLUMN "buyTopRightX",
DROP COLUMN "selectedBuy",
DROP COLUMN "selectedBuySlippage",
DROP COLUMN "selectedSellPercent",
DROP COLUMN "selectedSellSlippage",
DROP COLUMN "sellCustomX",
DROP COLUMN "sellLeftPercentX",
DROP COLUMN "sellRightPercentX",
DROP COLUMN "slippageBuy",
DROP COLUMN "slippageBuyCustom",
DROP COLUMN "slippageSell",
DROP COLUMN "slippageSellCustom";

ALTER TABLE "Settings"
RENAME COLUMN "autoBuyTrx" TO "autoBuyAmount";

-- AlterTable
ALTER TABLE "User" 
RENAME COLUMN "walletPb" TO "walletPrivateKey";

ALTER TABLE "User" 
RENAME COLUMN "walletPk" TO "walletPublicKey";