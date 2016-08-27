import Post from '../models/post_model';

export const createPost = (req, res) => {
  const post = new Post();
  post.title = req.body.title;
  post.tags = req.body.tags;
  post.content = req.body.content;
  post.author = req.user.username;
  post.save()
  .then(result => {
    res.json({ message: 'Post created!' });
  })
  .catch(error => {
    res.json({ error });
  });
};

// still need to sort results for this + handle errors overall ?
export const getPosts = (req, res) => {
  Post.find({}, '_id title tags author',
    (err, docs) => {
      const cleanPosts = (posts) => {
        return posts.map(post => {
          return { id: post._id, title: post.title, tags: post.tags, author: post.author };
        });
      };

      const cleanedPosts = cleanPosts(docs);

      res.json(cleanedPosts);
    });
};

export const getPost = (req, res) => {
  Post.findById(req.params.id, '_id title tags content author',
    (err, docs) => {
      const cleanedPosts = { id: docs._id, title: docs.title, tags: docs.tags, content: docs.content, author: docs.author };
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
  Post.find({ $text: { $search: req.params.query } }, '_id title tags author',
    (err, docs) => {
      if (err) {
        res.send(err);
      } else {
        const cleanPosts = (posts) => {
          return posts.map(post => {
            return { id: post._id, title: post.title, tags: post.tags, author: post.author };
          });
        };

        const cleanedPosts = cleanPosts(docs);

        res.json(cleanedPosts);
      }
    });
};

export const updatePost = (req, res) => {
  if ((req.body.title === '') || (req.body.tags === '') || (req.body.content === '')) {
    Post.findById(req.params.id, '_id title tags content',
      (err, docs) => {
        if (err) {
          res.send(err);
        }
        const updatedPost = { id: docs._id, title: docs.title, tags: docs.tags, content: docs.content };
        res.json(updatedPost);
      });
  } else {
    let matches = true;
    Post.findById(req.params.id, '_id title tags content author',
      (err, docs) => {
        if (err) {
          res.send(err);
        }
        if (docs.author !== req.user.username) {
          matches = false;
          const updatedPost = { id: docs._id, title: docs.title, tags: docs.tags, content: docs.content };
          res.json(updatedPost);
        }
      });
    if (matches) {
      Post.update({ _id: req.params.id }, { title: req.body.title, tags: req.body.tags, content: req.body.content },
          (err, raw) => {
            if (err) {
              res.send(err);
            }
            Post.findById(req.params.id, '_id title tags content',
              (err, docs) => {
                if (err) {
                  res.send(err);
                }
                const updatedPost = { id: docs._id, title: docs.title, tags: docs.tags, content: docs.content };
                res.json(updatedPost);
              });
          });
    }
  }
};
