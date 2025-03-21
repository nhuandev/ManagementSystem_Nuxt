import type { RouterConfig } from '@nuxt/schema'
// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
    routes: _routes => [
        {
            name: 'dashboard',
            path: '/',
            component: () => import('~/pages/index.vue').then(r => r.default || r),
        },
        {
            name: 'login',
            path: '/auth/login',
            component: () => import('~/pages/login.vue').then(r => r.default || r),
        },

        {
            name: 'register',
            path: '/auth/register',
            component: () => import('~/pages/register.vue'),
        },
        {
            name: 'add-user',
            path: '/user/add-user',
            component: () => import('~/pages/user/add.vue'),
        },

        {
            name: 'list-user',
            path: '/user/list-user',
            component: () => import('~/pages/user/list.vue').then(r => r.default || r),
        },

        {
            name: 'edit-user',
            path: '/user/edit/:id',
            component: () => import('~/pages/user/[id].vue').then(r => r.default || r),
        },

        {
            name: 'add-project',
            path: '/project/add-project',
            component: () => import('~/pages/project/add.vue').then(r => r.default || r),
        },

        {
            name: 'list-project',
            path: '/project/list-project',
            component: () => import('~/pages/project/list.vue').then(r => r.default || r),
        },

        {
            name: 'add-depart',
            path: '/depart/add-depart',
            component: () => import('~/pages/depart/add.vue').then(r => r.default || r),
        },

        {
            name: 'list-depart',
            path: '/depart/list-depart',
            component: () => import('~/pages/depart/list.vue').then(r => r.default || r),
        },
    ],
}
