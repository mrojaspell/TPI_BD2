
-- 1. Se debe realizar una vista que devuelva las facturas ordenadas por fecha.
CREATE VIEW ORDERED_BILLS AS
SELECT *
FROM E01_FACTURA
ORDER BY fecha;


-- 2. Se necesita una vista que devuelva todos los productos que aún no han sido facturados.
CREATE VIEW UNBILLED_PRODUCTS AS
SELECT *
FROM E01_PRODUCTO
WHERE codigo_producto NOT IN (SELECT codigo_producto
                              FROM E01_DETALLE_FACTURA);