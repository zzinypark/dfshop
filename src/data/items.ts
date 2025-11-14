import { CashItem } from '../types';

// 예시 아이템 데이터
// 실제 사용 시 itemId를 정확한 값으로 변경해야 합니다
export const SAMPLE_ITEMS: CashItem[] = [
  // 단일 아이템 예시
  {
    type: 'single',
    name: '신비한 칼레이도 박스 주머니',
    itemId: 'a1cdd9ffbfff08d867d07a86886c6b55',
    cashPrice: 3900, // 캐시 가격 (예시)
  },
  // 패키지 아이템 예시
  {
    type: 'package',
    name: '스페셜 패키지',
    cashPrice: 15000,
    items: [
      {
        itemId: 'a1cdd9ffbfff08d867d07a86886c6b55', // 실제 itemId로 변경 필요
        name: '칼레이도 박스',
        count: 5,
        isBound: false, // 거래 가능
      },
      {
        itemId: 'item_id_2', // 실제 itemId로 변경 필요
        name: '강화 보호권',
        count: 10,
        isBound: true, // 귀속
      },
    ],
    bonusItems: [
      // 10회 구매 시 추가 지급
      {
        itemId: 'bonus_item_id', // 실제 itemId로 변경 필요
        name: '프리미엄 상자',
        count: 1,
        isBound: true,
      },
    ],
  },
];
