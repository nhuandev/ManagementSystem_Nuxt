<template>
  <div v-if="$route.name !== 'login'" class="">
    <SlidebarMenu class="" />

    <!-- Nội dung chính, chiếm phần còn lại -->
    <div class="">
      <!-- Nội dung của các trang khác -->
      <!-- <NuxtPage/> -->
    </div>
  </div>

  <!-- Layout dành cho trang login, chỉ hiển thị form login -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <NuxtPage />
  </div>
</template>

