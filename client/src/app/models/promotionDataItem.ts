export interface PromotionDataItem {
    id: string;
    code: string;
    discount: number;
    startDate: Date;
    endDate: Date;
}
export class searchPromotion {
    id!: string;
    code: string;
    discount: number;
    startDate: Date;
    endDate: Date;
}
