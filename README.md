# 📚 Aidu 영어 학습 프로그램

에이듀 영어 단어 암기 + 문법 + 독해 학습 프로그램입니다.

## ✨ 주요 기능

- 🎴 **플래시카드 모드**: 단어 암기 시스템 (외웠어요/아직이요)
- 📝 **AI 문제 생성**: Gemini AI로 맞춤형 단어/문법 테스트 자동 생성
- 🔊 **실시간 발음**: Web Speech API 활용 단어 발음 듣기
- 📊 **진행률 추적**: 로컬스토리지 기반 학습 진행상황 관리
- 🎯 **3영역 학습**: Vocabulary / Grammar / Reading 통합 학습
- 🤖 **AI 튜터 챗봇**: 문법/단어 질문 즉시 답변

## 🚀 시작하기

### 1. 패키지 설치

\`\`\`bash
npm install
\`\`\`

### 2. 환경변수 설정

\`.env.local\` 파일을 생성하고 Gemini API 키를 설정하세요:

\`\`\`bash
# .env.local
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
\`\`\`

**📌 API Key 발급 방법:**
- Google AI Studio에서 발급: https://aistudio.google.com/app/apikey
- 발급받은 키를 \`.env.local\` 파일에 붙여넣기

**⚠️ 중요:** API 키가 없어도 프로그램은 작동하지만, AI 기능(문제 자동 생성, 챗봇)이 비활성화됩니다.

### 3. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

\`\`\`
student-program-english/
├── app/
│   ├── page.tsx                    # 메인 대시보드
│   ├── grade/[id]/page.tsx         # 학년 상세
│   ├── unit/[id]/page.tsx          # 단원 상세 (Vocabulary/Grammar/Reading 탭)
│   ├── flashcard/[unitId]/page.tsx # 플래시카드 모드 ⭐
│   ├── solve/.../page.tsx          # 문제 풀이
│   └── result/.../page.tsx         # 결과 페이지
├── components/
│   └── ui/                         # shadcn/ui 컴포넌트
├── lib/
│   ├── data.ts                     # 목업 데이터 (중1~고3)
│   ├── storage.ts                  # 로컬스토리지 관리
│   ├── gemini.ts                   # Gemini AI 서비스 ⭐
│   └── tts.ts                      # 발음 기능 (Web Speech API) ⭐
├── types/
│   └── index.ts                    # TypeScript 타입 정의
└── .env.local                      # 환경변수 (API 키)
\`\`\`

## 🎮 사용 방법

### 1. 학습 시작
1. 메인 페이지에서 학년 선택 (중1~고3)
2. 단원 선택 (Lesson 1, 2, 3...)
3. 학습 영역 선택 (Vocabulary / Grammar / Reading)

### 2. 단어 암기 (플래시카드)
1. Vocabulary 탭 → "플래시카드로 외우기" 클릭
2. 카드 뒤집기로 영어 단어 확인
3. "외웠어요" 또는 "아직이요" 버튼 선택
4. 진행률 100% 달성 시 다음 세트 해제

### 3. 문제 풀이
1. Set A/B 버튼 클릭
2. AI가 생성한 10문제 풀기
3. 실시간 정답/오답 피드백
4. 70점 이상 획득 시 다음 세트 진행

### 4. 발음 듣기
- 플래시카드 모드에서 "발음 듣기" 버튼 클릭
- Web Speech API로 실시간 영어 발음 재생

## 🛠 기술 스택

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **AI**: Google Gemini API (gemini-2.0-flash-exp)
- **TTS**: Web Speech API
- **Storage**: LocalStorage (향후 백엔드 연동 가능)

## 📊 학습 플로우

\`\`\`
단원 선택
  └── Vocabulary
       ├── 플래시카드 모드 (암기) ⭐
       ├── Set A (기본 테스트)
       ├── Set B (심화 테스트)
       └── 오답 복습
  └── Grammar
       ├── Set A (기본)
       ├── Set B (응용)
       └── 오답 복습
  └── Reading
       ├── Set A (내용 이해)
       └── Set B (추론/어휘)
\`\`\`

## 🎨 디자인 시스템

- **Primary**: Blue (#348fe4) - 영어 = 글로벌 = 파랑
- **Secondary**: Indigo (#4a5ee4) - 문법
- **Accent**: Emerald (#10B981) - 성공/완료
- **Warning**: Orange (#F59E0B) - 오답/복습

## 📝 라이센스

이 프로젝트는 Aidu의 소유입니다.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
