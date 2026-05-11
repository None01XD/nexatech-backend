const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Auth = require('./auth.model');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Auth.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: 'Usuario no encontrado'
      });
    }

    // TEMPORAL (sin hash todavía)
    if (password !== user.password) {
      return res.status(401).json({
        message: 'Contraseña incorrecta'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      'SECRET_KEY_NEXATECH',
      {
        expiresIn: '24h'
      }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Error login'
    });
  }
};