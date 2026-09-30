# Guestbook 초기 설정 가이드

> 프로젝트: guestbook-202104324
> 작성일: 2026-09-30

## 1. 개발 환경

- Node.js
- Next.js
- TypeScript
- Neon Postgres
- GitHub
- Vercel

## 2. 로컬 실행

프로젝트 폴더에서 다음 명령어를 실행한다.

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`에 접속한다.

## 3. 데이터베이스 환경변수

프로젝트 루트의 `.env.local`에 Neon 연결 문자열을 설정한다.

```env
DATABASE_URL=본인의_Neon_연결문자열
```

연결 문자열은 GitHub에 업로드하지 않는다.

## 4. 방명록 기능 확인

- 이름, 메시지, 비밀번호를 입력해 글 작성
- 전체 글 최신순 조회
- 올바른 비밀번호로 수정
- 올바른 비밀번호로 삭제
- 잘못된 비밀번호로 수정/삭제 시 오류 확인

## 5. Vercel 배포

GitHub 저장소를 Vercel에 연결한 뒤 `DATABASE_URL` 환경변수를 Vercel 프로젝트에도 등록한다.

배포가 완료되면 생성된 Vercel 주소에서 방명록의 작성, 조회, 수정, 삭제 기능을 확인한다.
