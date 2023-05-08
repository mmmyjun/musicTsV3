<template>
    <div class="music-time-container">
        {{currentTime}} / {{totalTime}}
    </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'

const props = defineProps({
    currentTime: { type: Number, default: 0},
    totalTime: { type: Number, default: 0},
})
let currentTime = computed(() => {
    return formatT(props.currentTime)
})
let totalTime = computed(() => {
    return formatT(props.totalTime)
})

const value = ref(0)

const formatT = (time : number) => {
    let integer: number = parseInt(String(time))
    let minute = String(Math.floor(integer/60)).padStart(2,'0')
    let ss = String(Math.floor(integer%60)).padStart(2,'0')
    return minute + ':' + ss
}

</script>
<style scoped>
.music-time-container {
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    margin-top: 8px;
}

</style>