<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createUser } from '~/lib/api/user'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { toast } from '~/components/ui/toast'
import { listDepart } from '~/lib/api/depart'
import { definePageMeta } from '#build/imports'

// Định nghĩa kiểu dữ liệu cho user
interface UserData {
  userName: string
  email: string
  password: string
  role: string,
  departmentId: string,
}

const userData = ref<UserData>({
  userName: '',
  email: '',
  password: '',
  role: '',
  departmentId: '',
})

const handleSubmit = async () => {
  try {
    const message = ref('');
    const response = await createUser(userData.value)
    if (response) {
      toast({
        title: 'Success',
        description: 'Create user successful',
      });
    }
    toast({
      title: 'Fail',
      description: message.value,
      duration: 1000,
    });

  } catch (error) {
    toast({
      title: 'Error',
      description: 'Create user error',
      duration: 5000,
    });
    console.error('Error:', error)
  }
}

// List data department
const departs = ref<{ _id: string, departName: string }[]>([])
const fetchDeparts = async () => {
  try {
    const response = await listDepart(0, 0);
    departs.value = response.data;
  } catch (error) {
    console.error('Error fetching departs:', error);
  }
};
onMounted(fetchDeparts);

definePageMeta({
  layout: "default",
});
</script>

<template>
  <header
    class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
    <div class="flex items-center gap-2 px-4">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem class="hidden md:block">
            <BreadcrumbLink href="#">
              Đội ngũ hệ thống
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Thêm tài khoản</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </header>
  <Toaster />
  <form class="p-6 bg-white rounded-lg shadow-md space-y-6" @submit="handleSubmit">
    <!-- User Name and Password in one row -->
    <div class="flex space-x-4">
      <!-- User Name -->
      <div class="flex-1">
        <Label for="userName" class="text-sm font-medium text-gray-700">Tên đăng nhập</Label>
        <Input id="userName" type="text" required placeholder="Nhập tên đăng nhập" v-model="userData.userName"
          class="w-full" />
      </div>

      <!-- Password -->
      <div class="flex-1">
        <Label for="password" class="text-sm font-medium text-gray-700">Mật khẩu</Label>
        <Input id="password" type="password" placeholder="Nhập mật khẩu" v-model="userData.password" class="w-full" />
      </div>

    </div>

    <div class="flex space-x-4">
      <div class="flex-1">
        <Label for="email" class="text-sm font-medium text-gray-700">Email</Label>
        <Input id="email" type="email" placeholder="Nhập email" v-model="userData.email" class="w-full" />
      </div>

      <div class="flex-1">
        <Label for="depart" class="text-sm font-medium text-gray-700">Phòng ban</Label>
        <select v-model="userData.departmentId" class="p-2 border rounded">
          <option v-for="(depart, index) in departs" :key="depart._id" :value="depart._id">
            ({{ index + 1 }}) ({{ depart.departName }}) {{ depart.departName }}
          </option>

        </select>
      </div>
    </div>

    <!-- Role Selection -->
    <div class="flex-1">
      <Label for="role" class="text-sm font-medium text-gray-700">Vai trò</Label>
      <Select v-model="userData.role">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Vai trò</SelectLabel>
            <SelectItem value="ADMIN">
              ADMIN
            </SelectItem>

            <SelectItem value="MEMBER">
              MEMBER
            </SelectItem>

            <SelectItem value="MANAGER">
              MANAGER
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-center mt-4">
      <Button type="submit">
        Thêm
      </Button>
    </div>
  </form>
</template>
