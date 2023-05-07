<template>
    <div class="cur-music-container" v-if="currentPlayingObj.id">
        <div class="left" @click="getLrc(currentPlayingObj)">
           <el-skeleton animated class="imgIsLoading" v-if="currentPlayingObj.loadingLrc">
                <template #template>
                    <el-skeleton-item variant="image" style="width: 88px; height: 88px;border-radius: 50%;" />
                </template>
            </el-skeleton>
            <div class="bgImg" v-else :style="styleImg(currentPlayingObj)"></div>

            <el-icon v-show="!currentPlayingObj.hasError" class="upIcon VideoPlay cursorPointer"
                @click.stop="toPlayAudio" v-if="!currentPlayingObj.isPlaying">
                <VideoPlay />
            </el-icon>
            <el-icon v-show="!currentPlayingObj.hasError" class="upIcon VideoPause cursorPointer"
                @click.stop="toPauseAudio" v-else>
                <VideoPause />
            </el-icon>
        </div>
        <div class="center">
            <div class="musicName">
                <div class="long long-cur">{{ currentPlayingObj.loadingLrc ? '正在下载歌词..' : (!currentPlayingObj.lrc || !currentPlayingObj.lrc.length ? '暂无歌词' : currentPlayingObj.currentLong) }}</div>
                <div class="long-name">{{ currentPlayingObj.name }} &nbsp;<span class="artist">{{ currentPlayingObj.artist
                }}</span></div>
            </div>
            <div class="time-progress">
                <div class="time-pro-left">
                    <timeProgress :currentTime="currentTime" @emitEnd="endPlay" :totalTime="totalTime"  :value="currentTWidth" :cacheWidth="cacheWidth" @change="changeCurTime" />
                    <audio style="height: 0;opacity:0" ref="audioRef" :src="currentPlayingObj.url" @progress="propgressEvent"
                        @loadedmetadata="loadedmetadata" preload="auto" @timeupdate="changeAudio"
                        @error="errorPlay" @play="startPlay" @ended="endPlay" @pause="pausePlay" />
                    <musicTime :currentTime="currentTime" :totalTime="totalTime" />
                </div>
                <div class="time-pro-right">
                    <volume v-if="!isMobile" class="cur-op-right" v-show="!currentPlayingObj.hasError" @change="chagneVol" />
                    <el-tooltip  class="cur-op-right" content="播放列表" placement="top">
                        <div class="to-play-list">
                            <svg @click="setPlayedListVisible"
                                class="icon-m MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                                focusable="false" aria-hidden="true" viewBox="0 0 24 24"
                                data-testid="PlaylistPlayIcon">
                                <path d="M3 10h11v2H3zm0-4h11v2H3zm0 8h7v2H3zm13-1v8l6-4z"></path>
                            </svg>
                        </div>
                    </el-tooltip>
                    <modeOfRepeat class="mode-repeat cur-op-right" :repeatMode="repeatMode" @change="toggleRepeatMode" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, shallowRef,useSlots, computed, onMounted, nextTick, CSSProperties, reactive } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus'
import volume from './volume.vue'
import modeOfRepeat from './modeOfRepeat.vue'
import timeProgress from './timeProgress.vue'
import musicTime from './musicTime.vue'

const props = defineProps({
  modelValue: {
    default: {
        id: '',
        name: '',
        artist: '',
        poster: '',
        lrc: [],
        loadingLrc: false
    }
  },
  currentTime: {type: Number, default: 0},
  totalTime: {type: Number, default: 0},
  repeatMode: { default: 0},
})
const emit = defineEmits(['getLrc','update:modelValue','update:currentTime','update:totalTime','update:repeatMode', 'playNextOne', 'setPlayedListVisible']);

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)

const setPlayedListVisible = (e: any): void => {
    emit('setPlayedListVisible')
}

const currentPlayingObj = computed<TypePlaying>({
    get: () => props.modelValue,
    set: (val) => {
        emit("update:modelValue", val);
    }
});
const currentTime = computed<number>({
    get: () => props.currentTime,
    set: (val) => {
        emit("update:currentTime", val);
    }
})
const totalTime = computed<number>({
    get: () => props.totalTime,
    set: (val) => {
        emit("update:totalTime", val)  
    }
})
const repeatMode = computed({
    get: () => props.repeatMode,
    set: (val) => {
        emit("update:repeatMode", val)
    }
})


const toggleRepeatMode = (e: RepeatMode) => {
    repeatMode.value = e
    localStorage.setItem('__repeat_mode', String(e))
}

const getLrc = async (item: TypePlaying) => {
    emit('getLrc', item)
}


const audioRef = shallowRef<HTMLAudioElement>() // audio对象存储
let localV_ = localStorage.getItem('_volume');
if (audioRef.value as HTMLAudioElement && audioRef.value?.volume) {
    if (!localV_) {
        localStorage.setItem('_volume', '0.4');
    }
    audioRef.value!.volume = Number(JSON.parse(localV_ as string))
}

