import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
import emailRegistro from "../helpers/emailRegistro.js";
import generarId from "../helpers/generarId.js";
import { generarJWT } from "../helpers/generarJWT.js";
import Veterinario from "../models/Veterinario.js";

export const registrar = async (req, res) => {
    const { nombre, email, password } = req.body;

    // Prevenir o revisar si un usuario ya está registrado
    const existeUsuario = await Veterinario.findOne({ email });

    if (existeUsuario) {
        console.log('Existe usuario');
        const error = new Error('El email ya se encuentra registrado')
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // Enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token,
        });

        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error);
    }

};

export const perfil = (req, res) => {
    const { veterinario } = req
    res.json(veterinario)
};

export const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;

        await usuarioConfirmar.save();

        res.json({ msg: '¡Usuario confirmado exitosamente!' });
    } catch (error) {
        console.log(error);
    }
}

export const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({ email });

    if (!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(403).json({ msg: error.message });
    }

    // Comprobar si el usuario está confirmado
    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    // Revisar el password
    if (await usuario.comprobarPassword(password)) {
        // Autenticar
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
        });
    } else {
        const error = new Error('Password incorrecto');
        return res.status(403).json({ msg: error.message });
    }

}

export const olvidePassword = async (req, res) => {
    const { email, nombre, token } = req.body;

    const existeVeterinario = await Veterinario.findOne({ email });

    if (!existeVeterinario) {
        const error = new Error('El usuario no existe')
        return res.status(400).json({ msg: error.message });
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        // Envio de email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        });

        res.json({ msg: 'Se ha enviado un email con las instrucciones' });
    } catch (error) {
        console.log(error);
    }

}

export const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({ token });

    if (tokenValido) {
        // El token es valido, el usuario existe
        res.json({ msg: 'Token valido. El usuario existe' });

    } else {
        const error = new Error('Token no valido');
        return res.status(400).json({ msg: error.message });
    }
}

export const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });

    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: 'Password modificado correctamente' });
    } catch (error) {
        console.log(error);
    }
}

export const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    const { email } = req.body;
    if (veterinario.email !== req.body.email) {
        const existeEmail = await veterinario.findOne({ email });

        if (existeEmail) {
            const error = new Error('El email ingresado ya se encuentra en uso');
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error);
    }
}

export const actualizarPassword = async (req, res) => {
    // Leer los datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;


    // Comprobar que el veterinario exista
    const veterinario = await Veterinario.findById(id);
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    // Comprobar su password
    if (await veterinario.comprobarPassword(pwd_actual)) {
        // Almacenar el nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({ msg: 'Password almacenado correctamente' })

    } else {
        const error = new Error('Contraseña actual incorrecta');
        return res.status(400).json({ msg: error.message });
    }

    // Almacenar el nuevo password


}