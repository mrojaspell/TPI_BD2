const Pool = require("pg").Pool;
const MongoClient = require('mongodb').MongoClient;

async function  migration(){
    const pool = new Pool({
        "user": "postgres",
        "password": "6mvRXM58J9",
        "host": "localhost",
        "port": "4321",
        "database": "postgres"
    })

    // Obtenemos los clientes

    const clientMap = {}
    const clientInfo = await pool.query(
        "SELECT * FROM e01_cliente c LEFT JOIN e01_telefono t ON c.nro_cliente = t.nro_cliente"
    )
    for(let info of clientInfo.rows){
        if( ! Object.hasOwn(clientMap, info['nro_cliente'])){
            clientMap[info['nro_cliente']] = {
                "nro_cliente": info['nro_cliente'],
                "nombre": info['nombre'],
                "apellido": info['apellido'],
                "direccion": info['direccion'],
                "activo": info['activo'],
                'telefonos': []
            }

            if(info['nro_telefono'] !== null){
                clientMap[info['nro_cliente']]['telefonos'].push({
                    'codigo_area': info['codigo_area'],
                    'nro_telefono': info['nro_telefono'],
                    'tipo': info['tipo']
                })
            }

        }else{
            if(info['nro_telefono'] !== null){
                clientMap[info['nro_cliente']]['telefonos'].push({
                    'codigo_area': info['codigo_area'],
                    'nro_telefono': info['nro_telefono'],
                    'tipo': info['tipo']
                })
            }
        }
    }
    const clientList = []
    clientList.push(...Object.values(clientMap))

   // Obtenemos las facturas
    const billMap = {}
    const billInfo = await pool.query(
        "SELECT * FROM e01_factura f LEFT JOIN e01_detalle_factura d on f.nro_factura = d.nro_factura"
    )
    for(let info of billInfo.rows){
        if( ! Object.hasOwn(billMap, info['nro_factura'])){
            billMap[info['nro_factura']] = {
                "nro_factura": info['nro_factura'],
                "fecha": info['fecha'],
                "total_sin_iva": info['total_sin_iva'],
                "iva": info['iva'],
                "total_con_iva": info['total_con_iva'],
                'detalles': []
            }
            if(info['nro_item'] !== null){
                billMap[info['nro_factura']]['detalles'].push({
                    'nro_item': info['nro_item'],
                    'cantidad': info['cantidad'],
                    'codigo_producto': info['codigo_producto']
                })
            }
        }else{
            billMap[info['nro_factura']]['detalles'].push({
                'nro_item': info['nro_item'],
                'cantidad': info['cantidad'],
                'codigo_producto': info['codigo_producto']
            })
        }
    }
    const billList = []
    billList.push(...Object.values(billMap))
    let accum = 0
    for(let elem of billList){
        accum += elem['detalles'].length
    }

    // Obtenemos los productos
    const productInfo = await pool.query(
        "SELECT * FROM e01_producto"
    )
    const productList = productInfo.rows

    // Replace the connection URL with your MongoDB server URL
    const url = 'mongodb://localhost:27017/';

    // Replace 'your_database_name' with your actual database name
    const dbName = 'Mymongo';

    // Connect to the MongoDB server
    const client = await MongoClient.connect(url);

    const db = client.db(dbName);
    
    await db.collection('cliente').insertMany(clientList)

    await db.collection('producto').insertMany(productList)
        
    await db.collection('factura').insertMany(billList)
    
    // Close the MongoDB connection when you're done
    client.close();
}

(async () => {
    await migration();
})();
