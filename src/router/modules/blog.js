import Layout from '@/views/layout/Layout'

const blogRouter = {
  path: '/blog',
  component: Layout,
  redirect: 'article',
  name: 'Blog',
  meta: {
    title: 'blog',
    icon: 'component'
  },
  children: [
    {
      path: 'article',
      component: () => import('@/views/blog/article/index'),
      name: 'article',
      meta: { title: 'article' }
    },
    {
      path: 'category',
      component: () => import('@/views/blog/category/index'),
      name: 'category',
      meta: { title: 'category' }
    },
    {
      path: 'tag',
      component: () => import('@/views/blog/tag/index'),
      name: 'tag',
      meta: { title: 'tag' }
    },
    {
      path: 'article/create',
      hidden: true,
      component: () => import('@/views/blog/article/create'),
      name: 'CreateArticle',
      meta: { title: 'createArticle', icon: 'edit' }
    },
    {
      path: 'article/edit/:id(\\d+)',
      hidden: true,
      component: () => import('@/views/blog/article/edit'),
      name: 'EditArticle',
      meta: { title: 'editArticle', noCache: true, icon: 'edit' }
    },
    {
      path: 'qiniu',
      component: () => import('@/views/blog/qiniu-file-list/index'),
      name: 'qiniu',
      meta: { title: 'qiniu图' }
    }
  ]
}

export default blogRouter
