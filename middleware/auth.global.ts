import { useAuthStore } from "@/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  console.log("Middleware bắt đầu chạy");

  if (import.meta.client) {
    const authStore = useAuthStore();
    await authStore.checkAuth(); 

    console.log("Auth state:", authStore.isLoggedIn);

    const isAuthRoute = to.path.startsWith("/auth/login");
    const isProtectedRoute = !isAuthRoute; // Các route cần bảo vệ

    if (!authStore.isLoggedIn && isProtectedRoute) {
      console.log("Chưa đăng nhập, chuyển hướng đến /auth/login");
      return navigateTo("/auth/login");
    }

    if (authStore.isLoggedIn && isAuthRoute) {
      console.log("Đã đăng nhập, redirect về trang chính");
      return navigateTo("/");
    }
  }
});
