import { Injectable } from '@nestjs/common';

import * as nodemailer from 'nodemailer'
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { User } from '../entities/user.entity';

@Injectable()
export class EmailService {
    private readonly transporter: nodemailer.Transporter<SentMessageInfo>;

    constructor(){
        this.transporter = nodemailer.createTransport({
           host: process.env.EMAIL_HOST,
           secure: true,
           auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }

        })
    }

    async sendEmail(to:string, subject: string,  user: User){
        const mailOptios = {
            from: 'Auth-app no@reply',
            to,
            subject,
            text:'VERIFICA TU USUARIO',
            html: `
               <p> Hola ${user.name}, </p>
               <p> Haz click en el siguiente enlace para verificar tu email</p>
               <a href='${process.env.FRONTEND_URL}/auth/verify-account/${user.tokenOneUse}'><h4>Verificar</h4></a>
               <p>Si tu no has solicitado este correo, puedes ignorarlo</p>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptios);
            console.log('Correo enviado con éxito')
        }catch (error){
            console.log ('Error al enviar el correo:', error)  
            throw error;
        }
    }
    async sendEmailForResetPassword(to:string, subject: string,  user: User){
        const mailOptios = {
            from: 'Auth-app no@reply',
            to,
            subject,
            text:'Restablece tu Contraseña',
            html: `
               <p> Hola ${user.name}, </p>
               <p> Haz click en el siguiente enlace para restablecer tu contraseña</p>
               <a href='${process.env.FRONTEND_URL}/auth/reset-password/${user.tokenOneUse}'><h4>Resetear Contraseña</h4></a>
               <p>Si tu no has solicitado este correo, puedes ignorarlo</p>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptios);
            console.log('Correo enviado con éxito')
        }catch (error){
            console.log ('Error al enviar el correo:', error)  
            throw error;
        }
    }
}
