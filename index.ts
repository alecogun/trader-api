#!/usr/bin/env node

import { addMemoToSerializedTxn, BaseProvider, createTraderAPIMemoInstruction, HttpProvider, loadFromEnv, MAINNET_API_NY_HTTP, PostOrderRequestV2, signTx, WsProvider } from "@bloxroute/solana-trader-client-ts";
import {Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import { txToBase64 } from "./bxsolana/utils/transaction"
import { SystemProgram } from "@solana/web3.js";
import base58 from "bs58"

const config = loadFromEnv()

const provider = new HttpProvider(config.authHeader)

// PostOrderRequest 
const ownerAddress = config.publicKey
const payerAddress = config.publicKey
const openOrdersAddress = "DwoXdF8kjt9RS6yPfpzp1yHBKtFMDpHQPCRgy1JhKgFt"
const side = 'ask'
const typelimit = 'limit'

const createOrder = async (provider: BaseProvider) => {
    await console.info("Creating order for requested market...")
    try {
        const request: PostOrderRequestV2 = {
            ownerAddress: ownerAddress,
            payerAddress: payerAddress,
            market: 'SOLUSDC',
            side: side,
            type: typelimit,
            amount: 0.1,
            price: 200,
            openOrdersAddress: openOrdersAddress,
            clientOrderID: '0',
            computeLimit: 0,
            computePrice: "0"
        }
        const response = await provider.postOrderV2(request);

        if (response) {
            console.info('Order placed successfully', response)
        } else {
            console.error('Order placement failed', response)
        }

    } catch(error) {
        console.error("Not successful", error)
    }
}

async function submitTransferWithMemoAndTip(provider: BaseProvider) {
    const keypair = Keypair.fromSecretKey(base58.decode(config.privateKey))
    const memo = createTraderAPIMemoInstruction("")

    const receiverPublicKey = new PublicKey(
        "7PMvo9sfhbwHpo2P4Y4XGySpzkodsMr2oa3v6UY1kag1"
    )
    const latestBlockhash = await provider.getRecentBlockHash({})

    let transaction = new Transaction({
        recentBlockhash: latestBlockhash.blockHash,
        feePayer: keypair.publicKey,
    })
        .add(
            SystemProgram.transfer({
                fromPubkey: keypair.publicKey,
                toPubkey: receiverPublicKey,
                lamports: 0.000001 * LAMPORTS_PER_SOL,
            })
        )
        .add(
            SystemProgram.transfer({
                fromPubkey: keypair.publicKey,
                toPubkey: new PublicKey(
                    "HWEoBxYs7ssKuudEjzjmpfJVX7Dvi7wescFsVx2L5yoY"
                ),
                lamports: 0.0001 * LAMPORTS_PER_SOL,
            })
        )
    transaction = transaction.add(memo)

    transaction.sign(keypair)
    const serializedTransaztionBytes = transaction.serialize()
    const buff = Buffer.from(serializedTransaztionBytes)
    const encodedTxn = buff.toString("base64")
    const response = await provider.postSubmit({
        transaction: { content: encodedTxn, isCleanup: false },
        skipPreFlight: false,
    })
    
    if (response.signature) {
        console.info('Transaction Submitted successfully')
        console.info('Transaction Signature: ', response.signature)
        console.info(`To confirm the transaction status, run: solana confirm ${response.signature}`)
    } else {
        console.error('Transaction submission failed', response)
    }
}


// Submit order request
const submitTxwithMemo = async (provider: BaseProvider) => {
    console.info("Retrieving recent blockHash....")
    const recentBlockhash = await provider.getRecentBlockHash({})
    console.info(recentBlockhash.blockHash)

    const keypair = Keypair.fromSecretKey(base58.decode(config.privateKey))
    const encodedTxn = buildWithUnsinedTxn(
        recentBlockhash.blockHash,
        keypair.publicKey
    )

    let encodedTxn2 = addMemoToSerializedTxn(encodedTxn)
    console.info("Submitting tx with memo")

    const tx = signTx(encodedTxn2, keypair)
    encodedTxn2 = txToBase64(tx)
    const response = await provider.postSubmit({
        transaction: {content: encodedTxn2, isCleanup: false},
        skipPreFlight: true,
    })
    console.info(response.signature)
}

function buildWithUnsinedTxn (
    recentBlockhash: string | undefined,
    owner: PublicKey
): string {
    const tx = new Transaction({
        recentBlockhash: recentBlockhash,
        feePayer: owner,
    })

    return Buffer.from(tx.serialize({verifySignatures: false})).toString(
        'base64'
    )
}


(async () => {
    await createOrder(provider)
    await submitTransferWithMemoAndTip(provider)
})();

