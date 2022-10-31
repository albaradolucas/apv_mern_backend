import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const { email, nombre, token } = datos

    // Enviar el email
    const info = await transporter.sendMail({
        from: 'APV - Administrador de Pacientes de Veterinaria',
        to: email,
        subject: 'Comprueba tu cuenta en APV',
        text: 'Hola! Este mail es para que puedas confimar tu cuenta, no te olvides de hacerlo para acceder a todas las funcionalidades de nuestro Administrador de Pacientes de Veterinaria (APV)',
        html: 
            `
                <h2>Hola ${nombre}!</h2>
                <p>Estamos felices de verte en APV - Administrador de Pacientes de Veterinaria!</p>
                <p>
                    Tu cuenta ya casi está lista! Necesitamos validarla, para eso, compruébala en el siguiete enlace:
                    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
                </p>
                <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>
            `
    })
};

export default emailRegistro;
