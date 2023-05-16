<template>
    <div class="music-container">
        <loadingGlobal v-model:loading="loadingList" />

        <div class="music-inner">
            <div class="search-container">
                <el-input v-model="keyword" clearable placeholder="输入歌名/歌手名开始搜索" @keyup.enter="toSearch">
                    <template #append>
                        <el-button type="primary" :disabled="!keyword.trim()" :icon="Search" @click="toSearch" />
                    </template>
                </el-input>
                <el-dropdown class="op-global" trigger="click" @command="handleCommand">
                    <el-icon class="more-action black">
                        <MoreFilled />
                    </el-icon>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="removeAllHistory" :icon="Remove">清空缓存数据</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="list-container" :class="{ activeHeight: currentPlayingObj.id }">
                <musicListComp v-if="musicList.length" :currentPlayingObj="currentPlayingObj" :modelValue="musicList"
                    @getLrc="getLrc">
                    <template #rightContent="{ row }">
                        <el-dropdown style="width: 40px"  class="list-action-right" trigger="click" @command="handleCommand($event, row)">
                            <el-icon class="more-action black">
                                <MoreFilled />
                            </el-icon>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="addToPlayList" :icon="CirclePlus">加入播放列表</el-dropdown-item>
                                    <el-dropdown-item command="downLong" :icon="Download">下载歌曲</el-dropdown-item>
                                    <el-dropdown-item command="downLrc" :icon="Download">下载歌词</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                </musicListComp>

                <div class="bottom-list" :class="{ active: musicPlayed.length && showPlayedListVisible }">
                    <curMusic v-if="currentPlayingObj.id" ref="curMusicRef" @setPlayedListVisible="setPlayedListVisible" @getLrc="getLrc"
                        @setMusicPlayed="setMusicPlayed" @playNextOne="nextPlay" v-model:modelValue="currentPlayingObj"
                        v-model:currentTime="currentTime" v-model:totalTime="totalTime" v-model:repeatMode="repeatMode" v-model:cacheWidth="cacheWidth">
                    </curMusic>

                    <div class="playedList-container" v-if="musicPlayed.length && showPlayedListVisible">
                        <div class="title">播放列表({{ musicPlayed.length }})</div>
                        <musicListComp hideListNumResult :currentPlayingObj="currentPlayingObj" class="playedList-lists"
                            :modelValue="musicPlayed" @getLrc="getLrc">
                            <template #rightContent="{ row }">
                                <el-dropdown style="width: 40px" class="list-action-right" trigger="click" @command="handleCommand($event, row)">
                                    <el-icon class="more-action">
                                        <MoreFilled />
                                    </el-icon>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item command="beTop" :icon="Upload">置顶</el-dropdown-item>
                                            <el-dropdown-item command="searchArtist" :icon="User">搜索【<div
                                                    class="dropdownSearchName textHiddenEllipsis">{{ row.artist }}</div>
                                                】</el-dropdown-item>
                                            <el-dropdown-item command="searchLongName" :icon="Search">搜索【<div
                                                    class="dropdownSearchName textHiddenEllipsis">{{ row.name }}</div>
                                                】</el-dropdown-item>
                                            <el-dropdown-item command="removeById" :icon="Delete">移除</el-dropdown-item>
                                            <el-dropdown-item command="downLong" :icon="Download">下载歌曲</el-dropdown-item>
                                            <el-dropdown-item command="downLrc" :icon="Download">下载歌词</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </template>
                        </musicListComp>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Search, Picture as IconPicture, Download, Delete, Upload, User, CirclePlus, Remove } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import musicListComp from './musicList.vue'
import loadingGlobal from './loadingGlobal.vue'
import curMusic from './curMusic.vue'

const loadingList = ref<boolean>(false)
const keyword = ref('') // 关键词
const currentTime = ref<number>(0)
const totalTime = ref<number>(0)

enum RepeatMode {
    byOrder,
    single,
    random
}
let __repeat_mode = localStorage.getItem('__repeat_mode') // 播放重复模式
let repeatMode = ref<RepeatMode>(__repeat_mode ? JSON.parse(__repeat_mode) : RepeatMode.byOrder)

const musicList = ref<TypePlaying[]>([])
const musicPlayed = ref<TypePlaying[]>([]) // 播放过的歌曲列表

const curMusicRef = ref<typeof curMusic | null>()

const currentPlayingObj = ref<TypePlaying>({
    id: '',
    name: '',
    artist: '',
    poster: '',
    lrc: [],
    loadingLrc: false,
    needLoadDuration: true // duration总时长加载好后才代表歌曲可以被播放了，为true是正在加载得意思
})

// 播放列表是否显示
const showPlayedListVisible = ref<boolean>(false)
const setPlayedListVisible = (e: any): void => {
    showPlayedListVisible.value = !showPlayedListVisible.value
}
let localHis = JSON.parse(localStorage.getItem('_playedList') as string) || []
if (localHis.length) {
    showPlayedListVisible.value = true;
    currentPlayingObj.value = {
        ...localHis[0],
        isPlaying: false,
        loadingLrc: false,
        needLoadDuration: true
    }
    musicPlayed.value = localHis
}

