export interface FoodDataItem {
    id: string;
    cinemaId: string;
    name: string;
    size: number;
    price: number;
}

export class searchFoodData {
    name!: string;
    cinemaId!: string;
    size!: number;
    price!: number;
}
