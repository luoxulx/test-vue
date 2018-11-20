import Layout from '@/views/layout/Layout'

const blogRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'Table',
    icon: 'table'
  }
}

export default blogRouter
