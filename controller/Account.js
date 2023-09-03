import Account from '../model/Account.js'
import EmailService from '../service/EmailService.js'
import mongoose from 'mongoose'
export const getAllAccount = async (req, res) => {
  Account.find(
    {
      _id: { $ne: req.body._id },
    },
    (err, results) => {
      res.json(results)
    },
  )
}
export const getEveryAccount = async (req, res) => {
  Account.find((err, results) => {
    res.json(results)
  })
}
export const createAnAccount = async (req, res) => {
  const newAccount = new Account({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.username,
    password: req.body.password,
    email: req.body.email,
    group: [],
  })
  Account.create(newAccount, (err, account) => {
    res.json(newAccount)
  })
}
export const getAccount = async (req, res) => {
  Account.findOne(
    {
      email: req.body.email,
      password: req.body.password,
    },
    (err, account) => {
      res.json(account)
    },
  )
}
export const getAccountWithId = async (req, res) => {
  Account.findOne(
    {
      _id: req.params.Id,
    },
    (err, account) => {
      res.json(account)
    },
  )
}
export const forgotPassword = async (req, res) => {
  const account = await Account.findOne({ email: req.body.email })
  if (account !== null) {
    res.json(null)
    const randomString = Math.random().toString(36).slice(-8)
    await Account.findOneAndUpdate({ email: req.body.email }, { password: randomString })
    const bodyText = `Someone (hopefully you) has requested a password reset for your SiriBlogger account. Your new password: ${randomString}
    If you don't wish to reset your password, disregard this email and no action will be taken. SiriBlogger!! <3`
    EmailService({
      to: req.body.email,
      text: bodyText,
      from: 'SiriBlogger',
      subject: 'Generate new password for your email',
    })
  } else {
    res.json({ message: 'Account does not exist' })
  }
}
export const updateNewPassword = async (req, res) => {
  const account = await Account.findOneAndUpdate(
    {
      _id: req.body._id,
    },
    {
      password: req.body.password,
    },
    {
      new: true,
    },
  )
  if (account === null || account.password !== req.body.password)
    res.json({
      message: 'Cannot update new password',
    })
  else res.json(null)
}
