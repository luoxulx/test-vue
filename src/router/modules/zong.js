import Layout from '@/views/layout/Layout'

const zongRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'Table',
    icon: 'table'
  }
}

export default zongRouter
