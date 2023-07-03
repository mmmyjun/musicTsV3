declare interface SearchMusic {
    id: string;
    name: string;
    artist: string;
    poster: string;
    url: string;
}

declare interface Lrc {
    text: string;
    time: number;
}

declare interface ApiResponseBase {
    msg: string;
}

declare interface ApiResponseSuccess<T = unknown> extends ApiResponseBase {
    code: 0;
    data: T;
}

declare interface ApiResponseError extends ApiResponseBase {
    code: -1;
    data: null;
}

declare type ApiResponse<T = unknown> = ApiResponseSuccess<T> | ApiResponseError;

declare interface TypePlaying {
    id: string;
    name: string;
    artist: string;
    poster: string;
    url: string;
    lrc: Lrc[];
}
