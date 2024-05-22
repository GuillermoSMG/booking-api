const jwt = require('jwt-simple');
const moment = require('moment');

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: 'error',
      message: 'La petición no contiene la cabecera de autenticación.',
    });
  }
  let token = req.headers.authorization.replace(/['"]+g/, '');
  try {
    let payload = jwt.decode(token, process.env.ENV_SECRET_JWT);
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        status: 'error',
        message: 'Token expirado.',
      });
    }
    //add data to req
    req.user = payload;
  } catch (err) {
    return res.status(404).send({
      status: 'error',
      message: 'Token inválido.',
    });
  }
  //next action
  next();
};

module.exports = { auth };
