<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '~/components/ui/toast';

interface Depart {
  _id?: string;
  departName: string;
  description: string;
  isActive: boolean;
}

const route = useRoute();

// Lấy dữ liệu từ query params
const depart = ref<Depart>({
  _id: route.query._id as string,
  departName: route.query.departName as string || '',
  description: route.query.description as string || '',
  isActive: route.query.isActive === 'true' // Chuyển đổi giá trị boolean
});

// Hàm cập nhật phòng ban (giả lập)
const handleUpdateDepart = async () => {
  try {
    console.log('Dữ liệu cập nhật:', depart.value);
    toast({
      title: "Thành công",
      description: "Cập nhật phòng ban thành công",
    });
    navigateTo('/depart'); // Quay về danh sách phòng ban
  } catch (error) {
    console.error('Lỗi khi cập nhật phòng ban:', error);
    toast({
      title: "Lỗi",
      description: "Không thể cập nhật phòng ban",
      variant: "destructive",
    });
  }
};

definePageMeta({
  layout: "default",
});

</script>

<template>
  <header class="flex h-16 items-center gap-2 px-4">
    <h1 class="text-xl font-bold">Chỉnh sửa phòng ban</h1>
  </header>
  <Toaster />
  <form class="p-6 bg-white rounded-lg shadow-md space-y-6" @submit.prevent="handleUpdateDepart">
    <div class="flex-1">
      <Label for="departName" class="text-sm font-medium">Tên phòng ban</Label>
      <Input id="departName" type="text" required v-model="depart.departName" class="w-full" />
    </div>

    <div class="flex-1">
      <Label class="text-sm font-medium">Mô tả</Label>
      <Textarea rows="5" v-model="depart.description" class="w-full resize-none" />
    </div>

    <div class="flex-1">
      <Label class="text-sm font-medium">Trạng thái</Label>
      <select v-model="depart.isActive" class="w-full border p-2 rounded">
        <option :value="true">Hoạt động</option>
        <option :value="false">Ngừng hoạt động</option>
      </select>
    </div>

    <div class="flex justify-center mt-4">
      <Button type="submit">Lưu thay đổi</Button>
    </div>
  </form>
</template>
