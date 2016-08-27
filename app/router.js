import { Router } from 'express';
import * as Posts from './controllers/post_controller';
import * as UserController from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';


const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

router.route('/posts')
  .post(requireAuth, Posts.createPost)
  .get(Posts.getPosts);

router.route('/posts/:id')
  .put(requireAuth, Posts.updatePost)
  .get(Posts.getPost)
  .delete(requireAuth, Posts.deletePost);

router.route('/search/:query')
  .get(Posts.search);

router.post('/signin', requireSignin, UserController.signin);
router.post('/signup', UserController.signup);

export default router;
