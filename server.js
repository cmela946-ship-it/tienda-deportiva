require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar JSON y archivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado exitosamente a MongoDB Atlas'))
    .catch(err => console.error('Error de conexión a la base de datos:', err));

// Definición del Modelo de Datos (Esquema NoSQL para productos deportivos)
const ProductoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    categoria: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true }
});

const Producto = mongoose.model('Producto', ProductoSchema);

// ================= RUTAS DE LA API (CRUD) =================

// 1. CREATE: Registrar un nuevo artículo deportivo
app.post('/api/productos', async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el producto', error });
    }
});

// 2. READ: Obtener todos los artículos deportivos
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los productos', error });
    }
});

// 3. UPDATE: Modificar un artículo existente por su ID
app.put('/api/productos/:id', async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(productoActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el producto', error });
    }
});

// 4. DELETE: Eliminar un artículo por su ID
app.delete('/api/productos/:id', async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar el producto', error });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});