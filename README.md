# 던파 캐시 아이템 효율 계산기

던전앤파이터(DnF) 캐시 아이템의 인게임 경매장 기반 골드 효율을 계산하는 웹 애플리케이션입니다.

## 기능

- **단일 아이템 효율 계산**: 개별 캐시 아이템의 골드 가치 계산
- **패키지 아이템 효율 계산**: 여러 아이템이 포함된 패키지의 총 가치 계산
- **1개/10개 구매 비교**: 패키지 아이템의 경우 1개 구매와 10개 구매(보너스 포함) 효율 비교
- **거래 가능/귀속 아이템 구분**: 거래 가능 가치와 귀속 가치를 별도로 표시
- **실시간 경매장 데이터**: Neople Open API를 통해 최신 거래 내역 기반 시세 반영

## 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn
- Neople Open API 키 ([여기서 발급](https://developers.neople.co.kr/))

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 사용 방법

### 1. API 키 설정

첫 화면에서 Neople Open API 키를 입력하고 "시작하기" 버튼을 클릭합니다.

### 2. 자동 계산

API 키를 설정하면 **자동으로 인기 아이템의 효율이 계산**됩니다. 별도의 입력 없이 바로 결과를 확인할 수 있습니다.

### 3. 시세 갱신

"시세 갱신" 버튼을 클릭하여 최신 경매장 데이터로 효율을 다시 계산할 수 있습니다.

### 4. 결과 확인

계산된 효율이 카드 형태로 표시됩니다:

- **캐시 가격**: 아이템의 캐시 가격
- **거래 가능 가치**: 경매장에서 거래 가능한 아이템의 골드 가치
- **귀속 가치**: 귀속 아이템의 골드 가치
- **총 가치**: 거래 가능 + 귀속 가치의 합계
- **효율**: 캐시당 획득 골드 (골드/캐시)

패키지 아이템의 경우:
- **1개 구매**: 패키지 1개 구매 시 효율
- **10개 구매**: 패키지 10개 구매 시 효율 (보너스 아이템 포함)

## API 정보

### Neople API

이 애플리케이션은 Neople의 던전앤파이터 Open API를 사용합니다.

- API 엔드포인트: `https://api.neople.co.kr/df/auction-sold`
- 최근 100개의 거래 내역 또는 최대 1개월 전의 거래 내역 제공
- 최근 10개 거래의 평균 단가를 기준으로 시세 계산

### 인기 아이템 설정

인기 아이템 목록은 `/src/data/items.ts` 파일에서 관리합니다.

```typescript
export const POPULAR_ITEMS: CashItem[] = [
  {
    type: 'single',
    name: '신비한 칼레이도 박스 주머니',
    itemId: 'a1cdd9ffbfff08d867d07a86886c6b55',
    cashPrice: 3900,
  },
  // ... 더 많은 아이템
];
```

#### 아이템 ID 찾기

아이템 ID는 Neople Open API를 통해 확인할 수 있습니다:
- [Neople 개발자 센터](https://developers.neople.co.kr/)
- 아이템 검색 API: `https://api.neople.co.kr/df/items?itemName={아이템명}&apikey={YOUR_API_KEY}`

파일 상단의 주석을 참고하여 실제 itemId 값으로 변경하세요.

## 프로젝트 구조

```
dfshop/
├── src/
│   ├── components/          # React 컴포넌트
│   │   └── ItemEfficiencyCard.tsx  # 효율 카드 표시
│   ├── services/            # 비즈니스 로직
│   │   ├── api.ts                  # API 통신
│   │   └── calculator.ts           # 효율 계산
│   ├── types/               # TypeScript 타입 정의
│   │   └── index.ts
│   ├── data/                # 인기 아이템 데이터 ⭐
│   │   └── items.ts                # 여기서 아이템 관리
│   ├── App.tsx              # 메인 앱 컴포넌트
│   ├── App.css              # 스타일
│   ├── main.tsx             # 엔트리 포인트
│   └── index.css            # 글로벌 스타일
├── index.html               # HTML 템플릿
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 기술 스택

- **React 18**: UI 프레임워크
- **TypeScript**: 타입 안정성
- **Vite**: 빌드 도구
- **CSS3**: 스타일링 (그라데이션, 애니메이션 등)

## 커스터마이징

### 인기 아이템 변경하기

1. `/src/data/items.ts` 파일을 엽니다
2. `POPULAR_ITEMS` 배열에서 아이템을 추가/수정/삭제합니다
3. 각 아이템의 `itemId`를 실제 Neople API의 아이템 ID로 변경합니다
4. 변경 후 빌드하면 자동으로 반영됩니다

현재 설정된 아이템:
- 일반 아이템 4개
- 패키지 아이템 2개

## 주의사항

- API 키는 클라이언트 사이드에서만 사용되므로 보안에 주의하세요
- 경매장 데이터는 실시간이 아닌 **최근 10개 거래 내역의 평균**이므로 실제 시세와 차이가 있을 수 있습니다
- API 호출 제한이 있을 수 있으므로 과도한 요청을 피하세요
- `src/data/items.ts`의 `itemId` 값들을 실제 아이템 ID로 변경해야 정확한 계산이 가능합니다

## 개선 계획

- [ ] 로컬 스토리지를 통한 API 키 저장
- [ ] 효율 비교 차트
- [ ] 시세 변동 그래프
- [ ] 자동 갱신 기능 (일정 시간마다)

## 라이선스

MIT

## 기여

버그 리포트, 기능 제안, Pull Request는 언제나 환영합니다!

## 참고

- [Neople Open API](https://developers.neople.co.kr/)
- [던전앤파이터 공식 사이트](https://df.nexon.com/)
