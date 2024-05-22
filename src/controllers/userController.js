const bcrypt = require('bcrypt');
const User = require('../schemas/userSchema');
const { createToken } = require('../services/jwt');
const { validate } = require('../helpers/validate');

const test = (_req, res) => {
  return res.status(200).send('Aquí podrá crear su usuario');
};

const signUp = async (req, res) => {
  const data = req.body;
  if (!data.name) {
    return res.status(400).send({
      status: 'error',
      message: 'Falta nombre.',
    });
  }
  if (!data.email) {
    return res.status(400).send({
      status: 'error',
      message: 'Falta email.',
    });
  }
  if (!data.password) {
    return res.status(400).send({
      status: 'error',
      message: 'Falta elegir contraseña.',
    });
  }

  const isValid = validate(data);

  if (isValid) {
    try {
      const users = await User.find({ email: data.email.toLowerCase() });
      if (users && users.length >= 1) {
        return res.status(400).send({
          status: 'error',
          message: 'Email ya registrados.',
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Error en la consulta de usuarios.',
      });
    }
  } else {
    return res.status(400).send({
      status: 'error',
      message: 'Datos incorrectos.',
    });
  }
  let pwd = await bcrypt.hash(data.password, 10);
  data.password = pwd;
  const user_to_save = new User(data);
  try {
    const newUser = await user_to_save.save();
    return res.status(200).json({
      status: 'success',
      message: 'Usuario registrado correctamente.',
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al guardar usuario.',
    });
  }
};

const logIn = async (req, res) => {
  const data = req.body;
  if (!data.email || !data.password) {
    return res.status(400).send({
      status: 'error',
      message: 'Faltan datos por enviar.',
    });
  }
  console.log(SECRET_JWT);
  try {
    const user = await User.findOne({
      email: data.email.toLowerCase(),
    });
    if (!user) {
      return res.status(404).send({
        status: 'error',
        message: 'Usuario inexistente.',
      });
    }
    let pwd = bcrypt.compareSync(data.password, user.password);
    if (!pwd) {
      return res.status(400).send({
        status: 'error',
        message: 'No te has identificado correctamente.',
      });
    }
    const token = createToken(user);
    return res.status(200).send({
      status: 'success',
      message: 'Sesión iniciada correctamente.',
      user: {
        id: user._id,
        name: user.name,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Error en la consulta de usuarios.',
      err,
    });
  }
};

module.exports = { test, signUp, logIn };
