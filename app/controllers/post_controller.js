import Post from '../models/post_model';

export const createPost = (req, res) => {
  const post = new Post();
  post.title = req.body.title;
  post.tags = req.body.tags;
  post.content = req.body.content;
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
  Post.find({}, '_id title tags',
    (err, docs) => {
      const cleanPosts = (posts) => {
        return posts.map(post => {
          return { id: post._id, title: post.title, tags: post.tags };
        });
      };

      const cleanedPosts = cleanPosts(docs);

      res.json(cleanedPosts);
    });
};

export const getPost = (req, res) => {
  Post.findById(req.params.id, '_id title tags content',
    (err, docs) => {
      const cleanedPosts = { id: docs._id, title: docs.title, tags: docs.tags, content: docs.content };
      res.json(cleanedPosts);
    });
};

export const deletePost = (req, res) => {
  Post.remove({ _id: req.params.id },
    (err) => {
      res.send(err);
    });
};

export const updatePost = (req, res) => {
  Post.update({ _id: req.params.id }, { title: req.body.title, tags: req.body.tags, content: req.body.content },
    (err, raw) => {
      if (err) {
        res.send(err);
      }
      console.log(`UPDATING: ${req.params.id},${req.body.title},${req.body.tags},${req.body.content}`);
      Post.findById(req.params.id, '_id title tags content',
        (err, docs) => {
          if (err) {
            res.send(err);
          }
          console.log(`FINDING AFTER UPDTD: ${docs._id},${docs.title},${docs.tags},${docs.content}`);
          const updatedPost = { id: docs._id, title: docs.title, tags: docs.tags, content: docs.content };
          res.json(updatedPost);
        });
    });
};
