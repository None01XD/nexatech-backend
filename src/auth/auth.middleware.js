const jwt = require('jsonwebtoken');

// =========================
// VERIFY TOKEN
// =========================

exports.verifyToken = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({
        message: 'Token requerido'
      });

    }

    // Bearer TOKEN
    const token = authHeader.split(' ')[1];

    if (!token) {

      return res.status(401).json({
        message: 'Token inválido'
      });

    }

    const decoded = jwt.verify(
      token,
      'SECRET_KEY_NEXATECH'
    );

    req.user = decoded;

    next();

  } catch (err) {

    console.error(err);

    return res.status(401).json({
      message: 'Token inválido o expirado'
    });

  }

};

// =========================
// VERIFY ADMIN
// =========================

exports.verifyAdmin = (req, res, next) => {

  if (req.user.role !== 'admin') {

    return res.status(403).json({
      message: 'Acceso denegado'
    });

  }

  next();

};