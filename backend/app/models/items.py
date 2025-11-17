from pydantic import BaseModel
from typing import Literal


class BonusItemOption(BaseModel):
    """보너스 아이템 선택지"""
    itemId: str
    name: str
    count: int
    isBound: bool


class PackageItemComponent(BaseModel):
    """패키지 구성 아이템"""
    itemId: str
    name: str
    count: int
    isBound: bool


class SingleItem(BaseModel):
    """단일 아이템"""
    type: Literal["single"] = "single"
    name: str
    itemId: str
    cashPrice: int


class PackageItem(BaseModel):
    """패키지 아이템"""
    type: Literal["package"] = "package"
    name: str
    cashPrice: int
    items: list[PackageItemComponent]
    bonusItems: list[list[BonusItemOption]] | None = None  # 각 보너스는 여러 선택지 중 하나


CashItem = SingleItem | PackageItem


class PriceEfficiency(BaseModel):
    """가격 효율 계산 결과"""
    itemName: str
    cashPrice: int
    tradeableValue: int
    boundValue: int
    totalValue: int
    efficiency: float
    selectedBonusItems: list[str] | None = None  # 선택된 보너스 아이템 이름


class EfficiencyResponse(BaseModel):
    """효율 계산 응답"""
    single: PriceEfficiency
    package10: PriceEfficiency | None = None


class AllItemsEfficiencyResponse(BaseModel):
    """전체 아이템 효율 응답"""
    items: dict[str, EfficiencyResponse]
    timestamp: str