const cacheWidth = ref(0)

onMounted(() => {
    getLrc(currentPlayingObj.value)
})

const toSearch = (): void => {
    if (!keyword.value.trim()) {
        ElMessage.warning(`关键词不能为空!`)
        return
    }
    loadingList.value = true
    fetch('/api/music/list?s=' + encodeURIComponent(keyword.value)).then(res => {
        if (res.ok) {
            return res.json()
        }
    }).then(e => {
        musicList.value = e ? e.data.map((e: TypePlaying) => ({
            ...e,
            url: e.url + '?t=' + Date.now()
        })) : []
    }).finally(() => {
        loadingList.value = false
    })
}
const setLocal = (item: TypePlaying, removeId?: number | string) => {
    try {
        let cachedList = JSON.parse(localStorage.getItem('_playedList') as string) || []
        if (removeId) {
            cachedList = cachedList.filter((ct: TypePlaying) => ct.id != removeId)
            if (!cachedList.length) {
                localStorage.removeItem('_playedList')
                showPlayedListVisible.value = false
                currentPlayingObj.value.id = ''
            } else {
                localStorage.setItem('_playedList', JSON.stringify(cachedList))
            }
            musicPlayed.value = musicPlayed.value.filter(md => md.id).filter((mdr: TypePlaying) => mdr.id != removeId)
            if (musicPlayed.value.length) {
                currentPlayingObj.value = {
                    ...musicPlayed.value[0],
                    isPlaying: true,
                    lrc: currentPlayingObj.value.lrc,
                    loadingLrc: false,
                }
            }
            return
        }
        cachedList = cachedList.some((e: TypePlaying) => e.id == item.id) ? cachedList : [{ ...item, lrc: [], isPlaying: false }, ...cachedList].filter(md => md.id)
        if (!cachedList.length) {
            localStorage.removeItem('_playedList')
            showPlayedListVisible.value = false
            currentPlayingObj.value.id = ''
            return
        } else {
            localStorage.setItem('_playedList', JSON.stringify(cachedList))
        }
        let mcd: any[] = []
        if (!cachedList.length) {
            mcd = item ? [item] : []
        } else {
            mcd = musicPlayed.value.some(dd => dd.id == item.id) ? musicPlayed.value.map(ee => ({
                ...ee,
                lrc: (ee.id == item.id ? (item.lrc) : ee.lrc) || []
            })) : (item ? [item, ...musicPlayed.value] : cachedList[0])
        }
        musicPlayed.value = mcd.filter(md => md.id)

    } catch (error) { }
}

const getLrc = async (item: TypePlaying) => {
    if (!item.id) return

    currentPlayingObj.value.hasError = false
    currentPlayingObj.value.loadingLrc = true


    let exist = musicPlayed.value.filter(md => md.id).filter((e: TypePlaying) => e.id == item.id)
    if (exist.length) {
        if (item.id === currentPlayingObj.value.id) {
            document.title = currentPlayingObj.value.name

            let curIsPlay = currentPlayingObj.value.isPlaying
            if (curIsPlay) {
                currentPlayingObj.value.isPlaying = false
                curMusicRef.value && curMusicRef.value?.toPauseAudio()
            } else {
                currentPlayingObj.value.isPlaying = true
                curMusicRef.value && curMusicRef.value?.tryToAutoPlay()
            }
            currentPlayingObj.value.loadingLrc = false
            if (exist[0].lrc && exist[0].lrc.length) return
        } else {
            currentTime.value = 0;
            totalTime.value = 0;
            cacheWidth.value = 0

            let existLrc = exist[0].lrc
            let lastLrc = existLrc && existLrc.length ? existLrc : []
            currentPlayingObj.value = {
                ...exist[0],
                isPlaying: true,
                lrc: lastLrc,
                loadingLrc: false,
                needLoadDuration: true
            }
            document.title = currentPlayingObj.value.name
        }
    } else {
        setLocal(currentPlayingObj.value)
    }
    if (!item.lrc || !item.lrc.length || !currentPlayingObj.value.lrc || !currentPlayingObj.value.lrc.length) {
        currentTime.value = 0;
        totalTime.value = 0;
        cacheWidth.value = 0;
        currentPlayingObj.value = {
            ...item,
            lrc: [],
            isPlaying: false,
            loadingLrc: true,
            needLoadDuration: true
        }

        await fetch('/api/music/lrc/' + item.id).then(res => {
            console.log('getLrc res', res)
            if (res.ok) {
                return res.json()
            }
        }).then(e => {
            currentPlayingObj.value.lrc = e ? e.data : []
            currentPlayingObj.value.isPlaying = true

            document.title = currentPlayingObj.value.name
            setLocal(currentPlayingObj.value)
        }).catch(e => {
            console.log('catch lrc', e)
            currentPlayingObj.value.isPlaying = false
        }).finally(() => {
            currentPlayingObj.value.loadingLrc = false
        })
    }
}

