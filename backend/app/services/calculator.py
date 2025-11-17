from app.models.items import (
    CashItem,
    SingleItem,
    PackageItem,
    PriceEfficiency,
    EfficiencyResponse
)
from app.services.neople_api import NeoPleAPIClient, AuctionSoldItem


class EfficiencyCalculator:
    """효율 계산기"""

    def __init__(self, api_client: NeoPleAPIClient):
        self.api = api_client

    async def calculate_item_efficiency(
        self,
        item: CashItem
    ) -> EfficiencyResponse:
        """단일 아이템 효율 계산"""
        if item.type == "single":
            return await self._calculate_single_item(item)
        else:
            return await self._calculate_package_item(item)

    async def _calculate_single_item(
        self,
        item: SingleItem
    ) -> EfficiencyResponse:
        """단일 아이템 효율 계산"""
        items_data = await self.api.get_auction_sold_data(item.itemId)
        avg_price = self.api.calculate_recent_average_price(items_data, 10)

        single = PriceEfficiency(
            itemName=item.name,
            cashPrice=item.cashPrice,
            tradeableValue=avg_price,
            boundValue=0,
            totalValue=avg_price,
            efficiency=avg_price / item.cashPrice if item.cashPrice > 0 else 0,
        )

        return EfficiencyResponse(single=single)

    async def _calculate_package_item(
        self,
        item: PackageItem
    ) -> EfficiencyResponse:
        """패키지 아이템 효율 계산 (1개, 10개)"""
        # 모든 필요한 아이템 ID 수집
        item_ids = [comp.itemId for comp in item.items]

        # 보너스 아이템 ID 수집 (선택 가능한 모든 옵션)
        bonus_item_ids = []
        if item.bonusItems:
            for bonus_options in item.bonusItems:
                for option in bonus_options:
                    bonus_item_ids.append(option.itemId)

        all_item_ids = list(set(item_ids + bonus_item_ids))

        # 모든 아이템 데이터 가져오기 (병렬)
        all_data = await self.api.get_multiple_items_data(all_item_ids)

        # 1개 구매 시 가치 계산
        single_tradeable = 0
        single_bound = 0

        for component in item.items:
            items_data = all_data.get(component.itemId, [])
            avg_price = self.api.calculate_recent_average_price(items_data, 10)
            total_price = avg_price * component.count

            if component.isBound:
                single_bound += total_price
            else:
                single_tradeable += total_price

        # 10개 구매 시 가치 계산
        package10_tradeable = single_tradeable * 10
        package10_bound = single_bound * 10

        # 보너스 아이템 추가 (가장 저렴한 옵션 선택)
        selected_bonus_items = []
        if item.bonusItems:
            for bonus_options in item.bonusItems:
                # 각 선택지의 가격 계산
                cheapest_option = None
                cheapest_price = float('inf')
                cheapest_is_bound = False

                for option in bonus_options:
                    items_data = all_data.get(option.itemId, [])
                    avg_price = self.api.calculate_recent_average_price(items_data, 10)
                    total_price = avg_price * option.count

                    if total_price < cheapest_price and avg_price > 0:
                        cheapest_price = total_price
                        cheapest_option = option.name
                        cheapest_is_bound = option.isBound

                # 가장 저렴한 옵션 추가
                if cheapest_option:
                    selected_bonus_items.append(cheapest_option)
                    if cheapest_is_bound:
                        package10_bound += cheapest_price
                    else:
                        package10_tradeable += cheapest_price

        # 1개 구매 효율
        single = PriceEfficiency(
            itemName=f"{item.name} (1개)",
            cashPrice=item.cashPrice,
            tradeableValue=round(single_tradeable),
            boundValue=round(single_bound),
            totalValue=round(single_tradeable + single_bound),
            efficiency=(single_tradeable + single_bound) / item.cashPrice if item.cashPrice > 0 else 0,
        )

        # 10개 구매 효율
        package10 = PriceEfficiency(
            itemName=f"{item.name} (10개)",
            cashPrice=item.cashPrice * 10,
            tradeableValue=round(package10_tradeable),
            boundValue=round(package10_bound),
            totalValue=round(package10_tradeable + package10_bound),
            efficiency=(package10_tradeable + package10_bound) / (item.cashPrice * 10) if item.cashPrice > 0 else 0,
            selectedBonusItems=selected_bonus_items if selected_bonus_items else None,
        )

        return EfficiencyResponse(single=single, package10=package10)

    async def calculate_multiple_items(
        self,
        items: list[CashItem]
    ) -> dict[str, EfficiencyResponse]:
        """여러 아이템의 효율 계산"""
        results = {}

        for item in items:
            try:
                efficiency = await self.calculate_item_efficiency(item)
                results[item.name] = efficiency
            except Exception as e:
                print(f"Failed to calculate efficiency for {item.name}: {e}")
                continue

        return results
