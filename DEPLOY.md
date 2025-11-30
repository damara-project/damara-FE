# Vercel 배포 가이드

## 1. GitHub에 코드 푸시

```bash
# Git 저장소가 없다면 초기화
git init
git add .
git commit -m "Initial commit"

# GitHub에 새 저장소를 만들고 연결
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

## 2. Vercel에 배포

### 방법 1: Vercel 웹사이트 사용 (추천)

1. [Vercel](https://vercel.com)에 가입/로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. 프로젝트 설정:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (자동 감지됨)
   - **Output Directory**: `dist` (자동 감지됨)
5. "Deploy" 클릭

### 방법 2: Vercel CLI 사용

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

## 3. 환경 변수 설정

Vercel 대시보드에서 환경 변수를 설정하세요:

1. 프로젝트 → Settings → Environment Variables
2. 다음 변수들을 추가 (필요한 경우):

```
VITE_API_BASE_URL=https://your-api-url.com
```

## 4. API Base URL 확인

`src/apis/axiosInstance.ts` 파일에서 API base URL이 올바르게 설정되어 있는지 확인하세요.

## 5. 자동 배포

- GitHub에 푸시하면 자동으로 배포됩니다
- Pull Request마다 Preview 배포가 생성됩니다

## 문제 해결

### SPA 라우팅 문제
- `vercel.json` 파일이 이미 생성되어 있어 React Router가 정상 작동합니다

### 빌드 오류
- Node.js 버전 확인 (Vercel은 자동으로 감지)
- `package.json`의 `engines` 필드로 버전 지정 가능

### 환경 변수
- 환경 변수는 `VITE_` 접두사가 필요합니다
- 빌드 후에는 변경해도 재배포가 필요합니다

