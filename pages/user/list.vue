<script setup lang="ts">
import { listUser, deleteUser } from '~/lib/api/user'
import { ref, onMounted } from 'vue'
import Button from '~/components/ui/button/Button.vue'
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'

interface User {
    _id: string,
    username: string
    email: string
    role: string,
    departmentId: string,
    password: string,
}

const { toast } = useToast()
const users = ref<User[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 2

const fetchUsers = async (page: number) => {
    try {
        const response = await listUser(page, limit)
        users.value = response.data
        totalPages.value = Math.max(response.totalPages, 1)
        console.log('API Response:', response)
        console.log('Total Pages:', totalPages.value)
    } catch (e) {
        console.error('Error loading users:', e)
    }
}

const handlePageChange = async (page: number) => {
    currentPage.value = page
    await fetchUsers(page)
}

const handleDeleteUser = async (_id: string) => {
    try {
        const confirmed = window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')
        if (!confirmed) return

        const response = await deleteUser(_id);

        if (response.statusCode == 200) {
            console.log(response.statusCode);
            toast({
                title: "Thành công",
                description: response.message,
            })
            await fetchUsers(currentPage.value)
        } else {
            toast({
                title: "Lỗi",
                description: response.message,
                variant: "destructive",
            })
        }
    } catch (error) {
        console.error('Error deleting user:', error)
    }
}

const handleEditUser = async (user: User) => {
    navigateTo({
        path: `/user/${user._id}`,
        query: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            departmentId: user.departmentId,
            password: user.password,
        }
    });
};

onMounted(() => {
    fetchUsers(1)
})

definePageMeta({
    layout: "default",
});

</script>

<template>
    <Toaster/>
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
                        <BreadcrumbPage>Danh sách tài khoản</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    </header>
    <div>
        <Table>
            <!-- <TableCaption>Danh sách nhân sự</TableCaption> -->
            <TableHeader>
                <TableRow>
                    <TableHead class="w-[100px]">STT</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Phòng ban</TableHead>
                    <TableHead>Công cụ</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="(user, index) in users" :key="user._id">
                    <TableCell class="font-medium">{{ (currentPage - 1) * limit + index + 1 }}</TableCell>
                    <TableCell>{{ user.username }}</TableCell>
                    <TableCell>{{ user.email }}</TableCell>
                    <TableCell>
                        <template v-if="user.role === 'ADMIN'">
                            Quản trị viên
                        </template>
                        <template v-else-if="user.role === 'MEMBER'">
                            Nhân viên
                        </template>
                        <template v-else>
                            Quản lý
                        </template>
                    </TableCell>
                    <TableCell>{{ user.departmentId.departName }}</TableCell>

                    <TableCell>
                        <Button @click="handleDeleteUser(user._id)">
                            Xóa
                        </Button>
                        <Button @click="handleEditUser(user)" class="ml-2">
                            Sửa
                        </Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <div class="flex items-center justify-center gap-2 py-4">
            <Button class="w-10 h-10 p-0" variant="outline" size="sm" :disabled="currentPage === 1"
                @click="handlePageChange(1)">
                First
            </Button>
            <Button class="w-10 h-10 p-0" variant="outline" size="sm" :disabled="currentPage === 1"
                @click="handlePageChange(currentPage - 1)">
                Prev
            </Button>

            <div class="flex items-center gap-1">
                <template v-for="pageNum in totalPages" :key="pageNum">
                    <Button class="w-10 h-10 p-0" size="sm" :variant="pageNum === currentPage ? 'default' : 'outline'"
                        @click="handlePageChange(pageNum)">
                        {{ pageNum }}
                    </Button>
                </template>
            </div>

            <Button class="w-10 h-10 p-0" variant="outline" size="sm" :disabled="currentPage === totalPages"
                @click="handlePageChange(currentPage + 1)">
                Next
            </Button>
            <Button class="w-10 h-10 p-0" variant="outline" size="sm" :disabled="currentPage === totalPages"
                @click="handlePageChange(totalPages)">
                Last
            </Button>
            <!-- <Icon name="uil:github" style="color: black" /> -->
        </div>
    </div>
</template>