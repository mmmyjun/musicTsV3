<template>
    <div class="rect-jump-comp">
        <div class="a" ref="aRef" :style="selfStyle"></div>
        <div class="b" :style="selfStyleB"></div>
        <div class="c" :style="selfStyleC"></div>
        <div class="d" :style="selfStyleD"></div>
    </div>
</template>
<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
    running: { type: Boolean, default: true },
})
const playState = computed(() => {
    return props.running ? 'running' : 'paused';
})
const selfStyle = computed((e) => {
    return {
        animation: '.7s linear 0s infinite alternate slidein ' + playState.value
    }
})
const selfStyleB = computed((e) => {
    return {
        animation: '.7s linear .3s infinite alternate slidein ' + playState.value
    }
})
const selfStyleC = computed((e) => {
    return {
        animation: '.7s linear .6s infinite alternate slidein ' + playState.value
    }
})
const selfStyleD = computed((e) => {
    return {
        animation: '.7s linear .9s infinite alternate slidein ' + playState.value
    }
})

</script>
<style scoped>
.rect-jump-comp {
    width: 28px;
    height: 28px;
    display: flex;
    background: transparent;
    border-radius: 50%;
    padding: 8px;
    transform: translate(-50%, -50%) rotate(180deg);
    position: absolute;
    top: 50%;
    left: 50%;
}

.rect-jump-comp div {
    flex: 1;
    padding: 0 1px;
    height: 10px;
    background: #fff;
    border: .5px solid #f6e7e7;
}
</style>
<style>
@keyframes slidein {
    from {
        height: 90%;
    }

    to {
        height: 0;
    }
}
</style>