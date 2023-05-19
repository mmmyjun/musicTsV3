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
import { computed } from 'vue'
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
.loading-circle-container .left {
    padding: 0;
}
.loading-circle-container .right {
    color: #000;
    padding-right: 2px;
}
</style>
<style scoped>
.outer-circle {
    width: 26px;
    height: 26px;
    border: 1px solid gainsboro;
    background-image: linear-gradient(rgb(255, 10, 51), blue);;
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
        transform: scale(0.2);
        opacity: 1;
    }
    to {
        transform: scale(0.8);
        opacity: 0;
    }
}
</style>