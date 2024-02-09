import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {
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
        subject: 'Reestablece tu contraseña',
        text: 'Reestablece tu contraseña',
        html: `<p>Hola: ${nombre}. Has solicitado reestablecer tu contraseña en APV.</p>
                <p>Sigue el siguiente enlace para generar una nueva contraseña:
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer contraseña</a>
                </p>

                <p>Si no has creado una cuenta en APV, puedes ignorar este correo.</p>
        `

    })
    console.log("Mensaje enviado: %s", info.messageId);

}

export default emailOlvidePassword;