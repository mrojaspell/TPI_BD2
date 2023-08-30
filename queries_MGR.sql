
-- 1
SELECT T.nro_telefono, C.nro_cliente
FROM E01_TELEFONO T JOIN E01_CLIENTE C ON T.nro_cliente = C.nro_cliente
WHERE C.nombre = 'Wanda' AND C.apellido = 'Baker';

-- 2
SELECT C.nro_cliente, C.nombre, C.apellido
FROM E01_CLIENTE C JOIN E01_FACTURA F ON C.nro_cliente = F.nro_cliente
GROUP BY C.nro_cliente
HAVING COUNT(*) > 1;

-- 3
SELECT C.nro_cliente, C.nombre, C.apellido
FROM E01_CLIENTE C JOIN E01_FACTURA F ON C.nro_cliente = F.nro_cliente
WHERE F.nro_cliente NOT IN (SELECT nro_cliente
                            FROM E01_CLIENTE);

SELECT C.nro_cliente, C.nombre, C.apellido
FROM E01_CLIENTE C JOIN E01_FACTURA F ON C.nro_cliente = F.nro_cliente
WHERE  NOT EXISTS (SELECT *
                    FROM E01_CLIENTE);

-- 4
-- Si esta en la tabla detalle factura, siginifica que fue facturado
SELECT P.codigo_producto, P.nombre, P.marca
FROM E01_PRODUCTO P JOIN E01_DETALLE_FACTURA DF ON P.codigo_producto = DF.codigo_producto;

-- 5
SELECT C.nro_cliente, C.nombre, C.apellido, T.nro_telefono
FROM E01_CLIENTE C JOIN E01_TELEFONO T ON C.nro_cliente = T.nro_cliente
GROUP BY C.nro_cliente, nro_telefono
ORDER BY C.nro_cliente;

-- 6
SELECT C.nro_cliente, COUNT(F.nro_factura) AS cantidad_facturas
FROM E01_CLIENTE C LEFT OUTER JOIN E01_FACTURA F ON C.nro_cliente = F.nro_cliente
GROUP BY C.nro_cliente
ORDER BY C.nro_cliente;

-- 7
SELECT *
FROM E01_CLIENTE NATURAL JOIN E01_FACTURA
WHERE nombre = 'Pandora' AND apellido = 'Tate'
ORDER BY fecha;

-- 8
SELECT *
FROM E01_FACTURA
WHERE nro_factura IN (SELECT nro_factura
                          FROM E01_FACTURA NATURAL JOIN E01_DETALLE_FACTURA NATURAL JOIN E01_PRODUCTO
                          WHERE marca = 'In Faucibus Inc.')
ORDER BY nro_factura;

-- 9
SELECT nro_telefono, nombre, apellido
FROM E01_CLIENTE NATURAL JOIN E01_TELEFONO
ORDER BY apellido, nombre;

-- 10
SELECT C.nombre, C.apellido, SUM(F.total_con_iva) AS total
FROM E01_CLIENTE C JOIN E01_FACTURA F ON C.nro_cliente = F.nro_cliente
GROUP BY C.nro_cliente, nombre, apellido
ORDER BY nombre, apellido, total;


-- VISTAS

CREATE VIEW ORDERED_BILLS AS
SELECT *
FROM E01_FACTURA
ORDER BY fecha;

CREATE VIEW UNBILLED_PRODUCTS AS
SELECT *
FROM E01_PRODUCTO
WHERE codigo_producto NOT IN (SELECT codigo_producto
                              FROM E01_PRODUCTO NATURAL JOIN E01_DETALLE_FACTURA);



