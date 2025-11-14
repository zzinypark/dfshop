import { AuctionResponse } from '../types';

const BASE_URL = 'https://api.neople.co.kr/df';

export class NeoPleAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getAuctionSoldData(
    itemId: string,
    limit: number = 100
  ): Promise<AuctionResponse> {
    const params = new URLSearchParams({
      itemId,
      limit: limit.toString(),
      wordType: 'match',
      wordShort: 'true',
      apikey: this.apiKey,
    });

    const response = await fetch(`${BASE_URL}/auction-sold?${params}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getMultipleItemsData(itemIds: string[]): Promise<Map<string, AuctionResponse>> {
    const results = new Map<string, AuctionResponse>();

    // API 호출을 병렬로 처리
    await Promise.all(
      itemIds.map(async (itemId) => {
        try {
          const data = await this.getAuctionSoldData(itemId);
          results.set(itemId, data);
        } catch (error) {
          console.error(`Failed to fetch data for item ${itemId}:`, error);
          results.set(itemId, { rows: [] });
        }
      })
    );

    return results;
  }

  // 평균 단가 계산 (최근 거래 데이터 기반)
  calculateAverageUnitPrice(response: AuctionResponse): number {
    if (!response.rows || response.rows.length === 0) {
      return 0;
    }

    const sum = response.rows.reduce((acc, item) => acc + item.unitPrice, 0);
    return Math.round(sum / response.rows.length);
  }

  // 최근 10개 거래 평균 단가 (더 정확한 현재 시세)
  calculateRecentAveragePrice(response: AuctionResponse, count: number = 10): number {
    if (!response.rows || response.rows.length === 0) {
      return 0;
    }

    const recentItems = response.rows.slice(0, Math.min(count, response.rows.length));
    const sum = recentItems.reduce((acc, item) => acc + item.unitPrice, 0);
    return Math.round(sum / recentItems.length);
  }
}
