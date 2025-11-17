import { CashItem } from '../types';

/**
 * 인기 아이템 목록
 *
 * ⚠️ 중요: 아래 itemId 값들을 실제 Neople API의 아이템 ID로 변경해야 합니다.
 *
 * itemId 확인 방법:
 * 1. Neople 개발자 센터 접속: https://developers.neople.co.kr/
 * 2. API 문서에서 "아이템 검색" 엔드포인트 사용
 * 3. 아이템 이름으로 검색하여 itemId 확인
 *
 * 예시 API 호출:
 * https://api.neople.co.kr/df/items?itemName=칼레이도&apikey=YOUR_API_KEY
 */
export const POPULAR_ITEMS: CashItem[] = [
  // ============================================
  // 일반 아이템 (4개)
  // ============================================

  {
    type: 'single',
    name: '신비한 칼레이도 박스 주머니',
    itemId: 'a1cdd9ffbfff08d867d07a86886c6b55', // ✅ 실제 itemId (확인됨)
    cashPrice: 3900,
  },

  {
    type: 'single',
    name: '프리미엄 PC방 이용권',
    itemId: 'CHANGE_TO_REAL_ITEM_ID_1', // ⚠️ 실제 itemId로 변경 필요
    cashPrice: 2900,
  },

  {
    type: 'single',
    name: '강화/증폭 보호권',
    itemId: 'CHANGE_TO_REAL_ITEM_ID_2', // ⚠️ 실제 itemId로 변경 필요
    cashPrice: 4500,
  },

  {
    type: 'single',
    name: '귀속 해제 아이템',
    itemId: 'CHANGE_TO_REAL_ITEM_ID_3', // ⚠️ 실제 itemId로 변경 필요
    cashPrice: 5900,
  },

  // ============================================
  // 패키지 아이템 (2개)
  // ============================================

  {
    type: 'package',
    name: '월간 프리미엄 패키지',
    cashPrice: 29000,
    items: [
      {
        itemId: 'a1cdd9ffbfff08d867d07a86886c6b55',
        name: '신비한 칼레이도 박스 주머니',
        count: 10,
        isBound: false, // 거래 가능
      },
      {
        itemId: 'CHANGE_TO_REAL_ITEM_ID_4', // ⚠️ 실제 itemId로 변경 필요
        name: '강화 보호권',
        count: 20,
        isBound: true, // 귀속
      },
      {
        itemId: 'CHANGE_TO_REAL_ITEM_ID_5', // ⚠️ 실제 itemId로 변경 필요
        name: '프리미엄 아바타 상자',
        count: 1,
        isBound: false,
      },
    ],
    bonusItems: [
      // 10회 구매 시 추가 지급 아이템
      {
        itemId: 'CHANGE_TO_REAL_ITEM_ID_6', // ⚠️ 실제 itemId로 변경 필요
        name: '스페셜 리워드 상자',
        count: 1,
        isBound: true,
      },
    ],
  },

  {
    type: 'package',
    name: '성장 지원 패키지',
    cashPrice: 19000,
    items: [
      {
        itemId: 'CHANGE_TO_REAL_ITEM_ID_7', // ⚠️ 실제 itemId로 변경 필요
        name: '경험치 부스터',
        count: 30,
        isBound: true,
      },
      {
        itemId: 'a1cdd9ffbfff08d867d07a86886c6b55',
        name: '신비한 칼레이도 박스 주머니',
        count: 5,
        isBound: false,
      },
      {
        itemId: 'CHANGE_TO_REAL_ITEM_ID_8', // ⚠️ 실제 itemId로 변경 필요
        name: '골드 부스터',
        count: 10,
        isBound: true,
      },
    ],
    bonusItems: [
      {
        itemId: 'CHANGE_TO_REAL_ITEM_ID_9', // ⚠️ 실제 itemId로 변경 필요
        name: '특별 성장 상자',
        count: 2,
        isBound: true,
      },
    ],
  },
];
