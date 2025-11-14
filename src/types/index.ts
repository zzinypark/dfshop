// API Response Types
export interface AuctionSoldItem {
  soldDate: string;
  itemId: string;
  itemName: string;
  itemAvailableLevel: number;
  itemRarity: string;
  itemTypeId: string;
  itemType: string;
  itemTypeDetailId: string;
  itemTypeDetail: string;
  refine: number;
  reinforce: number;
  amplificationName: string | null;
  fame: number;
  count: number;
  price: number;
  unitPrice: number;
}

export interface AuctionResponse {
  rows: AuctionSoldItem[];
}

// Item Configuration Types
export interface SingleItem {
  type: 'single';
  name: string;
  itemId: string;
  cashPrice: number; // 캐시 가격
}

export interface PackageItem {
  type: 'package';
  name: string;
  cashPrice: number; // 캐시 가격
  items: Array<{
    itemId: string;
    name: string;
    count: number; // 패키지 내 수량
    isBound: boolean; // 귀속 아이템 여부
  }>;
  bonusItems?: Array<{
    // 10회 구매 시 추가 지급 아이템
    itemId: string;
    name: string;
    count: number;
    isBound: boolean;
  }>;
}

export type CashItem = SingleItem | PackageItem;

// Price Calculation Result
export interface PriceEfficiency {
  itemName: string;
  cashPrice: number;
  tradeableValue: number; // 거래 가능 가치
  boundValue: number; // 귀속 가치
  totalValue: number; // 합계
  efficiency: number; // 골드/캐시 효율
}
