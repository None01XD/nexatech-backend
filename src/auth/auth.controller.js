const jwt =
  require('jsonwebtoken');

const bcrypt =
  require('bcryptjs');

const Auth =
  require('./auth.model');

// =========================
// LOGIN
// =========================

exports.login =
  async (req,res) => {

    try {

      const {
        email,
        password
      } = req.body;

      // =========================
      // USER
      // =========================

      const user =
        await Auth.findByEmail(email);

      if(!user){

        return res.status(401).json({
          message:
            'Usuario no encontrado'
        });

      }

      // =========================
      // PASSWORD
      // =========================

      // TEMPORAL
      // luego usaremos bcrypt real

      if(password !== user.password){

        return res.status(401).json({
          message:
            'Contraseña incorrecta'
        });

      }

      // =========================
      // TOKEN
      // =========================

      const token =
        jwt.sign(

          {
            id:user.id,
            role:user.role
          },

          process.env.JWT_SECRET,

          {
            expiresIn:'24h'
          }

        );

      // =========================
      // RESPONSE
      // =========================

      res.json({

        message:
          'Login exitoso',

        token,

        user:{

          id:user.id,

          name:user.name,

          role:user.role

        }

      });

    } catch(err){

      console.error(err);

      res.status(500).json({

        message:'Error login'

      });

    }

  };