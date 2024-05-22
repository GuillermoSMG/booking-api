const jwt = require('jwt-simple');
const moment = require('moment');

//GENERATE TOKEN FUNCTION
const createToken = user => {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix(),
  };

  //return token
  return jwt.encode(payload, process.env.ENV_SECRET_JWT);
};

module.exports = { createToken };
