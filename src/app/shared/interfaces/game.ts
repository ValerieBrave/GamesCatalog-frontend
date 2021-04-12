export interface Game {
    id: number;
    age_ratings: number[];
    first_release_date: Date;
    cover: number;
    cover_url: string;
    game_engines: number[];
    game_modes: number[];
    genres: number[];
    name: string;
    platforms: number[];
    rating: number;
    summary: string;
    liked: boolean;
}