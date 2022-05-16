# Desafio 08

Created: May 14, 2022 8:36 PM
Tags: CoderHouse, Desafio

# **`>> Consigna`**

Utilizando Mongo Shell, crear una base de datos llamada *ecommerce* que contenga dos colecciones: mensajes y productos.

---

1. Agregar 10 documentos con valores distintos a las colecciones mensajes y productos. El formato de los documentos debe estar en correspondencia con el que venimos utilizando en el entregable con base de datos MariaDB.
2. Definir las claves de los documentos en relación a los campos de las tablas de esa base. En el caso de los productos, poner valores al campo precio entre los 100 y 5000 pesos (eligiendo valores intermedios. Ej: 120, 580, 900, 1280, 1700, 2300, 2860, 3350, 4320, 4990).
3. Listar todos los documentos en cada colección.
4. Mostrar la cantidad de documentos almacenados en cada una de ellas.
5. Realizar un CRUD sobre la colección de productos:
    1. Agregar un producto más en la colección de productos
    2. Realizar una consulta por nombre de producto específico:
        1. Listar los productos con precio menor a 1000 pesos.
        2. Listar los productos con precio entre los 1000 a 3000 pesos.
        3. Listar los productos con precio mayor a 3000 pesos.
        4. Realizar una consulta que traiga sólo el nombre del tercer producto más barato.
    3. Hacer una actualización sobre todos los productos, agregando el campo stock a todos ellos con un valor de 100.
    4. Cambiar el stock a cero de los productos con precios mayores a 4000 pesos.
    5. Borrar los productos con precio menor a 1000 pesos
6. Crear un usuario 'pepe' clave: 'asd456' que sólo pueda leer la base de datos ecommerce. Verificar que pepe no pueda cambiar la información.

# **`>> Instructivo`**

## **`>> Lado del servidor Servidor`**

---

1. Inicializamos el servidor de MongoDB
    
    `mongod --dbpath "\Backend\Desafios\08-MongoDB\db_ecommerce”`
    

## **`>> Lado del servidor del Cliente`**

---

1. Inicializamos el servidor de MongoDB
    
    `mongo`
    
2. Creamos la base de datos llamada *“ecommerce”*.
    
    `use ecommerce`
    
3. Creamos las colecciones “mensajes” y “productos”.
    
    `db.createCollection(”mensajes”)`
    
    `db.createCollection(”productos”)`
    
4. Insertamos los documentos necesarios a la colección “mensajes” y “productos”.
    
    `db.mensajes.insertMany ( [ <mensajes> ] )`
    
    `db.mensajes.insertMany ( [ <productos> ] )`
    
5. Verificamos que se ingresaron los documentos necesarios.
    
    `db.mensajes.find().pretty()`
    
    `db.productos.finc().pretty()`
    
6. Mostramos la cantidad de cantidad de documentos almacenados en las colecciones “mensajes” y “productos”.
    
    `db.mensajes.estimatedDocumentCount()`
    
    `db.productos.estimatedDocumentCount()`
    
7. Realizamos operaciones CRUD sobre la colección “productos”.
    1. Agregamos un producto más a la colección de “productos”.
        
        `db.productos.insertOne( <producto> )`
        
        Vemos si el documento fue agregado correctamente:
        
        `db.productos.estimatedDocumentCount()`
        
    2. Realizamos consultas en la colección “productos”.
        1. Listar los productos con precio menor a 1000 pesos.
            
            `db.productos.find({ price: {$lt : 1000} })`
            
        2. Listar los productos con precio entre 1000 a 3000 pesos.
            
            `db.productos.find({ $and: [ {price: {$gt: 1000}}, {price: {$lt: 3000}} ]}`
            
        3. Listar los productos con precio mayor a 3000 pesos.
            
            `db.productos.find({ price: {$gt : 1000} })`
            
        4. Realizar una consulta que traiga sólo el nombre del tercer producto más barato.
            
            `db.productos.find({}, {name:1, _id:0}).sort({price:1}).skip(2).limit(1)`
            
    3. Hacer una actualización sobre todos los productos, agregando el campo stock a todos ellos con un valor de 100.
        
        `db.productos.updateMany({}, {$set: {"stock": 100}}, {"multi": true})`
        
    4. Cambiar el stock a cero de los productos con precios mayores a 4000 pesos.
        
        `db.productos.updateMany({price:{$gt:4000}},{$set:{"stock":0}}, {"multi": true})`
        
    5. Borrar los productos con precio menor a 1000 pesos.
        
        `db.productos.deleteMany({price: {$lt: 1000}})`
        
8. Crear un usuario `'pepe'` clave `'asd456'` que sólo pueda leer la base de datos ecommerce. Verificar que pepe no pueda cambiar la información.
    1. Primero accedemos a la base de datos `“admin”`.
        
        `use admin`
        
    2. Creamos el usuario.
        
        `db.createUser( { user: 'pepe', pwd: 'asd456', roles: [ { role: 'read', db: 'ecommerce' }]})`
        
    3. Luego en otra terminal podemos acceder al usuario con el usuario y la contraseña.
        
        `mongo -u pepe -p asd456`