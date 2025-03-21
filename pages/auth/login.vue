<script setup lang="ts">

import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
definePageMeta({
  layout: "empty",
});
const { toast } = useToast()
const username = ref('')
const password = ref('')
const message = ref('')

const submit = async () => {
  message.value = '';
  
  try {
    const response = await fetch('http://localhost:3005/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        username: username.value,
        password: password.value, 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      message.value = errorData.message || 'Login failed. Please try again.';
      toast({
        title: 'Error',
        description: message.value,
      });
      return;
    }

    // Get user data from response
    const userData = await response.json();
    
    toast({
      title: 'Success',
      description: 'Login successful',
    });

    window.location.href = '/';
    // return navigateTo('/');
    
  } catch (error) {
    message.value = 'An error occurred. Please try again.';
    toast({
      title: 'Error',
      description: message.value,
    });
    console.error(error);
  }
};
</script>


<template>
  <Toaster />
  <!-- <form @submit.prevent="submit"> -->
  <Card class="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl">
        Login
      </CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="username">Name</Label>
          <Input v-model="username" id="username" type="text" placeholder="m@example.com" required />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password</Label>
            <a href="#" class="ml-auto inline-block text-sm underline">
              Forgot your password?
            </a>
          </div>
          <Input v-model="password" id="password" type="password" required />
        </div>
        <Button v-on:click="submit" type="submit" class="w-full">
          Login
        </Button>
        <Button variant="outline" class="w-full">
          Login with Google
        </Button>
      </div>
      <div class="mt-4 text-center text-sm">
        Don't have an account?
          <NuxtLink to="user/add" >Sign Up</NuxtLink>
      </div>
    </CardContent>
  </Card>

  <div v-if="message" class="text-red-500 mt-2 text-center">{{ message }}</div>
  <!-- </form> -->
</template>