const nextPlay = (hasErrorPlay?: boolean): void => {
    currentPlayingObj.value.isPlaying = false
    let curId = currentPlayingObj.value.id

    if (!hasErrorPlay && (musicPlayed.value.length == 1 || repeatMode.value == 1)) {
        getLrc(currentPlayingObj.value)
        return
    }
    let findIndex = musicPlayed.value.findIndex(f => f.id == curId)
    if (hasErrorPlay) {
        setLocal(currentPlayingObj.value, curId)
        if (!musicPlayed.value.length) {
            currentPlayingObj.value.id = '';
            showPlayedListVisible.value = false
        } else {
            currentPlayingObj.value = {
                ...musicPlayed.value[0],
                hasError: false,
                isPlaying: true,
                lrc: currentPlayingObj.value.lrc
            }
            showPlayedListVisible.value = true
        }
        return
    }

    let newIndex = findIndex + 1
    if (findIndex == musicPlayed.value.length - 1) {
        newIndex = 0
    }
    if (repeatMode.value == 0) {
        // 列表播放
        currentPlayingObj.value = {
            ...musicPlayed.value[newIndex],
            lrc: currentPlayingObj.value.lrc
        }
    } else if (repeatMode.value == 2) {
        // 随机播放
        let copyP = JSON.parse(JSON.stringify(musicPlayed.value))
        copyP.sort(() => Math.random() - .5)
        if (copyP[0].id == curId) {
            currentPlayingObj.value = copyP[1]
        } else {
            currentPlayingObj.value = copyP[0]
        }
    }

    currentPlayingObj.value.needLoadDuration = true
    getLrc(currentPlayingObj.value)
}

const setMusicPlayed = (arg: TypePlaying[]) => {
    musicPlayed.value = arg
}
const clearCacheData = () => {
    ElMessageBox.confirm(
        '确认清除所有缓存数据?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            ElMessage({
                type: 'success',
                message: '清除完毕!',
            })
            keyword.value = ''
            musicPlayed.value = []
            localStorage.removeItem('_playedList')
            currentPlayingObj.value = {
                id: '',
                name: '',
                artist: '',
                poster: '',
                lrc: [],
                loadingLrc: false
            }
            showPlayedListVisible.value = false
            musicList.value = []
            loadingList.value = false
        })
        .catch(() => { })
}
const handleCommand = (command: string | number | object, row?: TypePlaying) => {
    if (command == "removeAllHistory") {
        clearCacheData()
    } else if (row) {
        let curObj = row
        let etName = encodeURIComponent(curObj.name)

        if (command == 'removeById') {
            setLocal(curObj, curObj.id)
        } else if (command == 'beTop') {
            musicPlayed.value = [curObj, ...musicPlayed.value.filter(e => e.id != curObj.id)]
            localStorage.setItem('_playedList', JSON.stringify(musicPlayed.value))
        } else if (command == 'downLong') {
            window.open(`/api/music/download/${curObj.id}?name=encodeComponent(${curObj.name})`)
        } else if (command == 'downLrc') {
            if (!curObj.lrc || !curObj.lrc.length) {
                ElMessage.warning(`"${curObj.name}"暂无相关歌词~`)
            } else {
                window.open(`/api/music/lrc/download/${curObj.id}?name=${etName}`)
            }
        } else if (command == 'addToPlayList') {
            if (musicPlayed.value.some(mcd => mcd.id == curObj.id)) {
                ElMessage.warning(`"${curObj.name}"已存在播放列表中~`)
            } else {
                musicPlayed.value = [curObj, ...musicPlayed.value]
                localStorage.setItem('_playedList', JSON.stringify(musicPlayed.value))
            }
        } else if (command == "searchArtist") {
            keyword.value = curObj.artist
            toSearch()
        } else if (command == "searchLongName") {
            keyword.value = curObj.name
            toSearch()
        }
    }
}
</script>
<style>
.music-container,
.music-inner {
    height: 100%;
    overflow: hidden;
}

.music-container .list-container {
    height: calc(100% - 50px);
    position: relative;
    overflow: auto;
}

.music-container .bottom-list {
    position: fixed;
    bottom: 0;
    width: 100%;
}

.list-container.activeHeight .music-list-container {
    height: calc(100% - 100px);
    overflow: auto;
}

.search-container {
    height: 50px;
    line-height: 50px;
    position: relative;
    text-align: left;
    padding-left: 10px;
}

.search-container>.el-input {
    width: calc(100% - 40px);
}

.search-container>.op-global {
    width: 80px;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(60%, -50%);
}

.dropdownSearchName {
    width: auto;
    max-width: 200px;
}

.playedList-lists {
    max-height: 254px;
    overflow: auto;
}

.playedList-container {
    background-color: #fff;
    color: #ffff;
}

.playedList-container .music-list-container,
.playedList-container .title {
    background-color: #121212 !important;
}

.playedList-container .title {
    color: rgba(255, 255, 255, 0.7);
}

.playedList-container .lists {
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.list-action-right .more-action{
    margin: 0 auto;
}
</style>