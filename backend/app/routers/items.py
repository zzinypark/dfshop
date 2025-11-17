from fastapi import APIRouter, Depends
from datetime import datetime
from app.models.items import AllItemsEfficiencyResponse
from app.services.neople_api import NeoPleAPIClient
from app.services.calculator import EfficiencyCalculator
from app.data.items import POPULAR_ITEMS
from app.config import get_settings, Settings

router = APIRouter(prefix="/api/items", tags=["items"])


def get_neople_client(settings: Settings = Depends(get_settings)) -> NeoPleAPIClient:
    """Neople API 클라이언트 의존성"""
    return NeoPleAPIClient(settings)


def get_calculator(
    client: NeoPleAPIClient = Depends(get_neople_client)
) -> EfficiencyCalculator:
    """계산기 의존성"""
    return EfficiencyCalculator(client)


@router.get("/efficiency", response_model=AllItemsEfficiencyResponse)
async def get_items_efficiency(
    calculator: EfficiencyCalculator = Depends(get_calculator)
):
    """
    인기 아이템의 효율 계산

    - 미리 설정된 인기 아이템들의 캐시 대비 골드 효율을 계산합니다
    - 경매장 최근 10개 거래 내역의 평균 가격을 기준으로 합니다
    - 패키지 아이템의 경우 보너스 선택지 중 가장 저렴한 것을 자동 선택합니다
    """
    items_efficiency = await calculator.calculate_multiple_items(POPULAR_ITEMS)

    return AllItemsEfficiencyResponse(
        items=items_efficiency,
        timestamp=datetime.now().isoformat()
    )


@router.get("/health")
async def health_check():
    """헬스 체크"""
    return {"status": "ok", "timestamp": datetime.now().isoformat()}
