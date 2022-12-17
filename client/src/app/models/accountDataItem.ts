export interface AccountsDataItem {
    id: string;
    name: string;
    time: number;
    openingDay: Date;
    country: string;
    director: string;
    description: string;
    poster: string;
}
export class search{
    id!: any[];
    startDate!: string |null;
    endDate!: string | null;
  }
