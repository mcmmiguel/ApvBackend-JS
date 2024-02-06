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
        const veterinarioGuardado = await veterinario.save()

        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error);
    }

};

export const perfil = (req, res) => {
    res.send({ msg: 'Mostrando perfil' })
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
