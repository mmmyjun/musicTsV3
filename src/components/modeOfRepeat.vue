<template>
    <div class="repeat-mode-container">
        <!-- 列表循环 -->
        <el-tooltip content="列表循环" placement="top" v-if="repeatMode == 0" >
           <svg @click="toggleRepeatMode(1)" class="icon-m" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="LoopIcon"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"></path></svg>
        </el-tooltip>
        <!-- 单曲循环 -->
        <el-tooltip content="单曲循环" placement="top" v-if="repeatMode == 1" >
            <svg  @click="toggleRepeatMode(2)" class="icon-m" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="RepeatOneIcon"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"></path></svg>
        </el-tooltip>
        <!-- 随机播放 -->
        <el-tooltip content="随机播放" placement="top" v-if="repeatMode == 2" >
            <svg @click="toggleRepeatMode(0)" class="icon-m" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ShuffleIcon"><path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"></path></svg>
        </el-tooltip>
    </div>
</template>
<script setup lang="ts">
import { computed} from "vue"

const props = defineProps({
    repeatMode: { type: Number, default: 0 },
})
let repeatMode = computed(() => {
    return props.repeatMode
})
const emits = defineEmits(['change'])
const toggleRepeatMode = (e: number) => {
    emits('change', e)
}

</script>
<style scoped>
.rect-jump-comp {
    width: 36px;
    height: 36px;
    display: flex;
    background: transparent;
    border-radius: 50%;
    padding: 10px;
    transform: rotate(180deg);
    position: absolute;
    top: 0;
}

.rect-jump-comp div {
    flex: 1;
    padding: 0 3px;
    height: 10px;
    background: pink;
    border: 1px solid aliceblue;
}
</style>
