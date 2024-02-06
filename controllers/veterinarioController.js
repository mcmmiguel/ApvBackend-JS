import Veterinario from "../models/Veterinario.js";

export const registrar = async (req, res) => {
    // const { nombre, email, password } = req.body;

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
