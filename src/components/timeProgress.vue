<template>
    <div class="time-progress-container" ref="timeProgressContainerRef" @mousemove="mousemoveHandler">
        <el-tooltip v-model:visible="visible" :content="ganTip" placement="top" effect="dark" trigger="click"
            virtual-triggering :virtual-ref="triggerRef" />
        <el-slider :step=".0001" class="slider-ref" ref="sliderRef" :show-tooltip="false" @mouseenter="mouseenter"
            @mousemove="mouseenter" @mouseleave="mouseleave" :modelValue="value" @update:modelValue="updateVal" />
        <div class="cache-pro" :style="{ width: cacheWidth + '%' }"></div>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, shallowRef, nextTick } from 'vue'
const emit = defineEmits(['change', 'emitEnd'])
const props = defineProps({
    value: { type: Number, default: 0 },
    cacheWidth: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 },
})

let totalTime = computed(() => {
    return props.totalTime
})
const formatT = (time: number) => {
    let integer: number = parseInt(String(time))
    let minute = String(Math.floor(integer / 60)).padStart(2, '0')
    let ss = String(Math.floor(integer % 60)).padStart(2, '0')
    return minute + ':' + ss
}
const formatTooltip = (val: number) => {
    if (value.value == 100) {
        emit('emitEnd')
    }
    return formatT(val) + ' / ' + totalTime.value
}

const sliderRef = shallowRef<HTMLAudioElement>()
const timeProgressContainerRef = shallowRef<HTMLAudioElement>()

const value = computed(() => {
    return props.value || 0
})
let cacheWidth = computed(() => {
    return props.cacheWidth > 100 ? 100 : props.cacheWidth
})

const ganTip = ref('0%')

const mouseenter = (e: MouseEvent) => {
    nextTick(() => {
        let target = e.target as HTMLDivElement
        let isBtnWrapper = (target.classList)?.contains("el-slider__button-wrapper")
        let isBtn = (target.classList)?.contains("el-slider__button")
        let firstP = isBtnWrapper ? target.offsetLeft : (isBtn ? (target!.offsetParent as HTMLDivElement).offsetLeft : e.offsetX)
        visible.value = true
        let percent = Number(firstP / (timeProgressContainerRef.value?.clientWidth || 1)) || 0
        let curT = Number(totalTime.value) * percent
        ganTip.value = formatT(curT) + ' / ' + formatT(totalTime.value)
    })

}
const mouseleave = (e: Event) => {
    visible.value = false
}

const visible = ref(false)
const position = ref({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
})
const triggerRef = ref({
    getBoundingClientRect() {
        return position.value
    },
})

const mousemoveHandler = (e: MouseEvent) => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect()
    let pe = DOMRect.fromRect({
        width: 0,
        height: 0,
        x: e.clientX,
        y: rect.y,
    })
    position.value = pe
}

const updateVal = (e: number) => {
    emit('change', e)
}
</script>
<style scoped>
.time-progress-container {
    position: relative;
    align-items: center;
}

.time-progress-container :deep(.el-slider) {
    height: 0;
}

.cache-pro {
    width: 100%;
    height: 6px;
    background: #badfff;
    position: absolute;
    top: -3px;
    border-radius: 3px;
    pointer-events: none;
}

.time-progress-container :deep(.el-slider__bar) {
    z-index: 1;
}
</style>