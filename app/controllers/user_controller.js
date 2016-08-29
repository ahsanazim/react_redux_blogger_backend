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
        user.numPosts = Number(0);
        // saving; user created
        user.save()
        .then(result => {
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

// look at dartbot server for bio part for correct updating methodology
// this works too, is just less elegant
export function incrmntNumPosts(username) {
  User.find({ username }, 'numPosts',
    (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        const newNumPosts = Number(docs[0].numPosts) + 1;
        User.update({ username }, { numPosts: newNumPosts },
            (err, raw) => {
              if (err) {
                console.log(err);
              }
            });
      }
    });
}

export const getProfile = (req, res) => {
  User.findOne({ username: req.params.username }, 'username email numPosts',
    (err, doc) => {
      if (err) {
        res.send(err);
      } else {
        res.json(doc);
      }
    });
};
