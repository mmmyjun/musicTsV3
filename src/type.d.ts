// 每个播放对象的数据结构
declare interface TypePlaying {
    id: string | number,
    name: string,
    artist: string,
    poster: string,
    [propName: string]: any
}
declare enum RepeatMode {
    byOrder,
    single,
    random
}
declare interface TypeOfMusicList {
    id: string | number,
    name: string,
    artist: string,
    poster: string,
    url?: string,
    [propName: string]: any
}