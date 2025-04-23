<script setup lang="ts">
import { listProject } from '~/lib/api/project';
import { computed } from 'vue';
import { definePageMeta } from '#build/imports';

interface User {
  _id: string;
  username: string;
}

interface Project {
  _id: string,
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  managerId: User; // Sửa lại để chứa thông tin user thay vì chỉ là string
  teamMembers: User[]; // Sửa lại để chứa danh sách user object thay vì string[]
}


const projects = ref<Project[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 5

const listProjects = async (page: number) => {
  try {
    const response = await listProject(page, limit)
    projects.value = response.data
    totalPages.value = Math.max(response.totalPages, 1)
    console.log('API Response:', response)
    console.log('Total Pages:', totalPages.value)
  } catch (e) {
    console.error('Error loading projects:', e)
  }
}

const handlePageChange = async (page: number) => {
  currentPage.value = page
  await listProjects(page)
}

onMounted(() => {
  listProjects(1)
})

const calculateMonthsAndDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonthDays = new Date(end.getFullYear(), end.getMonth(), 0).getDate(); // Lấy số ngày của tháng trước
    days += previousMonthDays;
  }

  return `${months} tháng ${days} ngày`;
};
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
              Dự án
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Danh sách dự án</BreadcrumbPage>
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
          <TableHead>Tên dự án</TableHead>
          <TableHead>Ngày bắt đầu</TableHead>
          <TableHead>Ngày kết thúc</TableHead>
          <TableHead>Thời gian còn lại</TableHead>
          <TableHead>Quản lý chính</TableHead>
          <TableHead>Thành viên</TableHead>
          <TableHead>Công cụ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(project, index) in projects" :key="project._id">
          <TableCell class="font-medium">{{ (currentPage - 1) * limit + index + 1 }}</TableCell>
          <TableCell>{{ project.name }}</TableCell>
          <TableCell>{{ project.startDate }}</TableCell>
          <TableCell>{{ project.endDate }}</TableCell>
          <TableCell>{{ calculateMonthsAndDays(project.startDate, project.endDate) }}</TableCell>
          <TableCell>{{ project.managerId.username }}</TableCell>
          <TableCell>
            {{project.teamMembers.map(member => member.username.charAt(0).toUpperCase() +
              member.username.slice(1)).join(', ') }}
          </TableCell>

          <TableCell>
            <Button @click="">
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