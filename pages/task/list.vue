<script setup lang="ts">
import { listTasks } from '~/lib/api/task';


interface Task {
  name: string;
    description: string;
    assignedTo: string; // ID của người phụ trách
    projectId: string; // ID của dự án
    status: string;
    priority: string;
    deadline: string;
}

const tasks = ref<Task[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 5

const listTask = async (page: number) => {
  try {
    const response = await listTasks(page, limit)
    tasks.value = response.data;
    totalPages.value = Math.max(response.totalPages, 1)
    console.log('API Response:', response)
    console.log('Total Pages:', totalPages.value)
  } catch (e) {
    console.error('Error loading tasks:', e)
  }
}

const handlePageChange = async (page: number) => {
  currentPage.value = page
  await listTask(page)
}

onMounted(() => {
  listTask(1)
})

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
              Công việc
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Danh sách</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </header>
  <div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]">STT</TableHead>
          <TableHead>Công việc</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead>Thuộc dự án</TableHead>
          <TableHead>Người phụ trách</TableHead>
          <TableHead>Tiến độ</TableHead>
          <TableHead>Mức độ ưu tiên</TableHead>
          <TableHead>Ngày kết thúc</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(task, index) in tasks" :key="task._id">
          <TableCell class="font-medium">{{ (currentPage - 1) * limit + index + 1 }}</TableCell>
          <TableCell>{{ task.name }}</TableCell>
          <TableCell>{{ task.description }}</TableCell>
          <TableCell>{{task.projectId }}</TableCell>
          <TableCell>{{ task.assignedTo }}</TableCell>
          <TableCell>{{ task.status }}</TableCell>
          <TableCell>{{ task.priority }}  </TableCell>
          <TableCell>{{ task.deadline }}</TableCell>
          <TableCell>
            <Button @click="" class="ml-2">
              Chi tiết
            </Button>
            <Button @click="" class="ml-2">
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