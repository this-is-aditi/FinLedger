const express=require("express")
const authMiddleware=require("../middleware/auth.middleware")
const accountController=require("../controllers/account.controller")

const router=express.Router()

/**
 * -POST/API/accounts
 * -Create a new account
 * -Protected route
 */
router.post("/",authMiddleware.authMiddleware,accountController.createAccountController)

/**
 * -Get all accounts of logged in user
 * -GET/api/accounts
 * -Protected route
 */
router.get("/",authMiddleware.authMiddleware,accountController.getUserAccountsController)
/**
 * -GET/api/accounts/balance
 */
router.get("/balance/:accountId",authMiddleware.authMiddleware,accountController.getAccountBalanceController)

module.exports=router