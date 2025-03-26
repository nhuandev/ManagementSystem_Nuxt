<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from '~/components/ui/toast'
import { updateUser } from '~/lib/api/user'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { listDepart } from '~/lib/api/depart'


interface UserData {
    id?: string;
    username: string;
    email: string;
    password?: string;
    role: string;
    departmentId: string;
}


const route = useRoute();
const userDetail = ref<UserData>({
    id: route.query.id as string,
    username: route.query.username as string,
    email: route.query.email as string,
    role: route.query.role as string,
    password: route.query.password as string,
    departmentId: route.query.departmentId as string,
})

const handleSubmit = async (event: Event) => {
    event.preventDefault()
    try {
        const response = await updateUser(route.query.id as any, userDetail.value)
        if (response) {
            toast({
                title: 'Success',
                description: 'User updated successfully',
            })
        }
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to update user',
        })
        console.error('Error updating user:', error)
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
    <header class="flex h-16 items-center gap-2 px-4">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem class="hidden md:block">
                    <BreadcrumbLink href="#">Đội ngũ hệ thống</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator class="hidden md:block" />
                <BreadcrumbItem>
                    <BreadcrumbPage>Cập nhật tài khoản</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    </header>
    <Toaster />

    <form class="p-6 bg-white rounded-lg shadow-md space-y-6" @submit="handleSubmit">
        <!-- User Name and Password in one row -->
        <div class="flex space-x-4">
            <!-- User Name -->
            <div class="flex-1">
                <Label for="userName" class="text-sm font-medium text-gray-700">Tên đăng nhập</Label>
                <Input id="userName" type="text" required placeholder="Nhập tên đăng nhập" v-model="userDetail.username"
                    class="w-full" />
            </div>

            <!-- Password -->
            <div class="flex-1">
                <Label for="password" class="text-sm font-medium text-gray-700">Mật khẩu (không bắt buộc)</Label>
                <Input id="password" type="password" placeholder="Để trống nếu không muốn đổi mật khẩu"
                    v-model="userDetail.password" class="w-full" />
            </div>
        </div>

        <!-- Email and Role in one row -->
        <div class="flex space-x-4">
            <!-- Email -->
            <div class="flex-1">
                <Label for="email" class="text-sm font-medium text-gray-700">Email</Label>
                <Input id="email" type="email" required placeholder="Nhập email" v-model="userDetail.email"
                    class="w-full" />
            </div>

            <!-- Role Selection -->
            <div class="flex-1">
                <Label for="role" class="text-sm font-medium text-gray-700">Vai trò</Label>
                <Select v-model="userDetail.role">
                    <SelectTrigger class="w-[180px]">
                        <SelectValue :placeholder="userDetail.role || 'Chọn vai trò'" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="ADMIN">Quản trị</SelectItem>
                            <SelectItem value="MEMBER">Nhân viên</SelectItem>
                            <SelectItem value="MANAGER">Quản lý</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div class="flex-1">
                <Label for="depart" class="text-sm font-medium text-gray-700">Phòng ban</Label>
                <select v-model="userDetail.departmentId" class="p-2 border rounded">
                    <option v-for="(depart, index) in departs" :key="depart._id" :value="depart._id">
                        ({{ index + 1 }}) ({{ depart.departName }})
                    </option>
                </select>
            </div>
        </div>


        <!-- Submit Button -->
        <div class="flex justify-center mt-4">
            <Button type="submit">Cập nhật</Button>
        </div>
    </form>
</template>
