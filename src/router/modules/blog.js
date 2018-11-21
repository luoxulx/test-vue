import Layout from '@/views/layout/Layout'

const blogRouter = {
  path: '/blog',
  component: Layout,
  redirect: '/blog/article',
  name: 'Blog',
  meta: {
    title: 'Blog',
    icon: 'table'
  },
  children: [
    {
      path: 'article',
      component: () => import('@/views/blog/article/index'),
      name: 'Article',
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
      path: 'tree-table',
      component: () => import('@/views/table/treeTable/treeTable'),
      name: 'TreeTableDemo',
      meta: { title: 'treeTable' }
    },
    {
      path: 'custom-tree-table',
      component: () => import('@/views/table/treeTable/customTreeTable'),
      name: 'CustomTreeTableDemo',
      meta: { title: 'customTreeTable' }
    },
    {
      path: 'complex-table',
      component: () => import('@/views/table/complexTable'),
      name: 'ComplexTable',
      meta: { title: 'complexTable' }
    }
  ]
}

export default blogRouter
