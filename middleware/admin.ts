type UserRole = "ADMIN" | "EMPLOYEE"

type User = {
    id: string;
    username: string;
    role: UserRole;
};

export default defineNuxtRouteMiddleware((to, from) => {
    const user = useCookie<User>('user');

    if (user.value.role === "ADMIN") {
        
    } else {
        return navigateTo('/');
    }
})