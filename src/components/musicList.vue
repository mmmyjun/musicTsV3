<template>
    <div class="music-list-container">
        <slot name="listNumResult"><div class="searchResult" v-show="!hideListNumResult">共 <b>{{ lists.length }}</b> 个搜索结果</div></slot>

        <div v-for="(item, index) in lists" class="lists" :key="item.id + item.name">
            <slot name="content" :row="item">
                <slot name="leftContent" :row="item">
                    <div class="left cursorPointer" @click="clickLeftIcon(item)" :key="item.id + item.name">
                        <el-image :src="item.poster" style="width: 44px;height: 44px;border-radius: 50%;" @error="errorLoadImg">
                            <template #error>
                                <el-skeleton class="imgIsError" style="width: 44px; height: 44px" >
                                    <template #template>
                                        <el-skeleton-item variant="circle" />
                                    </template>
                                </el-skeleton>
                            </template>
                            <template #placeholder>
                                <el-skeleton animated class="imgIsLoading">
                                     <template #template>
                                        <el-skeleton-item class="defaultImg" variant="image" style="width: 44px; height: 44px" />
                                    </template>
                                </el-skeleton>
                            </template>
                        </el-image>
                        <reactJump v-show="item.id === currentPlayingObj.id" :running="(item.id === currentPlayingObj.id) && currentPlayingObj.isPlaying" />
                    </div>
                </slot>
                <slot name="centerContent" :row="item">
                    <div class="center cursorPointer" @click="clickLeftIcon(item)">
                        <div class="musicName textHiddenEllipsis">
                            {{ item.name }}
                        </div>
                        <div class="artist">
                            {{ item.artist }}
                        </div>
                    </div>
                </slot>
                <slot name="rightContent" :row="item">
                    <div class="right">
                        <el-icon><MoreFilled /></el-icon>
                    </div>
                </slot>
            </slot>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, withDefaults } from "vue"
import reactJump from './reactJump.vue'

const props = withDefaults(defineProps<{
    modelValue: Array<TypePlaying>;
    currentPlayingObj: TypePlaying;
    hideListNumResult?: boolean;
}>(), {
    modelValue: () => [],
    currentPlayingObj: () => ({} as TypePlaying),
    hideListNumResult: false
})
const emits = defineEmits(['getLrc'])

const lists = computed<TypePlaying[]>(() => props.modelValue)

const clickLeftIcon = (item: Object):void => {
    emits('getLrc', item)
}
const errorLoadImg = (e: Error):void => {
    console.log(e)
}

</script>
<style>
.el-skeleton__item.el-skeleton__circle {
    width: 100%;
    height: 100%;
}
</style>

<style scoped>
.music-list-container {
    height: 100%;
    background: #fff;
}
.lists {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    height: 50px;
}
.left, .right {
    width: 44px;
    height: 44px;
    position: relative;
    border-radius: 50%;
}
.left :deep(img) {
    border-radius: 50%;
}
.right {
    rotate: 90deg;
}
.center {
    width: calc(100% - 96px);
    text-align: left;
    padding-left: 8px;
}
img {
    width: 100%;
    height: 100%;
}
.upIcon {
    position: absolute;
    left: 0;
    color: white;
    width: 100%;
    height: 100%;
    font-size: 24px;
}
.artist {
    color: darkgray;
    font-size: 12px;
}
.searchResult {
    border-bottom: 1px solid gainsboro;
}
</style>