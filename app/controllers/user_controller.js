import jwt from 'jwt-simple';
import User from '../models/user_model';
// import config from '../config.js';

import dotenv from 'dotenv';

dotenv.config({ silent: true });


// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.API_SECRET);
}


export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  console.log('signing up');
  console.log(`${username},${email},${password}`);

  if (!email || !password || !username) {
    return res.status(422).send('You must provide email,password, & username');
  }
  User.find({ email },
    (err, docs) => {
      if (err) {
        res.send(err);
      }
      // ref http://stackoverflow.com/questions/9660587/do-something-if-nothing-found-with-find-mongoose
      // user does not exist -- success
      if (!docs.length) {
        // initializing user obj
        const user = new User();
        user.email = email;
        user.password = password;
        user.username = username;
        console.log(`${user.email},${user.password},${user.username}`);
        // saving; user created
        user.save()
        .then(result => {
          console.log('saved');
          res.send({ token: tokenForUser(user) });
        })
        .catch(error => {
          res.json({ error });
        });
      } else {   // if user exists then return an error
        return res.status(409).send('Email already in use');
      }
    });
};
