const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = express.Router();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

router.get('/', async (req, res) => {
  const users = await User.find();
  res.render('index', { users });
});

router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Generar el salt (valor aleatorio utilizado para el hash)
    const salt = await bcrypt.genSalt(10);
    
    // Hash de la contraseña utilizando el salt
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Crear un nuevo usuario con la contraseña hasheada
    const newUser = new User({
      name,
      email,
      password: hashedPassword // Guardar la contraseña hasheada en la base de datos
    });
    
    // Guardar el usuario en la base de datos
    await newUser.save();
    
    res.redirect('/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el usuario');
  }
});

router.get('/edit/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render('partials/edit', { user });
});

router.post('/update/:id', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/users');
});

router.get('/delete/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/users');
});

module.exports = router;
