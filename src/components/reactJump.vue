<template>
    <div class="rect-jump-comp">
        <div class="a" :style="playState"></div>
        <div class="b" :style="playState"></div>
        <div class="c" :style="playState"></div>
        <div class="d" :style="playState"></div>
    </div>
</template>
<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
    running: { type: Boolean, default: false },
})
const playState = computed(() => {
    return {
        animationPlayState: props.running ? 'running' : 'paused'
    }
})


</script>
<style scoped>
.a {
    animation: .8s linear .4s infinite alternate none slidein;
}
.b {
    animation: .8s linear -.4s infinite alternate none  slidein;
}
.c {
    animation: .8s linear -.2s infinite alternate none  slidein;
}
.d {
    animation: .8s linear -.5s infinite alternate none  slidein;
}
.rect-jump-comp {
    width: 36px;
    height: 36px;
    display: flex;
    background: transparent;
    border-radius: 50%;
    padding: 8px;
    transform: translate(-50%, -50%) rotate(180deg);
    position: absolute;
    bottom: 0%;
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
        height: 100%;
    }

    to {
        height: 0;
    }
}
</style>