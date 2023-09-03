import nodemailer from 'nodemailer'
const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'thaiduynguyen.nt@gmail.com', // your email address
    pass: 'camhaltjdaaqnjao', // your password
  },
})
const EmailService = (emailAddress) => {
  transport.sendMail(emailAddress, (error, info) => {
    if (error) {
      console.error(error)
    } else {
      console.log(info)
    }
  })
}

export default EmailService
