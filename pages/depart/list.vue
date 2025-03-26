<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from '~/components/ui/button/Button.vue'

import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
import { listDepart, deleteDepart } from '~/lib/api/depart'

interface Depart {
  _id: string,
  departName: string
  description: string
  isActive: boolean
}

const { toast } = useToast()
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

const handleDeleteDepart = async (_id: string) => {
  try {
        const confirmed = window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')
        if (!confirmed) return
        const response = await deleteDepart(_id);

        if (response.statusCode == 200) {
            console.log(response.statusCode);
            toast({
                title: "Thành công",
                description: "Xóa thành công"
            })
            await fetchDeparts(currentPage.value)
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

const handleEditDepart = (depart: Depart) => {
  navigateTo({
    path:`/depart/${depart._id}`,
    query: {
      _id: depart._id,
      departName: depart.departName,
      description: depart.description,
    }
  });
};


onMounted(() => {
  fetchDeparts(1)
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
          <TableCell class="truncate max-w-[50vh]" >{{ depart.description }}</TableCell>
          <TableCell>{{ depart.isActive ? 'Hoạt động' : 'Ngừng hoạt động'  }} </TableCell>
          <TableCell>
            <Button @click="handleDeleteDepart(depart._id)">
              Xóa
            </Button>
            <Button @click="handleEditDepart(depart)" class="ml-2">
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