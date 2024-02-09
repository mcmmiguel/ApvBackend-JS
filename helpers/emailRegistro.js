import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { nombre, email, token } = datos;

    // Enviar el email
    const info = await transporter.sendMail({
        from: 'APV - Administrador de pacientes de Veterinaria <apv@correo.com>',
        to: email,
        subject: 'Confirma tu cuenta en APV',
        text: 'Confirma tu cuenta en APV',
        html: `<p>Hola: ${nombre}. Confirma tu cuenta en APV.</p>
                <p>Tu cuenta se encuentra lista. Por favor, haz click en el siguiente enlace para confirmarla:
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar cuenta</a>
                </p>

                <p>Si no has creado una cuenta en APV, puedes ignorar este correo.</p>
        `

    })
    console.log("Mensaje enviado: %s", info.messageId);

}

export default emailRegistro;