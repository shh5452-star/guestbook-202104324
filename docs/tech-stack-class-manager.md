# Guestbook 기술 스택

> 프로젝트: guestbook-202104324
> 작성일: 2026-09-30

## 1. 기술 구성

| 영역 | 기술 |
|---|---|
| 프론트엔드 | Next.js App Router |
| 언어 | TypeScript |
| API | Next.js Route Handler |
| 데이터베이스 | Neon Postgres |
| 배포 | Vercel |
| 형상관리 | GitHub |

## 2. 데이터 흐름

```text
브라우저
   ↓
Next.js 페이지
   ↓
/api/guestbook
   ↓
Neon Postgres
```

## 3. API 처리

- GET: 최신순으로 방명록 조회
- POST: 새 방명록 등록
- PATCH: 비밀번호 확인 후 메시지 수정
- DELETE: 비밀번호 확인 후 글 삭제

## 4. 보안 처리

작성자의 수정 및 삭제 요청에는 비밀번호 검증을 적용한다. 잘못된 비밀번호가 전달되면 서버에서 요청을 거부한다.

데이터베이스 연결 정보는 환경변수 `DATABASE_URL`로 관리하며 GitHub 저장소에 직접 저장하지 않는다.

## 5. 배포

GitHub의 `main` 브랜치를 Vercel과 연결하고 `DATABASE_URL` 환경변수를 등록해 배포한다.

## 6. 프로젝트 식별 정보

- Repository: guestbook-202104324
- Developer: 장희현
- Student ID: 202104324
