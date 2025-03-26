import { defineStore } from "pinia";

interface UserResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    role: string;
    username: string;
  };
}

interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    token: string;
  };
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as UserResponse["data"] | null,
  }),
  actions: {
    async fetchProfile() {
      try {
        const response = await $fetch<UserResponse>("/api/user/profile", {
          baseURL: "http://localhost:3005",
          credentials: "include", // Tự động gửi cookie
        });

        console.log("fetchProfile response:", response);
        if (response.statusCode === 200) {
          this.user = response.data;
        } else {
          this.user = null;
        }
      } catch (e) {
        console.error("fetchProfile failed:", e);
        this.user = null;
      }
    },

    async login(username: string, password: string) {
      try {
        const response = await $fetch<LoginResponse>("/api/user/login", {
          baseURL: "http://localhost:3005",
          method: "POST",
          body: { username, password },
          credentials: "include", // Lưu token qua cookie
        });

        console.log("login response:", response);
        if (response.statusCode === 201) {
          await this.fetchProfile(); // Sau khi login, lấy profile từ cookie
        }
      } catch (e: any) {
        console.error("login failed:", e);
        this.user = null;
        throw new Error(e.data?.message || "Có lỗi xảy ra khi đăng nhập.");
      }
    },

    async logout() {
      try {
        await $fetch("/api/user/logout", {
          baseURL: "http://localhost:3005",
          method: "POST",
          credentials: "include", // Xóa cookie trên server
        });

        this.user = null;
        console.log("Đã đăng xuất");
      } catch (e) {
        console.error("logout failed:", e);
      }
    },

    async checkAuth() {
      if (!this.user) {
        console.log("Checking authentication...");
        await this.fetchProfile();
      }
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
});
