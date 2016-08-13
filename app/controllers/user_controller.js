import jwt from 'jwt-simple';
import User from '../models/user_model';
import config from '../config';

export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password || !username) {
    return res.status(422).send('You must provide name, email, and password');
  }

  User.findOne({ email: req.body.email })
  // here you should do a mongo query to find if a user already exists with this email.
  // if user exists then return an error. If not, use the User model to create a new user.
  // Save the new User object
  // this is similar to how you created a Post
  // and then return a token same as you did in in signin
  .then(result => {
    if (result == null) {
      const user = new User();
      user.username = req.body.username;
      user.email = req.body.email;
      user.password = req.body.password;
      user.save();
      res.json({ token: tokenForUser(user), message: 'User created!' });
    } else {
      return res.status(422).send('User already exists!');
    }
  })
  .catch(error => {
    res.json({ error });
  });
};


// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}
