type User = {
  id: string;
  username: string;
};

export default defineNuxtRouteMiddleware((to, from) => {
    const user = useCookie<User>('user');

    if (!user.value && to.path !== '/auth/login') {
      return navigateTo('/auth/login')
    }
  
    if (user.value && to.path === '/auth/login') {
      return navigateTo('/')
    }
  })