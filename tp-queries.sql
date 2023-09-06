-- 1. Obtener el teléfono y el número de cliente del cliente con
-- nombre “Wanda” y apellido “Baker”.

SELECT T.nro_telefono, C.nro_cliente
FROM E01_TELEFONO T JOIN E01_CLIENTE C ON T.nro_cliente = C.nro_cliente
WHERE C.nombre = 'Wanda' AND C.apellido = 'Baker';

-- 2. Seleccionar todos los clientes que tengan registrada al menos una factura.
SELECT *
FROM e01_cliente
WHERE nro_cliente IN (SELECT nro_cliente
                      FROM e01_factura);

-- 3. Seleccionar todos los clientes que no tengan registrada una factura.
SELECT *
FROM e01_cliente
WHERE nro_cliente NOT IN (SELECT nro_cliente
                        FROM e01_factura);

-- 4. Seleccionar los productos que han sido facturados al menos 1 vez.
SELECT *
FROM e01_producto
WHERE codigo_producto IN (SELECT codigo_producto
                          FROM e01_detalle_factura);

-- 5. Seleccionar los datos de los clientes junto con sus teléfonos
SELECT *
FROM e01_cliente NATURAL JOIN e01_telefono
ORDER BY nro_cliente;

-- 6. Devolver todos los clientes, con la cantidad de facturas que
-- tienen registradas (admitir nulos en valores de Clientes)
SELECT C.nro_cliente, nombre, apellido, direccion, activo, COUNT(F.nro_factura) AS cantidad_facturas
FROM E01_CLIENTE C LEFT OUTER JOIN E01_FACTURA F ON C.nro_cliente = F.nro_cliente
GROUP BY C.nro_cliente, nombre, apellido, direccion, activo
ORDER BY C.nro_cliente;

-- 7. Listar todas las Facturas que hayan sido compradas por el cliente de
-- nombre "Pandora" y apellido "Tate"
SELECT *
FROM e01_factura
WHERE nro_cliente IN (SELECT nro_cliente
                      FROM e01_cliente
                      WHERE nombre = 'Pandora' AND apellido = 'Tate');

-- 8. Listar todas las Facturas que contengan productos de la marca “In Faucibus Inc.”
SELECT *
FROM e01_factura
WHERE nro_factura IN ( SELECT nro_factura
                       FROM e01_detalle_factura NATURAL JOIN e01_producto e01p
                       WHERE marca = 'In Faucibus Inc.');

-- 9. Mostrar cada teléfono junto con los datos del cliente.
SELECT nro_telefono, nro_cliente, nombre, apellido, direccion, activo
FROM e01_telefono NATURAL JOIN e01_cliente;

-- 10. Mostrar nombre y apellido de cada cliente junto con lo que
-- gastó en total (con IVA incluido).
SELECT nombre, apellido, sum(total_con_iva) as gasto_total_con_IVA
FROM e01_cliente natural join e01_factura
GROUP BY nro_cliente, nombre, apellido;


