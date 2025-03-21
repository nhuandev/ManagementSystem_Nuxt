<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
import { ref, onMounted } from 'vue'
import Button from '~/components/ui/button/Button.vue'

import { toast } from '~/components/ui/toast'
import { listDepart } from '~/lib/api/depart'

interface Depart {
    departName: string
    description: string
    isActive: boolean
}

const departs = ref<Depart[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 5
const route = useRoute().params.id
// const userId = route.params.id 

const fetchDeparts = async (page: number) => {
    try {
        const response = await listDepart(page, limit)
        departs.value = response.data
        totalPages.value = Math.max(response.totalPages, 1)
        console.log('API Response:', response)
        console.log('Total Pages:', totalPages.value)
    } catch (e) {
        console.error('Error loading departs:', e)
    }
}

const handlePageChange = async (page: number) => {
    currentPage.value = page
    await fetchDeparts(page)
}

onMounted(() => {
    fetchDeparts(1)
})


const handleDeleteDepart = async (departName: string) => {

}

const handleEditDepart = async (id: string) => {
    return navigateTo(`/depart/edit/${id}`);
};

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
                            Phòng ban
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator class="hidden md:block" />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Danh sách phòng ban</BreadcrumbPage>
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
                    <TableHead>Tên phòng ban</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Công cụ</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="(depart, index) in departs">
                    <TableCell class="font-medium">{{ (currentPage - 1) * limit + index + 1 }}</TableCell>
                    <TableCell>{{ depart.departName }}</TableCell>
                    <TableCell>{{ depart.description }}</TableCell>
                    <TableCell>
                        <Switch id="airplane-mode" />
                    </TableCell>
                    <TableCell>
                        <Button @click="handleDeleteDepart(depart.departName)">
                            Xóa
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