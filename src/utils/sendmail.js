import nodemailer from 'nodemailer'



export const sendMail = (email,link) => {
try {
    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
            auth: {
                user: "tech2dom@gmail.com",
                pass: "joalyadockftpazl"
            }
    })

    let details = {
        from: "tech2dom@gmail.com",
        to: email,
        subject: "test account",
        html: `
        <div style='
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 300px;
        width: 400px
        '>
        <h1 style='color: blue; font-size= 30px'>Reset Password</h1>
    <a href=${link} style='
    text-decoration: none;
    '><button style='
       width: 170px;
       height: 50px;
       border-radius: 10px;
       border: none;
    '>
       click on link to reset password 👌👍
    </button></a>
        </div>
        `
    }

 mailTransporter.sendMail(details,(err) => {
        if(err) {
           throw new Error(err)
        }else {
            console.log('email sent')
        }
    })
} catch (error) {
    throw new Error(error)
    
}
}