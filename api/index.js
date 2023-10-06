const express = require('express');
const app = express();
const PORT = 8080
const pool = require("./db")

// Aplicamos Json middleware: convierte el body de las request a JSON
app.use(express.json())


// Metodos de API
app.get("/clients", async(req, res) => {
    try{
        const values = await pool.query(
            "SELECT * FROM e01_cliente"
        );

        res.json(values.rows)

    } catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Inicio el servidor
app.listen(
    PORT,
    () => {console.log(`Server running at: http://localhost:${PORT}`)}
)