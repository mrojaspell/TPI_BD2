const express = require('express');
const app = express();
const PORT = 8080
const pool = require('./db')

// Aplicamos Json middleware: convierte el body de las request a JSON
app.use(express.json())

const ClientCodes = {
    InvalidIdType: [1, 'Tipo invalido de: nro_cliente. Tipo esperado: integer.'],
    InvalidNameType: [2, 'Tipo invalid de: nombre. Tipo esperado: string.'],
    InvalidNameLength: [3, 'Longitud invalid de: nombre. Longitud maxima: 44.'],
    InvalidSurnameType: [4, 'Tipo invalid de: apellido. Tipo esperado: string.'],
    InvalidSurnameLength: [5, 'Longitud invalid de: apellido. Longitud maxima: 44.'],
    InvalidAddressType: [6, 'Tipo invalid de: direccion. Tipo esperado: string.'],
    InvalidAddressLength: [7, 'Longitud invalid de: direccion. Longitud maxima: 44.'],
    InvalidActiveType: [8, 'Tipo invalid de: activo. Tipo esperado: integer {0, 1}.'],
    Valid: [9, 'Entrada valida.']
}
const MESSAGE = 1
const CODE = 0

function validate_client(body){
    if(typeof(body['nro_cliente']) !== 'number'){
        return ClientCodes.InvalidIdType;
    }
    if(typeof(body['nombre']) !== 'string'){
        return ClientCodes.InvalidNameType;
    }
    if(body['nombre'].length > 44){
        return ClientCodes.InvalidNameLength;
    }
    if(typeof(body['apellido']) !== 'string'){
        return ClientCodes.InvalidSurnameType;
    }
    if(body['apellido'].length > 44){
        return ClientCodes.InvalidSurnameLength;
    }
    if(typeof(body['direccion']) !== 'string'){
        return ClientCodes.InvalidAddressType;
    }
    if(body['direccion'].length > 44){
        return ClientCodes.InvalidAddressLength;
    }
    if(typeof(body['activo']) !== 'number' || (body['activo'] !== 0 && body['activo'] !== 1)){
        return ClientCodes.InvalidActiveType;
    }
    return ClientCodes.Valid;
}


// Metodos de API
app.get('/clients', async(req, res) => {
    try{
        const values = await pool.query(
            'SELECT * FROM e01_cliente'
        );

        res.json(values.rows)

    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

app.delete('/clients/:id', async (req, res) => {
    try{
        const { id } = req.params
        const resp = await pool.query(
            'DELETE FROM e01_cliente WHERE nro_cliente = $1', [
                id
            ]
        )
        if(resp.rowCount === 1){
            res.status(200).send({respuesta: `Cliente: ${id} eliminado.`})
        }
        else{
            res.status(400).send({respuesta: `nro_cliente: ${id} es invalido.`})
        }

    } catch (e) {
        console.log(e)
        res.status(400).send({respuesta: e.detail})  // TODO: cambiar esto
    }
})

app.post('/clients', async (req, res) => {
    try{
        const input_check = validate_client(req.body)

        if(input_check === ClientCodes.Valid){
            await pool.query(
                'INSERT INTO e01_cliente(nro_cliente, nombre, apellido, direccion, activo) VALUES ($1, $2, $3, $4, $5)',
                [req.body['nro_cliente'], req.body['nombre'], req.body['apellido'], req.body['direccion'], req.body['activo']]
            )
            res.status(200).send({respuesta: req.body})
        }
        else{
            res.status(400).send({respuesta: input_check[MESSAGE]})
        }
    } catch (e) {
        console.log(e)
        res.status(400).send({respuesta: e.detail})  // TODO: cambiar esto
    }
})



// Inicio el servidor
app.listen(
    PORT,
    () => {console.log(`Server running at: http://localhost:${PORT}`)}
)