import httpx
from typing import Any
from app.config import Settings


class AuctionSoldItem:
    """경매 완료 아이템"""
    def __init__(self, data: dict):
        self.sold_date = data.get("soldDate")
        self.item_id = data.get("itemId")
        self.item_name = data.get("itemName")
        self.count = data.get("count")
        self.price = data.get("price")
        self.unit_price = data.get("unitPrice")


class NeoPleAPIClient:
    """Neople API 클라이언트"""

    def __init__(self, settings: Settings):
        self.settings = settings
        self.base_url = settings.neople_api_base_url
        self.api_key = settings.neople_api_key

    async def get_auction_sold_data(
        self,
        item_id: str,
        limit: int = 100
    ) -> list[AuctionSoldItem]:
        """경매장 완료 거래 데이터 조회"""
        params = {
            "itemId": item_id,
            "limit": limit,
            "wordType": "match",
            "wordShort": "true",
            "apikey": self.api_key,
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.get(
                    f"{self.base_url}/auction-sold",
                    params=params
                )
                response.raise_for_status()
                data = response.json()

                rows = data.get("rows", [])
                return [AuctionSoldItem(item) for item in rows]

            except httpx.HTTPError as e:
                print(f"API Error for item {item_id}: {e}")
                return []

    async def get_multiple_items_data(
        self,
        item_ids: list[str]
    ) -> dict[str, list[AuctionSoldItem]]:
        """여러 아이템의 거래 데이터 조회 (병렬)"""
        async with httpx.AsyncClient(timeout=30.0) as client:
            tasks = [
                self._fetch_item_data(client, item_id)
                for item_id in item_ids
            ]
            results = await httpx.AsyncClient().gather(*tasks)

        return {
            item_id: result
            for item_id, result in zip(item_ids, results)
        }

    async def _fetch_item_data(
        self,
        client: httpx.AsyncClient,
        item_id: str
    ) -> list[AuctionSoldItem]:
        """단일 아이템 데이터 조회 (내부용)"""
        params = {
            "itemId": item_id,
            "limit": 100,
            "wordType": "match",
            "wordShort": "true",
            "apikey": self.api_key,
        }

        try:
            response = await client.get(
                f"{self.base_url}/auction-sold",
                params=params
            )
            response.raise_for_status()
            data = response.json()
            rows = data.get("rows", [])
            return [AuctionSoldItem(item) for item in rows]
        except httpx.HTTPError:
            return []

    def calculate_recent_average_price(
        self,
        items: list[AuctionSoldItem],
        count: int = 10
    ) -> int:
        """최근 거래 평균 단가 계산"""
        if not items:
            return 0

        recent_items = items[:min(count, len(items))]
        if not recent_items:
            return 0

        total = sum(item.unit_price for item in recent_items)
        return round(total / len(recent_items))
