export interface Bill {
    id: string;
    month: number;
    year: number;
    day_consumption_kwh: number;
    night_consumption_kwh: number;
    total: number;
    createdAt: Date;
    updatedAt: Date;
    addressId: string;
    userId: string;
    period: Date;
}

export interface BillWithAddress {
    month: number;
    year: number;
    total: number;
    period: Date;
    address: {
        id: string;
        address: string;
    };
}

export interface BillWithAddressAndConsumption {
    period: Date;
    total: number;
    day_consumption_kwh: number;
    night_consumption_kwh: number;
    total_consumption_kwh: number;
}
