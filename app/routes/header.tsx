
import { Outlet } from "react-router"
import { useAuthStore } from "~/lib/auth-store"
import { supabase } from '../lib/supabase'
import type { Route } from "./+types/header";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "졸업 전에 하고 싶은 일" },
    { name: "description", content: "졸업 전에 하고 싶은 일 — 대학생으로 보내는 마지막 시간, 후회 없이 채워보기" },
  ]
}

export async function clientLoader() {
  const store = useAuthStore.getState()

  if (store.status === "authenticated") return

  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    store.setSession(session)
  } else {
    // 세션이 없다면 하드코딩된 계정으로 로그인
    try {
      await store.signIn("tehaca7606@goldlicai.com", "pass123")
    } catch (error) {
      console.error("로그인 실패:", error)
    }
  }
}

export default function Header() {
  const user = useAuthStore(s => s.user)

  return (
    <div className="app-shell" lang="ko">
      <header className="page-header">
        <p className="eyebrow">MY GRADUATION BUCKET LIST</p>
        <h1><span aria-hidden="true">🎓</span> 졸업 전에 하고 싶은 일</h1>
        <p className="subtitle">대학생으로 보내는 마지막 시간, 후회 없이 채워보기</p>
        {user && <p className="account">나의 버킷리스트 · {user.email}</p>}
      </header>

      <main className="page-content">
        <Outlet />
      </main>
      <footer className="page-footer">작은 바람이 모여, 오래 기억할 추억이 되도록.</footer>
    </div>
  )
}