// 歌词的数据结构
interface TypeOfLrc { 
    text: string,
    time: number
}
const changeAudio = (e: Event) => {
    if (audioRef.value && audioRef.value!.currentTime) {
        currentTime.value = audioRef.value!.currentTime
    }
    let idx = -1
    if (audioRef.value && audioRef.value!.currentTime && typeof audioRef.value!.currentTime == 'number' && currentPlayingObj.value.lrc && currentPlayingObj.value.lrc.length) {
        idx = currentPlayingObj.value.lrc.findLastIndex((f: TypeOfLrc) => f.time <= audioRef.value!.currentTime)
    }
    if (idx == -1) {
        return
    };
    currentPlayingObj.value.currentLong = currentPlayingObj.value.lrc[idx].text
}

const currentTWidth = computed(() => {
    let pre: number = Math.ceil(currentTime.value);
    let suf: number = Math.ceil(totalTime.value);
    let last: number = Number((pre / suf).toFixed(2)) * 100
    return last ? last : 0
})
const cacheWidth = ref(0)
const changeCurTime = (e: number) => {
    let curT = parseInt(String(e * totalTime.value / 100))
    currentTime.value = curT
    audioRef.value!.currentTime = curT
}
const propgressEvent = (e: Event) => {
    const buffered = audioRef.value?.buffered!;
    let bufferedEnd: number;
    try {
        bufferedEnd = buffered.end(buffered.length - 1);
    }
    catch (err) {
        bufferedEnd = 0;
    }
    cacheWidth.value = (bufferedEnd / totalTime.value) * 100
}

const errorPlay = (e: any): void => {
    ElMessage.error(`"${currentPlayingObj.value.name}"播放错误,已移除`)
    currentPlayingObj.value.hasError = true
     emit('playNextOne', true)
}
const startPlay = (e?: any): void => {
    currentPlayingObj.value.isPlaying = true
}

const pausePlay = (e?: any): void => {
    currentPlayingObj.value.isPlaying = false
}
const chagneVol = (e: any): void => {
    audioRef.value!.volume = Number(e)
}

const toPlayAudio = (e: Event) => {
    try {
        audioRef.value?.play()
    } catch (e) {
    }
}
const toPauseAudio = (e: Event) => {
    audioRef.value?.pause()
    currentPlayingObj.value.isPlaying = false
}


// duration(总时长)等信息读取到了， 已准备就绪可以开始播放了
const loadedmetadata = (e: Event) => {
    console.log('loadedmetadata~~')
    currentTime.value = 0
    totalTime.value = audioRef.value!.duration || 0
    let localV_ = localStorage.getItem('_volume');
    if (audioRef.value as HTMLAudioElement && audioRef.value?.volume) {
        if (!localV_) {
            localStorage.setItem('_volume', '0.4');
        }
        audioRef.value!.volume = Number(JSON.parse(localV_ as string))
    }
    tryToAutoPlay()
}
const tryToAutoPlay = () => {
    try {
        audioRef.value?.play()
    }
    catch (err) {
        console.log('auto play failed because of browser security policy. ', err)
        currentTime.value = 0
        totalTime.value = 0
    }
}

// 设置3秒后自动播放下一首
const timer = ref(0)
const endPlay = (event?: any): void => {
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
        emit('playNextOne', false)
    }, 3000);
}

const playState = computed(() => {
    return currentPlayingObj.value.isPlaying ? 'running' : 'paused';
})

const styleImg = (obj: TypePlaying) => {
    return {
        backgroundImage: `url(${obj.poster})`,
        animation: '7s linear infinite rotate360 ' + playState.value
    }
}

defineExpose({
    toPlayAudio,
    toPauseAudio,
    tryToAutoPlay
})
</script>
<style>
.cur-music-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: 100px;
    background-color: #111;
    color: #fff;
}

.cur-music-container .left,
.cur-music-container .right {
    width: 88px;
    height: 88px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

@keyframes rotate360 {
    from{
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
.cur-music-container .right {
    rotate: 90deg;
}

.cur-music-container .center {
    width: calc(100% - 96px);
    text-align: left;
}
.cur-music-container .center > div {
    padding-left: 8px;
}

.cur-music-container img {
    width: 100%;
    height: 100%;
}

.cur-music-container .upIcon {
    position: absolute;
    top: 0;
    left: 0;
    color: white;
    width: 100%;
    height: 100%;
    font-size: 48px;
    z-index: 10;
}
.cur-music-container .artist {
    color: grey
}
.cur-music-container > div {
    height: 100%;
}

.cur-music-container .upIcon svg {
    stroke-width: 10px;
}

.cur-music-container .time-progress-container {
    margin-top: 16px;
}
.cur-music-container .time-progress {
    display: flex
}

.cur-op-right,
.cur-op-right svg {
    color: #fff;
    fill: #fff;
}

.time-pro-left {
    width: 70%;
    line-height: 42px;
    height: 42px;
    display: flex;
    flex-direction: column;
}
.time-pro-right {
    display: flex;
    width: 30%;
}

.time-pro-right>div {
    width: 40px;
    text-align: center;
}
.artist {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
}
.long-cur {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 96%;
    white-space: nowrap;
    height: 24px;
}

.long-name {
    font-size: 14px;
    height: 26px;
}
</style>