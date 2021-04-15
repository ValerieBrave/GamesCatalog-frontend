export interface GameInfo {
    id: number; //GAMES
    age_ratings: number[]; //GAMES
    age_rating_name: string;    //AGE_RATINGS
    first_release_date: Date; //GAMES
    cover: number; //GAMES
    cover_url: string;  //COVERS
    game_engines: number[]; //GAMES
    game_engines_names: string[];   //GAME_ENGINES
    game_modes: number[]; //GAMES
    game_modes_names: string[]; //GAME_MODES
    genres: number[]; //GAMES
    genres_names: string[]; //GENRES
    name: string; //GAMES
    platforms: number[]; //GAMES
    platforms_names: string[]; //PLATFORMS
    rating: number; //GAMES
    rating_count: number;
    aggregated_rating: number;
    aggregated_rating_count: number;
    summary: string; //GAMES
    //-------------------------
    storyline: string; //GAMES
    screenshots: number[]; //GAMES
    screenshots_urls: string[]; //SCREENSHOTS
    involved_companies: number[]; //GAMES
    // companies_ids: number[];    //INVOLVED_COMPANIES
    companies_names: string[];  //COMPANIES
    liked: boolean;
}