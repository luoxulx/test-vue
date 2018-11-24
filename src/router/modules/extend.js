/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const extendRouter = {
  path: '/extend',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Extend',
  meta: {
    title: 'Extend',
    icon: 'example'
  },
  children: [
    {
      path: 'laravel-log',
      component: () => import('@/views/extend/laravel/index'),
      name: 'LaravelLogView',
      meta: { title: 'LaravelLogView' }
    }
  ]
}
export default extendRouter
