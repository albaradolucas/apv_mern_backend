// Libraries
import express from "express";
import dotenv from "dotenv";
import cors from 'cors'

// Components
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from './routes/pacienteRoutes.js'

const app = express();
app.use(express.json())

dotenv.config();
conectarDB();

const dominiosPermitios = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitios.indexOf(origin) !== -1 ) {
            // El origen del request está permitido
            callback(null, true) // <-- Primer parámetro es un error null (no error), segundo, le permite la conexión
        }
        else {
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions))

app.use("/api/veterinarios", veterinarioRoutes);
app.use("/api/pacientes", pacienteRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`servidor funcionando en el puerto ${PORT}`);
});
