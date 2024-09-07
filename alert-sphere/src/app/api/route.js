import nodemailer from 'nodemailer';
import {createClient} from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;



const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: SMTP_SERVER_HOST,
    port: 587,
    secure: true,
    auth: {
        user: SMTP_SERVER_USERNAME,
        pass: SMTP_SERVER_PASSWORD,
    },
});

export async function sendMail({
                                   email,
                                   sendTo,
                                   subject,
                                   text,
                                   html,
                               }) {
    try {
        const isVerified = await transporter.verify();
    } catch (error) {
        console.error('Something Went Wrong', SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD, error);
        return;
    }
    const info = await transporter.sendMail({
        from: email,
        to: sendTo || SITE_MAIL_RECIEVER,
        subject: subject,
        text: text,
        html: html ? html : '',
    });
    console.log('Message Sent', info.messageId);
    console.log('Mail sent to', SITE_MAIL_RECIEVER);
    return info;
}

// notes: get emails from contacts (sendTo), subject: fixed
const mail = "mananman23@gmail.com";
var sub = "Alert Sphere: Disaster Alert"
var text = "Hello, This is an alert from Alert Sphere. We have detected a disaster in your area. Please check the app for more information."

async function idk() {
    const { contacts, error_c } = await supabase.from("contacts").select();
    const { warnings, error_w } = await supabase.from("warnings").select();

    if (error_c || error_w) {
        console.error("Error fetching data from database");
        return;
    }

    const mails_to = [];
    for (let i = 0; i < contacts.length; i++) {
        mails_to.push(contacts[i].email);
    }
for (let i = 0; i < mails_to.length; i++) {
    const mmm = mails_to[i].email;
sendMail({mail, mmm, sub, text}).then(r => console.log(r)).catch(e => console.error(e))
}

}

