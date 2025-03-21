<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createDepart } from '~/lib/api/depart'
import { toast } from '~/components/ui/toast'

interface Depart {
    departName: string,
    description: string,
    isActive: boolean
}

const depart = ref<Depart>({
    departName: '',
    description: '',
    isActive: true
})

const createDeparts = async () => {
    const response = await createDepart(depart.value)
    if (response) {
        toast({
            title: 'Success',
            description: 'Create depart successful',
            duration: 5000,
        });
    }

}


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
                        <BreadcrumbPage>Thêm phòng ban</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    </header>
    <Toaster />
    <form class="p-6 bg-white rounded-lg shadow-md space-y-6" @submit="createDeparts">
        <div class="flex-1">
            <Label for="userName" class="text-sm font-medium text-gray-700">Tên phòng ban</Label>
            <Input id="userName" type="text" required placeholder="" v-model="depart.departName" class="w-full" />
        </div>

        <div class="flex space-x-4">
            <div class="flex-1">
                <Label class="text-sm font-medium text-gray-700">Mô tả</Label>
                <Textarea class="resize-none" rows="10" placeholder="Type your message here."
                    v-model="depart.description" />
            </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center mt-4">
            <Button type="submit">
                Thêm
            </Button>
        </div>
    </form>
</template>