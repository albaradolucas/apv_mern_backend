import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    const { email, nombre } = req.body;

    // Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({ email });

    if (existeUsuario) {
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // Enviar el email <-- Buen lugar dps de guardar el nuevo usuario, por el await, en caso de que haya algún problema
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token,
        });

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }
};

const perfil = (req, res) => {
    const { veterinario } = req;

    res.json(veterinario);
};

const confirmar = async (req, res) => {
    const { token } = req.params;
    const usuarioConfirmar = await Veterinario.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error("Token no válido");
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({ msg: "Usuario confirmado correctamente" });
    } catch (error) {
        console.log(error);
    }
};

// funcion para autenticar usuarios
const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({ email });

    if (!usuario) {
        const error = new Error("El usuario no existe");
        res.status(403).json({ msg: error.message });
    }

    // Comprobrar si el usuario está confirmado
    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada aún");
        res.status(403).json({ msg: error.message });
    }

    // Revisar el password
    if (await usuario.comprobarPassword(password)) {
        // Autenticar al usuario
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
        });
    } else {
        const error = new Error("Tu contraseña es incorrecta");
        res.status(403).json({ msg: error.message });
    }

    // res.json({msg: 'autenticando'})
};

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const existeVeterinario = await Veterinario.findOne({ email });

    if (!existeVeterinario) {
        const error = new Error("El usuario no existe");
        return res.status(400).json({ msg: error.message });
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        // Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,
        });

        res.json({ msg: "Email enviado correctamente" });
    } catch (error) {
        console.log(error);
    }
};

const comprobrarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Veterinario.findOne({ token });

    if (tokenValido) {
        // El token es valido = el usuario existe
        res.json({ msg: "Token válido y el usuario existe" });
    } else {
        const error = new Error("Token no válido");
        return res.status(400).json({ msg: error.message });
    }
};

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const veterinario = await Veterinario.findOne({ token });

    if (!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;

        await veterinario.save();
        res.json({ msg: "Contraseña modificado correctamente" });
    } catch (error) {
        console.log(error);
    }
};

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);

    if (!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({ msg: error.message });
    }

    const { email } = req.body;

    if (veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({ email });
        if (existeEmail) {
            const error = new Error(
                "Ese email ya está registrado, intenta con otro"
            );
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.telefono = req.body.telefono;
        veterinario.web = req.body.web;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error);
    }
};

const actualizarPassword = async (req, res) => {
    // leer los datos
    const { id } = req.veterinario;
    const { pwd, newpwd } = req.body;
    // comprobar que existe
    const veterinario = await Veterinario.findById(id);

    if (!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({ msg: error.message });
    }
    // comprobar el password
    if (await veterinario.comprobarPassword(pwd)) {
        // almacenar nuevo password
        veterinario.password = newpwd;
        await veterinario.save();
        res.json({ msg: "Contraseña almacenada correctamente" });
    } else {
        const error = new Error("Contraseña Actual incorrecta");
        return res.status(400).json({ msg: error.message });
    }

    // almacenar el nuevo password
};

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobrarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword,
};
