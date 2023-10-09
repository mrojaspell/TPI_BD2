const express = require('express');
const app = express();
const PORT = 8080
const pool = require('./db')

// Aplicamos Json middleware: convierte el body de las request a JSON
app.use(express.json())

// = - = - = - = - = Codigos de errores = - = - = - = - =

const ClientCodes = {
    InvalidIdType: [1, 'Tipo invalido de: nro_cliente. Tipo esperado: integer.'],
    InvalidNameType: [2, 'Tipo invalido de: nombre. Tipo esperado: string.'],
    InvalidNameLength: [3, 'Longitud invalida de: nombre. Longitud maxima: 44.'],
    InvalidSurnameType: [4, 'Tipo invalido de: apellido. Tipo esperado: string.'],
    InvalidSurnameLength: [5, 'Longitud invalida de: apellido. Longitud maxima: 44.'],
    InvalidAddressType: [6, 'Tipo invalido de: direccion. Tipo esperado: string.'],
    InvalidAddressLength: [7, 'Longitud invalida de: direccion. Longitud maxima: 44.'],
    InvalidActiveType: [8, 'Tipo invalido de: activo. Tipo esperado: integer {0, 1}.'],
    Valid: [9, 'Entrada valida.']
}
const ProductCodes = {
    InvalidIdType: [1, 'Tipo invalido de: codigo_producto. Tipo esperado: integer.'],
    InvalidNameType: [2, 'Tipo invalido de: nombre. Tipo esperado: string.'],
    InvalidNameLength: [3, 'Longitud invalida de: nombre. Longitud maxima: 44.'],
    InvalidBrandType: [4, 'Tipo invalido de: marca. Tipo esperado: string.'],
    InvalidBrandLength: [5, 'Longitud invalida de: marca. Longitud maxima: 44.'],
    InvalidDescriptionType: [6, 'Tipo invalido de: descripcion. Tipo esperado: string.'],
    InvalidDescriptionLength: [7, 'Longitud invalida de: descripcion. Longitud maxima: 44.'],
    InvalidPriceType: [8, 'Tipo invalido de: precio. Tipo esperado: float.'],
    InvalidStockType: [9, 'Tipo invalido de: stock. Tipo esperado: integer.'],
    Valid: [10, 'Entrada valida.']
}
const MESSAGE = 1
const CODE = 0

// = - = - = - = - = Funciones de validacion = - = - = - = - =

function validate_client(body){
    if(typeof(body['nro_cliente']) !== 'number' || body['nro_cliente'] % 1 !== 0){
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

 function validate_product(body){
    if(typeof(body['codigo_producto']) !== 'number' || body['codigo_producto'] % 1 !== 0){
        return ProductCodes.InvalidIdType;
    }
    if(typeof(body['marca']) !== 'string'){
        return ProductCodes.InvalidBrandType;
    }
    if(body['marca'].length > 44){
        return ProductCodes.InvalidBrandLength;
    }
    if(typeof(body['nombre']) !== 'string'){
        return ProductCodes.InvalidNameType;
    }
    if(body['nombre'].length > 44){
        return ProductCodes.InvalidNameLength;
    }
    if(typeof(body['descripcion']) !== 'string'){
        return ProductCodes.InvalidDescriptionType;
    }
    if(body['descripcion'].length > 44){
        return ProductCodes.InvalidDescriptionLength;
    }
    if(typeof(body['precio']) !== 'number'){
        return ProductCodes.InvalidPriceType;
    }
    if(typeof(body['stock']) !== 'number' || body['stock'] % 1 !== 0){
        return ProductCodes.InvalidStockType;
    }
    return ProductCodes.Valid;
 }

// = - = - = - = - = Metodos de API = - = - = - = - =

// Get all clients
app.get('/clientes', async(req, res) => {
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
// Get client
app.get('clientes/:id', async (req, res) => {
    try{
        const { id } = req.params
        const values = await pool.query(
            'SELECT * FROM e01_cliente WHERE nro_cliente = $1', [
                id
            ]
        )
        if(values.rowCount === 1){
            res.json(values.rows[0])
        }
        else{
            res.status(400).send({respuesta: `nro_cliente: ${id} es invalido.`})
        }

    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})


// Delete client
app.delete('/clientes/:id', async (req, res) => {
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
// Create client
app.post('/clientes', async (req, res) => {
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

// Update client
app.put('/clientes/:id', async (req, res) => {
    try {
        const { id }  = req.params
        req.body["nro_cliente"] = parseInt(id)
        const input_check = validate_client(req.body)

        if(input_check === ClientCodes.Valid){
            const resp = await pool.query(
                'UPDATE e01_cliente SET nombre = $2, apellido = $3, direccion = $4, activo = $5 WHERE nro_cliente = $1',
                [id, req.body['nombre'], req.body['apellido'], req.body['direccion'], req.body['activo']]
            )
            if(resp.rowCount === 1){
                res.status(200).send({respuesta: `Cliente: ${id} actualizado.`})
            }
            else{
                res.status(400).send({respuesta: `nro_cliente: ${id} es invalido.`})
            }
        }
        else{
            res.status(400).send({respuesta: input_check[MESSAGE]})
        }
    }
    catch (e) {
        console.log(e)
        res.status(400).send({respuesta: e.detail})  // TODO: cambiar esto  
    }
    
})

// Create product
app.post('/productos', async (req, res) => {
    try{
        const input_check = validate_product(req.body)

        if(input_check === ProductCodes.Valid){
            await pool.query(
                'INSERT INTO e01_producto(codigo_producto, marca, nombre, descripcion, precio, stock) VALUES ($1, $2, $3, $4, $5, $6)',
                [req.body['codigo_producto'], req.body['marca'], req.body['nombre'], req.body['descripcion'], req.body['precio'], req.body['stock']]
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

// Update product
app.put('/productos/:id', async (req, res) => {
    try{
        const { id } = req.params
        req.body["codigo_producto"] = parseInt(id)

        const input_check = validate_product(req.body)

        if(input_check === ProductCodes.Valid){
            const resp = await pool.query(
                'UPDATE e01_producto SET marca = $2, nombre = $3, descripcion = $4, precio = $5, stock = $6 WHERE codigo_producto = $1',
                [id, req.body['marca'], req.body['nombre'], req.body['descripcion'], req.body['precio'], req.body['stock']]
            )
            if(resp.rowCount === 1){
                res.status(200).send({respuesta: `Producto: ${id} actualizado.`})
            }
            else{
                res.status(400).send({respuesta: `codigo_producto: ${id} es invalido.`})
            }
        }
        else{
            res.status(400).send({respuesta: input_check[MESSAGE]})
        }
    }
    catch (e) {
        console.log(e)
        res.status(400).send({respuesta: e.detail})  // TODO: cambiar esto
    }
})

//  = - = - = - = - = Inicio el servidor = - = - = - = - =
app.listen(
    PORT,
    () => {console.log(`Server running at: http://localhost:${PORT}`)}
)