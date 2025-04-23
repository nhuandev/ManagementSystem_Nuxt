<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@/components/ui/input';
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue';
import { createProject } from '~/lib/api/project'
import { listUser } from '~/lib/api/user'
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'

import { definePageMeta } from '#build/imports';

interface Project {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  managerId: Object;
  teamMembers: Object[];
}
const { toast } = useToast()

const users = ref<{ _id: string, username: string, role: string }[]>([]); // Danh sách người dùng từ API
const modelValue = ref<string[]>([]); // ID Danh sách các thành viên đã chọn
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

    if (response.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: response.message,
      });
    } else {
      toast({
        title: 'Thất bại',
        description: response.message,
        variant: 'destructive',
      });

    }

  } catch (error) {
    toast({
      title: 'Lỗi',
      description: 'Create project error',
      variant: 'destructive',
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

// Danh sách quản lý
const managerUsers = computed(() => {
  return users.value.filter(user => user.role === 'MANAGER');
});

// watch(modelValue, (newValue) => {
//   project.value.teamMembers = newValue;
// }, { deep: true });

definePageMeta({
  layout: "default",
});

</script>

<template>
  <Toaster />
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
  <form class="p-6 bg-white rounded-lg shadow-md space-y-6" @submit.prevent="createProjects">
    <!-- Tên dự án -->
    <div class="flex-1">
      <Label for="name">Tên dự án</Label>
      <Input id="name" type="text" placeholder="Nhập tên dự án" v-model="project.name" />
    </div>

    <!-- Mô tả dự án -->
    <div class="flex-1">
      <Label for="description">Mô tả</Label>
      <Textarea id="description" rows="10" type="text" placeholder="Nhập mô tả" v-model="project.description"/>
    </div>


    <div class="flex space-x-6">
      <div class="flex-1">
        <Label for="role" class="text-sm font-medium text-gray-700">Trạng thái</Label>
        <Select v-model="project.status">
          <SelectTrigger class="w-[180px]">
            <SelectValue />
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

      <div class="flex-1">
      
      <!-- Thêm thành viên dựa trên modelvalue -->
      <Label for="managerId">Thành viên tham gia</Label>
      <TagsInput class="px-0 gap-0 w-80" :model-value="modelValue" >
        <div class="flex gap-2 flex-wrap items-center px-3">
          <TagsInputItem v-for="item in modelValue" :key="item" :value="item" v-model="project.teamMembers">
            <span>{{ users.find(u => u._id === item)?.username || 'Không xác định'}}</span>
            <TagsInputItemDelete />
          </TagsInputItem>
        </div>
        
        <ComboboxRoot v-model="modelValue" v-model:open="open" v-model:search-term="searchTerm" class="w-full">
          <ComboboxAnchor as-child>
            <ComboboxInput placeholder="Tìm kiếm thành viên..." as-child>
              <TagsInputInput class="w-full px-3" :class="modelValue.length > 0 ? 'mt-2' : ''" @keydown.enter.prevent />
            </ComboboxInput>
          </ComboboxAnchor>
          
          
          <ComboboxPortal>
            <ComboboxContent>
              <CommandList position="popper"
                class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md">
                <CommandEmpty v-if="filteredUsers.length === 0">Không tìm thấy</CommandEmpty>
                <CommandGroup>
                  <CommandItem v-for="user in filteredUsers" :key="user._id" :value="user.username" @select.prevent="(ev) => {
                    const selectedUser = users.find(u => u.username === ev.detail.value);
                    if (selectedUser && !modelValue.includes(selectedUser._id)) {
                      searchTerm = '';
                      modelValue.push(selectedUser._id); // Lưu ID 
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

      <!-- Chọn người quản lý -->
      <div class="flex-1">
        <Label for="managerId">Người quản lý</Label>
        <select id="managerId" v-model="project.managerId" class="w-full p-2 border rounded">
          <option v-for="user in managerUsers" :key="user._id" :value="user._id">
            {{ user.username }}
          </option>
        </select>
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

    <Button>Tạo dự án</Button>
  </form>
</template>