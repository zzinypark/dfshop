# DnF Shop Backend API

FastAPI 기반 던파 캐시 아이템 효율 계산 백엔드 API입니다.

## 기능

- Neople Open API 연동
- 인기 아이템 자동 효율 계산
- 보너스 아이템 자동 선택 (가장 저렴한 옵션)
- CORS 지원
- Docker 지원

## 설치 및 실행

### 로컬 개발

```bash
cd backend

# 가상 환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
# 프로젝트 루트의 .env 파일에 NEOPLE_API_KEY 설정

# 서버 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker로 실행

```bash
# 프로젝트 루트에서
docker-compose up backend
```

## API 엔드포인트

### GET /api/items/efficiency

인기 아이템의 효율 계산

**응답 예시:**

```json
{
  "items": {
    "신비한 칼레이도 박스 주머니": {
      "single": {
        "itemName": "신비한 칼레이도 박스 주머니",
        "cashPrice": 3900,
        "tradeableValue": 950000,
        "boundValue": 0,
        "totalValue": 950000,
        "efficiency": 243.59
      }
    },
    "월간 프리미엄 패키지": {
      "single": {
        "itemName": "월간 프리미엄 패키지 (1개)",
        "cashPrice": 29000,
        "tradeableValue": 12000000,
        "boundValue": 3000000,
        "totalValue": 15000000,
        "efficiency": 517.24
      },
      "package10": {
        "itemName": "월간 프리미엄 패키지 (10개)",
        "cashPrice": 290000,
        "tradeableValue": 120000000,
        "boundValue": 32000000,
        "totalValue": 152000000,
        "efficiency": 524.14,
        "selectedBonusItems": ["스페셜 리워드 상자 A"]
      }
    }
  },
  "timestamp": "2025-11-17T12:34:56"
}
```

### GET /api/items/health

헬스 체크

## 구조

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 앱 엔트리포인트
│   ├── config.py            # 설정 (환경 변수)
│   ├── models/
│   │   └── items.py         # 데이터 모델 (Pydantic)
│   ├── services/
│   │   ├── neople_api.py    # Neople API 클라이언트
│   │   └── calculator.py    # 효율 계산 로직
│   ├── routers/
│   │   └── items.py         # API 라우터
│   └── data/
│       └── items.py         # 인기 아이템 데이터
├── requirements.txt
├── Dockerfile
└── README.md
```

## 환경 변수

`.env` 파일에 다음 환경 변수를 설정하세요:

```env
NEOPLE_API_KEY=your_api_key_here
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 인기 아이템 관리

`app/data/items.py` 파일에서 인기 아이템 목록을 관리합니다.

### 보너스 아이템 선택 로직

패키지 아이템의 보너스는 여러 선택지 중 **가장 저렴한 것**을 자동으로 선택합니다.

```python
bonusItems=[
    [
        # 첫 번째 보너스: 3가지 중 자동 선택
        {"itemId": "id1", "name": "옵션1", "count": 1, "isBound": True},
        {"itemId": "id2", "name": "옵션2", "count": 1, "isBound": True},
        {"itemId": "id3", "name": "옵션3", "count": 1, "isBound": True},
    ],
]
```

## 개발

### API 문서

서버 실행 후 다음 URL에서 자동 생성된 API 문서를 확인할 수 있습니다:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 테스트

```bash
# 헬스 체크
curl http://localhost:8000/api/items/health

# 효율 계산
curl http://localhost:8000/api/items/efficiency
```
