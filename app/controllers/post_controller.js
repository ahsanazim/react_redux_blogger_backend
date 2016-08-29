import Post from '../models/post_model';
import { incrmntNumPosts } from './user_controller.js';
import AWS from 'aws-sdk';

// import config from '../config'; --> not used
import dotenv from 'dotenv';
dotenv.config({ silent: true });

const s3Bucket = process.env.S3_BUCKET_NAME;
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const createPost = (req, res) => {
  const post = new Post();
  post.title = req.body.title;
  post.tags = req.body.tags;
  post.content = req.body.content;
  post.author = req.user.username;
  post.save()
  .then(result => {
    incrmntNumPosts(req.user.username);
    res.json(result);
  })
  .catch(error => {
    res.json({ error });
  });
};

export const getPosts = (req, res) => {
  Post.find({}, '_id title tags author image',
    (err, docs) => {
      const cleanPosts = (posts) => {
        return posts.map(post => {
          return { id: post._id, title: post.title, tags: post.tags, author: post.author, image: post.image };
        });
      };

      const cleanedPosts = cleanPosts(docs);

      res.json(cleanedPosts);
    });
};

export const getPost = (req, res) => {
  Post.findById(req.params.id, '_id title tags content author image',
    (err, docs) => {
      const cleanedPosts = { id: docs._id, title: docs.title, tags: docs.tags, content: docs.content, author: docs.author, image: docs.image };
      res.json(cleanedPosts);
    });
};

export const deletePost = (req, res) => {
  Post.remove({ _id: req.params.id },
    (err) => {
      res.send(err);
    });
};

// returns array of docs with search query in tags field
export const search = (req, res) => {
  Post.find({ $text: { $search: req.params.query } }, '_id title tags author image',
    (err, docs) => {
      if (err) {
        res.send(err);
      } else {
        const cleanPosts = (posts) => {
          return posts.map(post => {
            return { id: post._id, title: post.title, tags: post.tags, author: post.author, image: post.image };
          });
        };

        const cleanedPosts = cleanPosts(docs);

        res.json(cleanedPosts);
      }
    });
};

export const updatePost = (req, res) => {
  if ((req.body.title === '') || (req.body.tags === '') || (req.body.content === '')) {
    Post.findById(req.params.id, '_id title tags content image',
      (err, docs) => {
        if (err) {
          res.send(err);
        }
        const updatedPost = { id: docs._id, title: docs.title, tags: docs.tags, content: docs.content, image: req.body.image };
        res.json(updatedPost);
      });
  } else {
    let matches = true;
    Post.findById(req.params.id, '_id title tags content author image',
      (err, docs) => {
        if (err) {
          res.send(err);
        }
        if (docs.author !== req.user.username) {
          matches = false;
          const updatedPost = { id: docs._id, title: docs.title, tags: docs.tags, content: docs.content, image: req.body.image };
          res.json(updatedPost);
        }
      });
    if (matches) {
      Post.update({ _id: req.params.id }, { title: req.body.title, tags: req.body.tags, content: req.body.content, image: req.body.image },
          (err, raw) => {
            if (err) {
              res.send(err);
            }
            Post.findById(req.params.id, '_id title tags content image',
              (err, docs) => {
                if (err) {
                  res.send(err);
                }
                const updatedPost = { id: docs._id, title: docs.title, tags: docs.tags, content: docs.content, image: req.body.image };
                res.json(updatedPost);
              });
          });
    }
  }
};

export const getSignedRequest = (req, res) => {
  const s3Params = {
    Bucket: s3Bucket,
    Key: req.body.id,
    Expires: 60, // expire after 60 mins
    ContentType: req.body.filetype,
    ACL: 'public-read',
  };
  const s3bucket = new AWS.S3();

  // get signed URL
  s3bucket.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const returnData = {
        requestUrl: data,
        imageUrl: `https://${s3Params.Bucket}.s3.amazonaws.com/${s3Params.Key}`,
      };
      Post.findById(req.body.id)
      .then(post => {
        post.image = `https://${s3Params.Bucket}.s3.amazonaws.com/${s3Params.Key}`;
        post.save().then((resultWithImage) => {
          res.json(returnData);
        })
        . catch(error => {
          res.json({ error });
        });
      });
    }
  });
};
