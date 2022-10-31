import express from "express";
import {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobrarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
} from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas área pública
router.post("/", registrar); // Registrar
router.get("/confirmar/:token", confirmar); // Routing dinámico :  // autenticar cuenta
router.post("/login", autenticar); // Iniciar sesión
router.post("/olvide-password", olvidePassword);
router
    .route("/olvide-password/:token")
    .get(comprobrarToken)
    .post(nuevoPassword);

// Rutas área privada
router.get("/perfil", checkAuth, perfil);
router.put("/perfil/:id", checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword)

export default router;
