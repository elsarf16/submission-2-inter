import Home from '../pages/home/index.js';
import About from '../pages/about/index.js';
import AddStory from '../pages/home/addStory.js';
import Login from '../pages/auth/login.js';
import Register from '../pages/auth/register.js';
import Cerita from '../pages/view/cerita.js';
import StoryDetail from '../pages/view/storyDetail.js';
import HomePresenter from '../../presenter/homePresenter.js';
import NotFound from '../pages/notFound.js';
import Liked from '../pages/liked/index.js';

const routes = {
  '/': Home,
  '/about': About,
  '/add': AddStory,
  '/login': Login,
  '/register': Register,
  '/cerita': Cerita,
  '/story/:id': StoryDetail,  // ✅ ID route
  '/liked': Liked,
  '*': NotFound,  // Default route untuk halaman tidak ditemukan
};

export default routes;
