
const checkAuth = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        console.log('Sí tiene el token con BEARER');
    }

    const error = new Error('Token no válido o inexistente');
    res.status(403).json({ msg: error.message });

    next();
};

export default checkAuth;