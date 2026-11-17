# 2026 웹서버프로그래밍 중간고사

> 🎓 졸업 전에 하고 싶은 일
>
> 대학생으로 보내는 마지막 시간, 후회 없이 채워보기

**20230625 신혜원**

웹서버프로그래밍 중간고사 예제의 빈칸 20개를 완성하고, 기존의 ‘시험 끝나고 하고 싶은 일’을 ‘졸업 전에 하고 싶은 일’로 변경한 실습 과제입니다. React Router, Zustand, TanStack Query, Supabase의 핵심 구현을 유지하면서 화면 디자인과 예제 데이터의 주제를 바꾸었습니다.

## 주요 기능

- 기존 세션 확인 및 실습 계정 자동 로그인
- Supabase `plans` 테이블의 버킷리스트 조회
- 새로운 항목 추가 및 필수 입력 검증
- 추가 성공 시 캐시 무효화, 목록 갱신 및 입력창 초기화
- `myList.length`를 활용한 실제 항목 수 표시
- 로딩·오류·빈 목록 안내 및 빈 목록에서 항목 추가

## 화면 및 개선 사항

### PC 화면

![졸업 버킷리스트 PC 실행 화면](docs/images/desktop.png)

### 모바일 화면

<img src="docs/images/mobile.png" alt="졸업 버킷리스트 모바일 실행 화면" width="320" />

로컬에서 실행한 실제 화면입니다. 캡처 당시에는 기본 예제 33개와 보고서의 추가 테스트 항목 1개가 저장되어 총 34개로 표시됩니다. 로그인 정보는 이미지에서 가렸습니다.

아이보리 배경과 연핑크 색상, 둥근 카드를 사용해 졸업을 앞둔 대학생의 버킷리스트를 표현했습니다. 입력 폼은 목록 상단에 배치하고, 긴 문장도 카드 안에서 자연스럽게 줄바꿈되도록 구성했습니다. 졸업 모자 파비콘도 적용했습니다.

화면 너비에 따라 PC 3열, 900px 이하 2열, 600px 이하 1열로 표시합니다. 기존에는 빈 목록에서 안내만 표시했지만, 입력 폼을 함께 표시하도록 개선했습니다.

예제 데이터는 대학 생활, 친구들과 추억 만들기, 가족과 함께, 개발과 취업, 나를 위한 시간의 33개 항목으로 구성했습니다. 이 구분은 데이터 주제를 설명하기 위한 것으로, 별도의 카테고리 기능은 구현하지 않았습니다. 화면에는 하드코딩한 예제가 아닌 Supabase에서 조회한 실제 데이터가 표시됩니다.

## 사용 기술

| 기술 | 사용 목적 |
| --- | --- |
| React · TypeScript | 화면 구성 및 타입 검사 |
| React Router | 레이아웃·인덱스 라우트 구성, clientLoader |
| Zustand | 사용자·세션·인증 상태 관리 |
| TanStack Query | 목록 조회, 항목 추가, 캐시 무효화 |
| Supabase | 사용자 인증 및 PostgreSQL 데이터 저장 |
| Tailwind CSS · CSS | 기본 스타일 및 반응형 카드 디자인 |

## 프로젝트 구성

```text
app/
├── routes.ts              # 레이아웃 및 인덱스 라우트
├── root.tsx               # QueryClientProvider 및 문서 구조
├── app.css                # 전체 화면 스타일
├── lib/
│   ├── auth-store.ts       # 인증 상태 및 로그인
│   └── supabase.ts         # Supabase 클라이언트
└── routes/
    ├── header.tsx         # 세션 확인, 제목 및 공통 레이아웃
    └── list.tsx           # 목록 조회·추가 및 상태별 화면
public/
└── favicon.svg            # 졸업 모자 파비콘
```

## 실행 방법

의존성을 설치한 뒤, 프로젝트 루트의 `.env.local`에 본인 Supabase 프로젝트의 환경 변수를 설정합니다.

```bash
pnpm install
```

```dotenv
VITE_SUPABASE_URL=본인의_Supabase_프로젝트_URL
VITE_SUPABASE_PUBLISHABLE_KEY=본인의_Supabase_publishable_key
```

Supabase에는 `plans` 테이블과 인증 계정이 필요합니다. 보고서의 DDL을 기준으로 `id`, `created_at`, `user_id`, `title` 및 사용자별 접근을 제한하는 RLS 정책을 설정합니다. `user_id`의 기본값은 `auth.uid()`입니다. 환경 변수만 설정해도 테이블과 데이터가 자동 생성되는 구조는 아닙니다.

```bash
pnpm dev
```

터미널에 표시되는 로컬 주소로 접속합니다. 기본 주소는 `http://localhost:5173`입니다. 기존 시험 코드에 따라 세션이 없으면 설정된 실습 계정으로 자동 로그인합니다.

타입 검사와 프로덕션 빌드 명령은 다음과 같습니다.

```bash
pnpm typecheck
pnpm build
```

Windows PowerShell에서 실행 정책으로 `pnpm`이 차단되는 경우 `pnpm.cmd`로 실행할 수 있습니다.

## 핵심 구현

시험의 20개 빈칸에 해당하는 코드를 유지했습니다. 서비스 주제가 바뀌어도 쿼리 키는 기존 `escape-to-do`를 사용합니다.

```text
clientLoader → 세션 확인 및 로그인 → Zustand에 사용자 상태 저장
useQuery → plans 조회 → myList.map으로 카드 출력
form 제출 → useMutation으로 INSERT → invalidateQueries → 목록 갱신
                                                        → 입력창 초기화
```

소스코드별 풀이, 20개 정답 정리표, 데이터베이스 DDL 및 케이스별 실행 화면은 별도 제출 보고서에 정리했습니다.
