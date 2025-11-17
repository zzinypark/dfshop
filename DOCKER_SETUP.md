# Docker Setup Guide

## Quick Start

```bash
# 1. 환경 변수 설정
cp .env.example .env
nano .env  # NEOPLE_API_KEY 입력

# 2. 실행
docker-compose up -d

# 3. 접속
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000/docs
```

## 서비스 관리

```bash
# 서비스 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f backend
docker-compose logs -f frontend

# 서비스 재시작
docker-compose restart

# 서비스 중지
docker-compose down

# 이미지 재빌드
docker-compose build
docker-compose up -d --build
```

## 환경 변수

`.env` 파일 설정:

```env
# Neople API Key (필수)
NEOPLE_API_KEY=your_actual_api_key_here

# CORS 설정 (선택, 기본값 사용 가능)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 포트 설정

- **Frontend**: 5173
- **Backend**: 8000

포트를 변경하려면 `docker-compose.yml`을 수정하세요.

## 트러블슈팅

### Backend가 시작되지 않음

```bash
# 로그 확인
docker-compose logs backend

# API 키 확인
cat .env
```

### Frontend가 backend에 연결되지 않음

```bash
# 네트워크 확인
docker-compose ps

# Backend 헬스체크
curl http://localhost:8000/api/items/health
```

### 아이템 데이터 변경 후 반영 안 됨

```bash
# Backend 재시작
docker-compose restart backend
```

## Production 배포

Production 환경에서는:

1. `.env`의 `ALLOWED_ORIGINS`를 실제 도메인으로 변경
2. HTTPS 설정 (Let's Encrypt)
3. Nginx 리버스 프록시 추가 설정
4. 로그 수집 및 모니터링 설정

예시 production `docker-compose.yml`:

```yaml
services:
  backend:
    environment:
      - ALLOWED_ORIGINS=https://yourdomain.com
    restart: always

  frontend:
    environment:
      - VITE_API_URL=https://yourdomain.com
    restart: always
```
