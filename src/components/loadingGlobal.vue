<template>
    <el-dialog class="loading-circle-dialog" v-model="dialogVisible" width="100px" :close-on-click-modal="false" :show-close="false" top="40vh">
        <div class="loading-circle-container">
            <div class="left">
                <div class="outer-circle">
                    <div class="inner-circle"></div>
                </div>
            </div>
            <div class="right">搜索中...</div>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, useSlots, computed, defineEmits } from 'vue'
const props = defineProps({
    loading: { type: Boolean, default: true },
    value: { type: Number, default: 0 },
    max: { type: Number, default: 1 }
})
const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
    get: () => props.loading,
    set: (val) => {
        emit("update:modelValue", val)
    }
})

</script>
<style>
.loading-circle-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
.loading-circle-dialog .el-dialog__header {
    display: none;
}

.loading-circle-dialog .el-dialog__body {
    padding: 6px;
    color: #fff !important;
}
.loading-circle-container .right {
    color: #000
}
</style>
<style scoped>
.outer-circle {
    width: 28px;
    height: 28px;
    border: 1px solid gainsboro;
    background-image: linear-gradient(#ff00f8, #cece52,pink,green, blue);;
    animation: circleBig 1s ease infinite;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
}
.inner-circle {
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    border: 1px solid gainsboro;
    background: #f9f9f9;
    border-radius: 50%;
}
@keyframes circleBig {
    from {
        transform: scale(0.6);
        opacity: 1;
    }
    to {
        transform: scale(0.9);
        opacity: 0;
    }
}
</style>