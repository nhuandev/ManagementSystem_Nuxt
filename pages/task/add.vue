<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Input } from '@/components/ui/input';
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue';
import { listUser } from '~/lib/api/user'

import { Toaster } from '@/components/ui/toast'
import { useToast } from '~/components/ui/toast'
import { listProject } from '~/lib/api/project';
import { createTask } from '~/lib/api/task';

const { toast } = useToast()

// Quản lý người dùng
const users = ref<{ _id: string, username: string }[]>([]); 
const selectedUsernames = ref<string[]>([]); 
const openUserCombobox = ref(false); 
const searchTerm = ref(''); 

// Quản lý dự án
const projects = ref<{ _id: string, name: string }[]>([]); 
const selectedProjectNames = ref<string[]>([]); 
const openProjectCombobox = ref(false); 
const searchProject = ref(''); 

// Biến để lưu trữ ID-username và ID-projectname mapping
const userIdMap = ref(new Map());
const projectIdMap = ref(new Map());

// Khởi tạo task với giá trị chuỗi rỗng cho assignedTo và projectId
const task = ref({
  name: "",
  description: "",
  assignedTo: "", // String - ID của người phụ trách
  projectId: "", // String - ID của dự án
  status: "todo",
  priority: "medium",
  deadline: "",
});

