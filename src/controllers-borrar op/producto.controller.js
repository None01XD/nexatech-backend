const Producto = require('../models/producto.model');

const validateProducto = (data) => {
  const errors = [];
  if (!data.nombre || typeof data.nombre !== 'string' || data.nombre.trim() === '') {
    errors.push('Nombre es requerido');
  }
  if (data.precio == null || isNaN(Number(data.precio))) {
    errors.push('Precio inválido');
  }
  if (data.cantidad == null || isNaN(parseInt(data.cantidad, 10))) {
    errors.push('Cantidad inválida');
  }
  return errors;
};

exports.create = async (req, res, next) => {
  try {
    const { nombre, precio, cantidad } = req.body;
    const errors = validateProducto({ nombre, precio, cantidad });
    if (errors.length) return res.status(400).json({ errors });

    const producto = await Producto.create({ nombre, precio, cantidad });
    res.status(201).json(producto); // 🔥 FIX
  } catch (err) {
    next(err);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos); // 🔥 FIX
  } catch (err) {
    console.error(err); // 🔥 DEBUG
    next(err);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findById(id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(producto); // 🔥 FIX
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, precio, cantidad } = req.body;
    const errors = validateProducto({ nombre, precio, cantidad });
    if (errors.length) return res.status(400).json({ errors });

    const ok = await Producto.update(id, { nombre, precio, cantidad });
    if (!ok) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto actualizado' });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ok = await Producto.remove(id);
    if (!ok) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    next(err);
  }
};
