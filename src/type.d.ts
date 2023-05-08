declare interface TypePlaying {
    id: string,
    name: string,
    artist: string,
    poster: string,
    lrc: Array<TypePlaying>,
    [propName: string]: any
}
