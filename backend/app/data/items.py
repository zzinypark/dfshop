from app.models.items import CashItem, SingleItem, PackageItem

"""
인기 아이템 목록

⚠️ 중요: 아래 itemId 값들을 실제 Neople API의 아이템 ID로 변경해야 합니다.

itemId 확인 방법:
1. Neople 개발자 센터 접속: https://developers.neople.co.kr/
2. API 문서에서 "아이템 검색" 엔드포인트 사용
3. 아이템 이름으로 검색하여 itemId 확인

예시 API 호출:
https://api.neople.co.kr/df/items?itemName=칼레이도&apikey=YOUR_API_KEY
"""

POPULAR_ITEMS: list[CashItem] = [
    # ============================================
    # 일반 아이템 (4개)
    # ============================================

    SingleItem(
        name="신비한 칼레이도 박스 주머니",
        itemId="a1cdd9ffbfff08d867d07a86886c6b55",  # ✅ 실제 itemId (확인됨)
        cashPrice=3900,
    ),

    SingleItem(
        name="프리미엄 PC방 이용권",
        itemId="CHANGE_TO_REAL_ITEM_ID_1",  # ⚠️ 실제 itemId로 변경 필요
        cashPrice=2900,
    ),

    SingleItem(
        name="강화/증폭 보호권",
        itemId="CHANGE_TO_REAL_ITEM_ID_2",  # ⚠️ 실제 itemId로 변경 필요
        cashPrice=4500,
    ),

    SingleItem(
        name="귀속 해제 아이템",
        itemId="CHANGE_TO_REAL_ITEM_ID_3",  # ⚠️ 실제 itemId로 변경 필요
        cashPrice=5900,
    ),

    # ============================================
    # 패키지 아이템 (2개)
    # ============================================

    PackageItem(
        name="월간 프리미엄 패키지",
        cashPrice=29000,
        items=[
            {
                "itemId": "a1cdd9ffbfff08d867d07a86886c6b55",
                "name": "신비한 칼레이도 박스 주머니",
                "count": 10,
                "isBound": False,  # 거래 가능
            },
            {
                "itemId": "CHANGE_TO_REAL_ITEM_ID_4",  # ⚠️ 실제 itemId로 변경 필요
                "name": "강화 보호권",
                "count": 20,
                "isBound": True,  # 귀속
            },
            {
                "itemId": "CHANGE_TO_REAL_ITEM_ID_5",  # ⚠️ 실제 itemId로 변경 필요
                "name": "프리미엄 아바타 상자",
                "count": 1,
                "isBound": False,
            },
        ],
        # 10회 구매 시 보너스 - 여러 선택지 중 하나 선택 (가장 저렴한 것 자동 선택)
        bonusItems=[
            [
                # 첫 번째 보너스: 3가지 중 선택 가능
                {
                    "itemId": "CHANGE_TO_REAL_ITEM_ID_6A",
                    "name": "스페셜 리워드 상자 A",
                    "count": 1,
                    "isBound": True,
                },
                {
                    "itemId": "CHANGE_TO_REAL_ITEM_ID_6B",
                    "name": "스페셜 리워드 상자 B",
                    "count": 1,
                    "isBound": True,
                },
                {
                    "itemId": "CHANGE_TO_REAL_ITEM_ID_6C",
                    "name": "스페셜 리워드 상자 C",
                    "count": 1,
                    "isBound": True,
                },
            ],
        ],
    ),

    PackageItem(
        name="성장 지원 패키지",
        cashPrice=19000,
        items=[
            {
                "itemId": "CHANGE_TO_REAL_ITEM_ID_7",
                "name": "경험치 부스터",
                "count": 30,
                "isBound": True,
            },
            {
                "itemId": "a1cdd9ffbfff08d867d07a86886c6b55",
                "name": "신비한 칼레이도 박스 주머니",
                "count": 5,
                "isBound": False,
            },
            {
                "itemId": "CHANGE_TO_REAL_ITEM_ID_8",
                "name": "골드 부스터",
                "count": 10,
                "isBound": True,
            },
        ],
        bonusItems=[
            [
                # 첫 번째 보너스: 2가지 중 선택 가능
                {
                    "itemId": "CHANGE_TO_REAL_ITEM_ID_9A",
                    "name": "특별 성장 상자 타입1",
                    "count": 2,
                    "isBound": True,
                },
                {
                    "itemId": "CHANGE_TO_REAL_ITEM_ID_9B",
                    "name": "특별 성장 상자 타입2",
                    "count": 2,
                    "isBound": True,
                },
            ],
        ],
    ),
]
