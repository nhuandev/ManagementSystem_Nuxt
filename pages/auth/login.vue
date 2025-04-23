<script setup lang="ts">

import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
import { definePageMeta } from '#build/imports'
import { useAuthStore } from "@/stores/auth";
definePageMeta({
  layout: "empty",
});
const { toast } = useToast()
const username = ref('')
const password = ref('')
const authStore = useAuthStore();
const handleLogin = async () => {
  try {
    if (!username.value || !password.value) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền email và mật khẩu.",
        variant: "destructive",
      });
      return;
    }

    await authStore.login(username.value, password.value);

    toast({
      title: "Thành công",
      description: "Đăng nhập thành công!",
    });
    navigateTo("/");
  } catch (error) {
    toast({
      title: "Lỗi",
      description:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng nhập.",
      variant: "destructive",
    });
  }
};
</script>


<template>
  <Toaster />
  <!-- <form @submit.prevent="submit"> -->
  <Card class="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl">
        Đăng nhập
      </CardTitle>
      <CardDescription>
        Nhập tên đăng nhập và mật khẩu của bạn để vào hệ thống 2NH
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="username">Tên đăng nhập</Label>
          <Input v-model="username" id="username" type="text" required />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Mật khẩu</Label>
            <a href="#" class="ml-auto inline-block text-sm underline">
              Quên mật khẩu?
            </a>
          </div>
          <Input v-model="password" id="password" type="password" required />
        </div>
        <Button v-on:click="handleLogin" type="submit" class="w-full">
          Đăng nhập
        </Button>
        <!-- <Button variant="outline" class="w-full">
          Login with Google
        </Button> -->
      </div>
      <div class="mt-4 text-center text-sm">
        Bạn chưa có tài khoản? 
          <NuxtLink to="/auth/register" >Đăng ký</NuxtLink>
      </div>
    </CardContent>
  </Card>

  <!-- <div v-if="message" class="text-red-500 mt-2 text-center">{{ message }}</div> -->
  <!-- </form> -->
</template>
