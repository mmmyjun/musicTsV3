<template>
    <div class="rect-jump-comp">
        <div class="a" ref="aRef" :style="selfStyle"></div>
        <div class="b" :style="selfStyleB"></div>
        <div class="c" :style="selfStyleC"></div>
        <div class="d" :style="selfStyleD"></div>
    </div>
</template>
<script setup lang="ts">
import { ref, shallowRef, computed, CSSProperties, reactive } from "vue"

const props = defineProps({
    running: { type: Boolean, default: true },
})
const playState = computed(() => {
    return props.running ? 'running' : 'paused';
})
const selfStyle = computed((e) => {
    return {
        animation: '.5s linear .8s infinite alternate slidein ' + playState.value
    }
})
const selfStyleB = computed((e) => {
    return {
        animation: '.5s linear .6s infinite alternate slidein ' + playState.value
    }
})
const selfStyleC = computed((e) => {
    return {
        animation: '.5s linear .4s infinite alternate slidein ' + playState.value
    }
})
const selfStyleD = computed((e) => {
    return {
        animation: '.5s linear 0s infinite alternate slidein ' + playState.value
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
    transform: rotate(180deg);
    position: absolute;
    top: 0;
}
.rect-jump-comp div {
    flex: 1;
    padding: 0 1px;
    height: 10px;
    background: #fff;
    border: 1px solid #cecece;
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