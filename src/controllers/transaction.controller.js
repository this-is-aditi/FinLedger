 const transactionModel = require('../models/transaction.model');
 const ledgerModel = require('../models/ledger.model');
 const accountModel = require('../models/account.model');
 const emailService = require('../services/email.service');
const mongoose = require('mongoose');
/**
 * Create a new transaction
 * 10-step process:
 * 1. Validate request body
 * 2.Validate idempotency key
 * 3.Check account status
 * 4.Derive sender ablance from ledger
 * 5.Create transaction with pending status
 * 6.Create debit ledger entry for sender
 * 7.Create credit ledger entry for receiver
 * 8.Update transaction status to completed
 * 9.Commit MongoDB transaction
 * 10.Send email notification
 * 
 *
 */
async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if(!fromAccount, !toAccount, !amount, !idempotencyKey) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
    })
    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })  

    /**
     * 2.Validate idempotency key
     */
    const isTransactionAlreadyExists=await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status==="COMPLETED"){
            return res.status(200).json({
                message:"Transaction already processed",
                transaction:isTransactionAlreadyExists
            })
        }
        if(isTransactionAlreadyExists.status==="PENDING"){
            return res.status(200).json({
                message:"Transaction is being processed",
                transaction:isTransactionAlreadyExists
            })
        }
        if(isTransactionAlreadyExists.status==="FAILED"){
            return res.status(500).json({
                message:"Previous transaction attempt failed, retrying",
                transaction:isTransactionAlreadyExists
            })
        }
        if(isTransactionAlreadyExists.status==="REVERSED"){
            return res.status(500).json({
                message:"Transaction was reversed, retrying",
                transaction:isTransactionAlreadyExists
            })
        }

    }

    /**
     * 3.Check account status
     */
    
    if(fromUserAccount.status!=="ACTIVE" || toUserAccount.status!=="ACTIVE"){
        return res.status(400).json({
            message:"Both accounts must be active to process transaction"
        })
    }
    /**
     * 4.Derive sender ablance from ledger
     */
    const balance=await fromUserAccount.getBalance()
    if(balance<amount){
        return res.status(400).json({
            message:`Insufficient balance.Current balance is ${balance}.Requested amount is ${amount}.`
        })
    }
     /**
      * 5.Create transaction with pending status
      */
     const session=await mongoose.startSession()
     session.startTransaction()

     const transaction=new transactionModel({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
     })

     const debitLedgerEntry=await ledgerModel.create([{
        account:fromAccount,
        type:"DEBIT",
        amount,
        transaction:transaction._id
     }],{session})   

        const creditLedgerEntry=await ledgerModel.create([{  
        account:toAccount,
        type:"CREDIT",
        amount,
        transaction:transaction._id
     }],{session})

        transaction.status="COMPLETED"
        await transaction.save({session})

        await session.commitTransaction()
        session.endSession()

 /**
  * 10.Send email notification
  */
  await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)

    return res.status(201).json({
        message: "Transaction completed successfully",
        transaction: transaction
    })
}

async function createInitialFundsTransaction(req,res){
        const { toAccount, amount, idempotencyKey } = req.body;
        if(!toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({
                message: "All fields are required"
            })
         }
            const toUserAccount = await accountModel.findOne({
                _id: toAccount,
            })
            if(!toUserAccount){
                return res.status(400).json({
                    message:"Invalid destination account"
                })
            }
            const fromUserAccount = await accountModel.findOne({
                systemUser:true,
                user:req.user._id
            })
            if(!fromUserAccount){
                return res.status(400).json({
                    message:"System user account not found"
                })
            }
            const session=await mongoose.startSession()
            session.startTransaction()
            const transaction=new transactionModel({
                fromAccount:fromUserAccount._id,
                toAccount,
                amount,
                idempotencyKey,
                status:"PENDING"
                })

            const debitLedgerEntry=await ledgerModel.create( [{
                account:fromUserAccount._id,
                type:"DEBIT",
                amount,
                transaction:transaction._id
             }],{session})

            const creditLedgerEntry=await ledgerModel.create( [{
                account:toAccount,
                type:"CREDIT",
                amount,
                transaction:transaction._id
             }],{session})

                transaction.status="COMPLETED"
                await transaction.save({session})

                await session.commitTransaction()
                session.endSession()

                return res.status(201).json({
                    message:"Initial funds transaction completed successfully",
                    transaction
                })

}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}