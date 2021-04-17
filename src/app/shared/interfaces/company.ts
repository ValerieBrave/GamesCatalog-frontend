export interface Company {  // involved companies + companies
    id: number;
    company: number;    // company id in involved company
    name: string;
    description: string;
    developed: number[];
    start_date: number;
    logo: number;
    logo_url: string;
}