const fetchUsers = async () => {
  try {
    const response = await listUser(0, 0);
    users.value = response.data;
    // Tạo mapping giữa username và ID
    users.value.forEach(user => {
      userIdMap.value.set(user.username, user._id);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const fetchProject = async () => {
  try {
    const response = await listProject(0, 0);
    projects.value = response.data;
    
    // Tạo mapping giữa project name và ID
    projects.value.forEach(project => {
      projectIdMap.value.set(project.name, project._id);
    });
  } catch (error) { 
    console.error('Error fetching projects:', error);
  }
};

// Cập nhật task assignedTo khi chọn người dùng
const updateAssignedUser = () => {
  if (selectedUsernames.value.length > 0) {
    // Lấy username đầu tiên (giả sử chỉ 1 người được phụ trách)
    const username = selectedUsernames.value[0];
    // Lấy ID từ map và gán vào task
    task.value.assignedTo = userIdMap.value.get(username) || "";
    console.log("User ID assigned:", task.value.assignedTo);
  } else {
    task.value.assignedTo = "";
  }
};

// Cập nhật task projectId khi chọn dự án
const updateSelectedProject = () => {
  if (selectedProjectNames.value.length > 0) {
    // Lấy project name đầu tiên (giả sử chỉ 1 dự án được chọn)
    const projectName = selectedProjectNames.value[0];
    // Lấy ID từ map và gán vào task
    task.value.projectId = projectIdMap.value.get(projectName) || "";
    console.log("Project ID assigned:", task.value.projectId);
  } else {
    task.value.projectId = "";
  }
};

// Watch cho sự thay đổi của selectedUsernames
watch(selectedUsernames, () => {
  updateAssignedUser();
});

// Watch cho sự thay đổi của selectedProjectNames
watch(selectedProjectNames, () => {
  updateSelectedProject();
});

const filteredUsers = computed(() => {
  return users.value.filter(user => !selectedUsernames.value.includes(user.username));
});

const filteredProject = computed(() => {
  return projects.value.filter(project => !selectedProjectNames.value.includes(project.name));
});

const submitForm = async () => {
    console.log("Submitting task:", task.value);
    
    // Kiểm tra xác nhận lại assignedTo và projectId
    updateAssignedUser();
    updateSelectedProject();
    
    try {
        await createTask(task.value);
        toast({
            title: "Thành công",
            description: "Đã tạo công việc mới",
        });
    } catch (error) {
        console.error("Error creating task:", error);
        toast({
            title: "Lỗi",
            description: "Không thể tạo công việc. Vui lòng thử lại.",
            variant: "destructive"
        });
    }
};

onMounted(() => {
  fetchUsers();
  fetchProject();
});

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
            <BreadcrumbLink href="#">Công việc</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Thêm công việc</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </header>

  <form class="p-6 bg-white rounded-lg shadow-md space-y-6" @submit.prevent="submitForm">
      <div class="flex-1">
        <Label for="name">Công việc</Label>
        <Input id="name" type="text" placeholder="Nhập công việc" v-model="task.name" />
      </div>

      <div class="flex-1">
        <Label for="description">Mô tả</Label>
        <Textarea class="resize-none" rows="10" id="description" type="text" placeholder="Nhập mô tả" v-model="task.description" />    
      </div>

    <div class="flex space-x-6">
      <div class="flex-1">
        <!-- Danh sách người phụ trách -->
        <Label for="teamMembers">Người phụ trách</Label>
        <TagsInput class="px-0 gap-0" :model-value="selectedUsernames">
          <div class="flex gap-2 flex-wrap items-center px-3">
            <TagsInputItem v-for="item in selectedUsernames" :key="item" :value="item">
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>
          </div>

          <ComboboxRoot v-model="selectedUsernames" v-model:open="openUserCombobox" v-model:search-term="searchTerm" class="w-full">
            <ComboboxAnchor as-child>
              <ComboboxInput placeholder="Tìm kiếm..." as-child>
                <TagsInputInput class="w-full px-3" :class="selectedUsernames.length > 0 ? 'mt-2' : ''"
                  @keydown.enter.prevent />
              </ComboboxInput>
            </ComboboxAnchor>

            <ComboboxPortal>
              <ComboboxContent>
                <CommandList position="popper"
                  class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md">
                  <CommandEmpty v-if="filteredUsers.length === 0">Không tìm thấy</CommandEmpty>
                  <CommandGroup>
                    <CommandItem v-for="user in filteredUsers" :key="user._id" :value="user.username" @select.prevent="(ev) => {
                      if (typeof ev.detail.value === 'string') {
                        searchTerm = '';
                        selectedUsernames.push(ev.detail.value);
                        updateAssignedUser(); // Cập nhật ngay khi thêm
                      }
                      if (filteredUsers.length === 0) { 
                        openUserCombobox = false;
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

      <!-- Danh sách dự án -->
      <div class="flex-1">
        <Label for="teamMembers">Dự án</Label>
        <TagsInput class="px-0 gap-0" :model-value="selectedProjectNames">
          <div class="flex gap-2 flex-wrap items-center px-3">
            <TagsInputItem v-for="item in selectedProjectNames" :key="item" :value="item">
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>
          </div>

          <ComboboxRoot v-model="selectedProjectNames" v-model:open="openProjectCombobox" v-model:search-term="searchProject" class="w-full">
            <ComboboxAnchor as-child>
              <ComboboxInput placeholder="Tìm kiếm dự án..." as-child>
                <TagsInputInput class="w-full px-3" :class="selectedProjectNames.length > 0 ? 'mt-2' : ''"
                  @keydown.enter.prevent />
              </ComboboxInput>
            </ComboboxAnchor>

            <ComboboxPortal>
              <ComboboxContent>
                <CommandList position="popper"
                  class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md">
                  <CommandEmpty v-if="filteredProject.length === 0">Không tìm thấy</CommandEmpty>
                  <CommandGroup>
                    <CommandItem v-for="project in filteredProject" :key="project._id" :value="project.name" @select.prevent="(pr) => {
                      if (typeof pr.detail.value === 'string') {
                        searchProject = '';
                        selectedProjectNames.push(pr.detail.value); 
                        updateSelectedProject(); // Cập nhật ngay khi thêm
                      }
                      if (filteredProject.length === 0) {
                        openProjectCombobox = false;
                      }
                    }">
                      {{ project.name }}
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </ComboboxContent>
            </ComboboxPortal>
          </ComboboxRoot>
        </TagsInput>
      </div>
    </div>

    <div class="flex space-x-6">
      <div class="flex-1">
        <Label for="role" class="text-sm font-medium text-gray-700">Trạng thái</Label>
        <Select v-model="task.status">
          <SelectTrigger>
            <SelectValue placeholder="Lựa chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Trạng thái</SelectLabel>
              <SelectItem value="todo">
                Đã giao
              </SelectItem>

              <SelectItem value="in_progress">
                Đang xử lý 
              </SelectItem>

              <SelectItem value="done">
                Hoàn thành
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div class="flex-1">
        <Label for="role" class="text-sm font-medium text-gray-700">Mức độ</Label>
        <Select v-model="task.priority">
          <SelectTrigger>
            <SelectValue placeholder="Lựa chọn mức độ" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Mức độ</SelectLabel>
              <SelectItem value="low">
                Thấp
              </SelectItem>

              <SelectItem value="medium">
                Trung bình
              </SelectItem>

              <SelectItem value="high">
                Khẩn cấp
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div class="flex-1">
          <Label for="startDate">Ngày kết thúc</Label>
          <Input id="startDate" type="date" v-model="task.deadline" />
        </div>
      
    </div>

    <Button type="submit">Tạo công việc</Button>
  </form>
</template>