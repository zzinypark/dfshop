import { CashItem, PriceEfficiency, PackageItem } from '../types';
import { NeoPleAPI } from './api';

export class EfficiencyCalculator {
  private api: NeoPleAPI;

  constructor(api: NeoPleAPI) {
    this.api = api;
  }

  // 단일 아이템 효율 계산
  async calculateSingleItemEfficiency(
    item: CashItem
  ): Promise<{ single: PriceEfficiency; package10?: PriceEfficiency }> {
    if (item.type === 'single') {
      const response = await this.api.getAuctionSoldData(item.itemId);
      const avgPrice = this.api.calculateRecentAveragePrice(response, 10);

      const single: PriceEfficiency = {
        itemName: item.name,
        cashPrice: item.cashPrice,
        tradeableValue: avgPrice,
        boundValue: 0,
        totalValue: avgPrice,
        efficiency: avgPrice / item.cashPrice,
      };

      return { single };
    } else {
      // 패키지 아이템
      return this.calculatePackageEfficiency(item);
    }
  }

  // 패키지 아이템 효율 계산 (1개 구매, 10개 구매)
  private async calculatePackageEfficiency(
    item: PackageItem
  ): Promise<{ single: PriceEfficiency; package10: PriceEfficiency }> {
    // 모든 아이템 ID 수집
    const itemIds = item.items.map((i) => i.itemId);
    if (item.bonusItems) {
      itemIds.push(...item.bonusItems.map((i) => i.itemId));
    }

    // 모든 아이템 데이터 가져오기
    const allData = await this.api.getMultipleItemsData(itemIds);

    // 1개 구매 시 가치 계산
    let singleTradeable = 0;
    let singleBound = 0;

    for (const packageItem of item.items) {
      const response = allData.get(packageItem.itemId);
      if (!response) continue;

      const avgPrice = this.api.calculateRecentAveragePrice(response, 10);
      const totalPrice = avgPrice * packageItem.count;

      if (packageItem.isBound) {
        singleBound += totalPrice;
      } else {
        singleTradeable += totalPrice;
      }
    }

    // 10개 구매 시 가치 계산
    let package10Tradeable = singleTradeable * 10;
    let package10Bound = singleBound * 10;

    // 보너스 아이템 추가
    if (item.bonusItems) {
      for (const bonusItem of item.bonusItems) {
        const response = allData.get(bonusItem.itemId);
        if (!response) continue;

        const avgPrice = this.api.calculateRecentAveragePrice(response, 10);
        const totalPrice = avgPrice * bonusItem.count;

        if (bonusItem.isBound) {
          package10Bound += totalPrice;
        } else {
          package10Tradeable += totalPrice;
        }
      }
    }

    const single: PriceEfficiency = {
      itemName: `${item.name} (1개)`,
      cashPrice: item.cashPrice,
      tradeableValue: Math.round(singleTradeable),
      boundValue: Math.round(singleBound),
      totalValue: Math.round(singleTradeable + singleBound),
      efficiency: (singleTradeable + singleBound) / item.cashPrice,
    };

    const package10: PriceEfficiency = {
      itemName: `${item.name} (10개)`,
      cashPrice: item.cashPrice * 10,
      tradeableValue: Math.round(package10Tradeable),
      boundValue: Math.round(package10Bound),
      totalValue: Math.round(package10Tradeable + package10Bound),
      efficiency: (package10Tradeable + package10Bound) / (item.cashPrice * 10),
    };

    return { single, package10 };
  }

  // 여러 아이템의 효율 비교
  async calculateMultipleItems(
    items: CashItem[]
  ): Promise<Map<string, { single: PriceEfficiency; package10?: PriceEfficiency }>> {
    const results = new Map<string, { single: PriceEfficiency; package10?: PriceEfficiency }>();

    for (const item of items) {
      try {
        const efficiency = await this.calculateSingleItemEfficiency(item);
        results.set(item.name, efficiency);
      } catch (error) {
        console.error(`Failed to calculate efficiency for ${item.name}:`, error);
      }
    }

    return results;
  }
}
