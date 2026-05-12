const Sale =
  require('./sale.model');

exports.checkout =
  async (req, res, next) => {

    try {

      const { cart } = req.body;

      if(
        !cart ||
        !Array.isArray(cart) ||
        cart.length === 0
      ){

        return res.status(400).json({
          message:'Carrito vacío'
        });

      }

      const result =
        await Sale.create(cart);

      res.json({
        message:'Compra realizada',
        result
      });

    } catch(err){

      next(err);

    }

  };