<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@/components/ui/input';
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue';
import { createProject } from '~/lib/api/project'
import { listUser } from '~/lib/api/user'
import { useRouter } from 'vue-router';
import { toast } from '~/components/ui/toast'

interface Project {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  managerId: string;
  teamMembers: string[];
}

const users = ref<{ id: string, username: string }[]>([]); // Danh sách người dùng từ API
const modelValue = ref<string[]>([]); // Danh sách các thành viên đã chọn
const open = ref(false); // Điều khiển trạng thái của combobox
const searchTerm = ref(''); // Từ khóa tìm kiếm

const project = ref<Project>({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: '',
  managerId: '',
  teamMembers: modelValue.value
});

// Hàm tạo dự án
const createProjects = async () => {
  try {
    const message = ref('');
    console.log("Project data being sent:", project.value);
    const response = await createProject(project.value)

    if (response) {
      toast({
        title: 'Success',
        description: 'Create project successful',
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
      description: 'Create project error',
      duration: 5000,
    });
    console.error('Error:', error)
  }

};

const fetchUsers = async () => {
  try {
    const response = await listUser(0, 0);
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const filteredUsers = computed(() => {
  return users.value.filter(user => !modelValue.value.includes(user.username));
});
onMounted(fetchUsers);
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
            <BreadcrumbLink href="#">Dự án</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Thêm dự án</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </header>

  <!-- Form tạo dự án -->
  <form class="p-6 bg-white rounded-lg shadow-md space-y-6" @submit="createProjects">
    <div class="flex space-x-6">
      <!-- Tên dự án -->
      <div class="flex-1">
        <Label for="name">Tên dự án</Label>
        <Input id="name" type="text" placeholder="Nhập tên dự án" v-model="project.name" />
      </div>

      <!-- Mô tả dự án -->
      <div class="flex-1">
        <Label for="description">Mô tả</Label>
        <Input id="description" type="text" placeholder="Nhập mô tả" v-model="project.description" />
      </div>
    </div>

    <div class="flex space-x-6">
      <!-- Ngày bắt đầu -->
      <div class="flex-1">
        <Label for="startDate">Ngày bắt đầu</Label>
        <Input id="startDate" type="date" v-model="project.startDate" />
      </div>

      <!-- Ngày kết thúc -->
      <div class="flex-1">
        <Label for="endDate">Ngày kết thúc</Label>
        <Input id="endDate" type="date" v-model="project.endDate" />
      </div>
    </div>

    <div class="flex space-x-6">
      <div class="flex-1">
        <Label for="role" class="text-sm font-medium text-gray-700">Role</Label>
        <Select v-model="project.status">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Trạng thái</SelectLabel>
              <SelectItem value="PENDING">
                PENDING
              </SelectItem>

              <SelectItem value="PROGRESS">
                PROGRESS
              </SelectItem>

              <SelectItem value="COMPLETED">
                COMPLETED
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <!-- Chọn người quản lý -->
      <div class="flex-1">
        <Label for="managerId">Người quản lý</Label>
        <select id="managerId" v-model="project.managerId" class="w-full p-2 border rounded">
          <option v-for="user in users" :key="user.id" :value="user._id">
            {{ user.username }} ({{ user.email }})
          </option>
        </select>
      </div>
    </div>

    <!-- Thành viên dự án -->
    <div class="flex space-x-6">
      <div class="flex-1">
        <Label for="teamMembers">Thành viên</Label>
        <TagsInput class="px-0 gap-0 w-80" :model-value="modelValue">
          <div class="flex gap-2 flex-wrap items-center px-3">
            <TagsInputItem v-for="item in modelValue" :key="item" :value="item" v-model="project.teamMembers">
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>
          </div>

          <!-- Combobox để chọn người dùng -->
          <ComboboxRoot v-model="modelValue" v-model:open="open" v-model:search-term="searchTerm" class="w-full">
            <ComboboxAnchor as-child>
              <ComboboxInput placeholder="Tìm kiếm thành viên..." as-child>
                <TagsInputInput class="w-full px-3" :class="modelValue.length > 0 ? 'mt-2' : ''"
                  @keydown.enter.prevent />
              </ComboboxInput>
            </ComboboxAnchor>

            <!-- Di chuyển ComboboxPortal và ComboboxContent vào trong ComboboxAnchor để hiển thị dưới thanh tìm kiếm -->
            <ComboboxPortal>
              <ComboboxContent>
                <CommandList position="popper"
                  class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md">
                  <CommandEmpty v-if="filteredUsers.length === 0">Không tìm thấy</CommandEmpty>
                  <CommandGroup>
                    <CommandItem v-for="user in filteredUsers" :key="user._id" :value="user.username" @select.prevent="(ev) => {
                      if (typeof ev.detail.value === 'string') {
                        searchTerm = '';
                        modelValue.push(ev.detail.value); // Thêm người dùng vào modelValue
                      }
                      if (filteredUsers.length === 0) {
                        open = false;
                      }
                    }">
                      {{ user.username }}
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </ComboboxContent>
            </ComboboxPortal>

          </ComboboxRoot>
        </TagsInput>
      </div>
    </div>

    <Button type="submit">Tạo dự án</Button>
  </form>
</template>