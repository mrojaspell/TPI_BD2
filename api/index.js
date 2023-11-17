const express = require('express');
const app = express();

const config = require('./config.json')
const getClient = require('./db')

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
    InvalidTelephoneArray: [10, 'Tipo invalido de: telefonos. Tipo esperado: arreglo de objetos.'],
    InvalidTelephoneContact: [11, 'Tipo invalido de: telefono. Tipo esperado: objeto con codigo_area, num_telefono, tipo.'],
    InvalidTelephoneContactType: [12, 'Tipo invalido de: dato de contacto. Tipo esperado: codigo_area: integer, num_telefono: integer, tipo: char.'],
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

// = - = - = - = - = Funciones de validación = - = - = - = - =

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
    if(typeof(body['activo']) !== 'number'){
        return ClientCodes.InvalidActiveType;
    }
    // Chequear 'telefonos' del cuerpo del json
    if (body['telefonos'] != undefined && !Array.isArray(body['telefonos'])) {
        // Hay un error
        return ClientCodes.InvalidTelephoneArray;
    } else if(body['telefonos'] != undefined){
        // Leemos los datos de 'telefonos'
        for (const telefono of body['telefonos']) {
            if (typeof telefono !== 'object' || telefono === null) {
                // Error en los datos de 'telefono'
                return ClientCodes.InvalidTelephoneContact;
            }
            // Chequear por correcta estructura de 'telefonos'
            if (
                telefono['codigo_area'] === undefined ||
                telefono['nro_telefono'] === undefined ||
                telefono['tipo'] === undefined
            ) {
                // Error en los datos de 'telefono'
                return ClientCodes.InvalidTelephoneContact;
            }
            
            // Chequear los tipos de datos de 'telefono'
            if (
                typeof telefono['codigo_area'] !== 'number' ||
                typeof telefono['nro_telefono'] !== 'number' ||
                typeof telefono['tipo'] !== 'string' ||
                telefono['tipo'].length !== 1
            ) {
                // Error en los tipos de datos de 'telefono'
                return ClientCodes.InvalidTelephoneContactType;
            }
        }
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

function extract_cliente(rows){
    const clients = {};
    for(let row of rows){
        if(!(row.nro_cliente in clients)){
            clients[row.nro_cliente] = {
                'nro_cliente': row.nro_cliente,
                'nombre': row.nombre,
                'apellido': row.apellido,
                'direccion': row.direccion,
                'activo': row.activo,
                'telefonos': []
            };
        }
        if(row.nro_telefono !== null){
            clients[row.nro_cliente]['telefonos'].push({
                'nro_telefono': row.nro_telefono,
                'codigo_area': row.codigo_area,
                'tipo': row.tipo
            });
        }
    }
    return clients;
}

// = - = - = - = - = Metodos de API = - = - = - = - =

// Ver todos los clientes
app.get('/clientes', async(req, res) => {
    const client = await getClient()

    try{
        if(config["database"] === "postgres"){

            const values = await client.query(
                'SELECT * FROM e01_cliente c LEFT JOIN e01_telefono t ON c.nro_cliente = t.nro_cliente'
            );

            res.json(extract_cliente(values.rows))

        }else if(config["database"] === "mongodb"){
            const values = await client.collection("cliente").find({}, {projection: {_id: 0, nro_cliente: 1, nombre: 1, apellido: 1, direccion: 1, activo: 1, telefonos: 1}}).toArray();
            res.json(values)
        }
    } catch (e) {
        console.error(e)
        res.status(500).send()
    }
})
// Ver un cliente
app.get('/clientes/:id', async (req, res) => {
    const client = await getClient()
    try{
        if(config["database"] === "postgres"){
            const { id } = req.params
            const values = await client.query(
                'SELECT * FROM e01_cliente WHERE nro_cliente = $1', [
                    id
                ]
            );
            if(values.rowCount === 1){
                res.json(values.rows[0])
            }
            else{
                res.status(400).send({respuesta: `nro_cliente: ${id} es invalido.`})
            }

        }else if(config["database"] === "mongodb"){
            const { id } = req.params
            const values = await client.collection("cliente").find({nro_cliente: Number(id)}, {projection: {_id: 0, nro_cliente: 1, nombre: 1, apellido: 1, direccion: 1, activo: 1, telefonos: 1}}).toArray();
            if( values.length === 1){
                res.json(values[0])
            }else{
                res.status(400).send({respuesta: `nro_cliente: ${id} es invalido.`})
            }
            
        }
    } catch (e) {
        console.error(e)
        res.status(500).send()
    }
})


// Baja de cliente
app.delete('/clientes/:id', async (req, res) => {
    const client = await getClient()
    const { id } = req.params
    try{
        if( config["database"] === "postgres"){
            await client.query('DELETE FROM e01_telefono WHERE nro_cliente = $1', [id])
            const resp = await client.query(
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
        }else if( config["database"] === "mongodb"){
            const resp = await client.collection("cliente").deleteOne({nro_cliente: Number(id)})
            if( resp["deletedCount"] === 1){
                res.status(200).send({respuesta: `Cliente: ${id} eliminado.`})
            }else{
                res.status(400).send({respuesta: `nro_cliente: ${id} es invalido.`})
            }
        }
    } catch (e) {
        console.error(e)
        res.status(400).send({respuesta: e.detail})  // TODO: cambiar esto
    }
})
// Alta de un cliente
app.post('/clientes', async (req, res) => {
    const client = await getClient()
    try{
        const input_check = validate_client(req.body)
        if(input_check === ClientCodes.Valid){
            if(config["database"] === "postgres"){
                await client.query(
                    'INSERT INTO e01_cliente(nro_cliente, nombre, apellido, direccion, activo) VALUES ($1, $2, $3, $4, $5)',
                    [req.body['nro_cliente'], req.body['nombre'], req.body['apellido'], req.body['direccion'], req.body['activo']]
                )
                if( req.body['telefonos'] !== undefined){
                    for (const telefono of req.body['telefonos']) {
                        await client.query(
                            'INSERT INTO e01_telefono(codigo_area, nro_telefono, tipo, nro_cliente) VALUES ($1, $2, $3, $4)',
                            [telefono['codigo_area'], telefono['nro_telefono'], telefono['tipo'], req.body['nro_cliente']]
                        )
                    }
                }
                res.status(200).send({respuesta: req.body})
            }else if(config["database"] === "mongodb"){
                await client.collection("cliente").insertOne(req.body)
                res.status(200).send({respuesta: req.body})
                //TODO - Como informar que no se pudo insertar?
            }
        }else{
            res.status(400).send({respuesta: input_check[MESSAGE]})
        }        
    } catch (e) {
        console.error(e)
        //codigo de error para duplicate key de mongo
        if( e.code === 11000){
            res.status(400).send({respuesta: `Cliente con nro_cliente: ${req.body['nro_cliente']} ya existe.`})
        }
        res.status(400).send({respuesta: e.detail})  // TODO: cambiar esto
    }
})

// Modificación de un cliente
app.put('/clientes/:id', async (req, res) => {
    const client = await getClient()
    try {
        const { id }  = req.params
        req.body["nro_cliente"] = parseInt(id)
        const input_check = validate_client(req.body)

        if(input_check === ClientCodes.Valid){
            if(config["database"] === "postgres"){
                const resp = await client.query(
                    'UPDATE e01_cliente SET nombre = $2, apellido = $3, direccion = $4, activo = $5 WHERE nro_cliente = $1',
                    [id, req.body['nombre'], req.body['apellido'], req.body['direccion'], req.body['activo']]
                )
                await client.query('DELETE FROM e01_telefono WHERE nro_cliente = $1', [id])
                if( req.body['telefonos'] !== undefined){
                    for (const telefono of req.body['telefonos']) {
                        await client.query(
                            'INSERT INTO e01_telefono(codigo_area, nro_telefono, tipo, nro_cliente) VALUES ($1, $2, $3, $4)',
                            [telefono['codigo_area'], telefono['nro_telefono'], telefono['tipo'], req.body['nro_cliente']]
                        )
                    }
                }
                if(resp.rowCount === 1){
                    res.status(200).send({respuesta: `Cliente: ${id} actualizado.`})
                }
                else{
                    res.status(400).send({respuesta: `nro_cliente: ${id} es invalido o no se modifico.`})
                }
            }else if(config["database"] === "mongodb"){
                const resp = await client.collection("cliente").updateOne({nro_cliente: Number(id)}, {$set: req.body})
                if(resp["modifiedCount"] === 1){
                    res.status(200).send({respuesta: `Cliente: ${id} actualizado.`})
                }else{
                    //puede entrar aca porque no se modifico nada o porque no encontro el cliente
                    res.status(400).send({respuesta: `Cliente con nro_cliente: ${id} no existe o no se actualizo.`})
                }
            }
        }
        else{
            res.status(400).send({respuesta: input_check[MESSAGE]})
        }
    }
    catch (e) {
        console.error(e)
        res.status(400).send({respuesta: e.detail})  // TODO: cambiar esto  
    }
    
})

// Alta de un producto
app.post('/productos', async (req, res) => {
    const client = await getClient()
    try{
        const input_check = validate_product(req.body)

        if(input_check === ProductCodes.Valid){
            if(config["database"] === "postgres"){
                await client.query(
                    'INSERT INTO e01_producto(codigo_producto, marca, nombre, descripcion, precio, stock) VALUES ($1, $2, $3, $4, $5, $6)',
                    [req.body['codigo_producto'], req.body['marca'], req.body['nombre'], req.body['descripcion'], req.body['precio'], req.body['stock']]
                )
                res.status(200).send({respuesta: req.body})
            }else if(config["database"] === "mongodb"){
                await client.collection("producto").insertOne(req.body)
                res.status(200).send({respuesta: req.body})
                //TODO - Como informar que no se pudo insertar por que ya existe uno con ese codigo?
            }
        }
        else{
            res.status(400).send({respuesta: input_check[MESSAGE]})
        }
    } catch (e) {
        console.error(e)
        //codigo de error para duplicate key de mongo
        if( e.code === 11000){
            res.status(400).send({respuesta: `Producto con codigo_producto: ${req.body['codigo_producto']} ya existe.`})
        }
        res.status(400).send({respuesta: e.detail})  // TODO: cambiar esto
    }
})

// Modificación de un producto
app.put('/productos/:id', async (req, res) => {
    const client = await getClient()
    try{
        const { id } = req.params
        req.body["codigo_producto"] = parseInt(id)

        const input_check = validate_product(req.body)

        if(input_check === ProductCodes.Valid){
            if(config["database"] === "postgres"){
                const resp = await client.query(
                    'UPDATE e01_producto SET marca = $2, nombre = $3, descripcion = $4, precio = $5, stock = $6 WHERE codigo_producto = $1',
                    [id, req.body['marca'], req.body['nombre'], req.body['descripcion'], req.body['precio'], req.body['stock']]
                )
                if(resp.rowCount === 1){
                    res.status(200).send({respuesta: `Producto: ${id} actualizado.`})
                }
                else{
                    res.status(400).send({respuesta: `codigo_producto: ${id} es invalido.`})
                }
            }else if(config["database"] === "mongodb"){
                const resp = await client.collection("producto").updateOne({codigo_producto: Number(id)}, {$set: req.body})
                if(resp["modifiedCount"] === 1){
                    res.status(200).send({respuesta: `Producto: ${id} actualizado.`})
                }else{
                    res.status(400).send({respuesta: `Producto con codigo_producto: ${id} no existe o no se actualizo.`})
                }
            }
        }
        else{
            res.status(400).send({respuesta: input_check[MESSAGE]})
        }
    }
    catch (e) {
        console.error(e)
        res.status(400).send({respuesta: e.detail})  // TODO: cambiar esto
    }
})

//  = - = - = - = - = Inicio el servidor = - = - = - = - =
app.listen(
    config['port'],
    () => {console.log(`Server running at: http://localhost:${config['port']}`)}
)