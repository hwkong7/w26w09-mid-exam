
import { useState } from "react"
import { supabase } from '../lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from "~/lib/auth-store"
import type { Route } from "./+types/list"

export default function List() {
  const user = useAuthStore(s => s.user)
  const queryClient = useQueryClient()
  const [title, setTitle] = useState("")

  const { data: myList = [], isPending, isError, error } = useQuery({
    queryKey: ['escape-to-do'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')

      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  })

  const mutate = useMutation({
    mutationFn: async (newTitle: string) => {
      const { data, error } = await supabase
        .from('plans')
        .insert([{ title: newTitle }])

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      // 추가 성공 후, 캐시 무효화하여 refetch되도록 함
      queryClient.invalidateQueries({
        queryKey: ['escape-to-do']
      })

      // 입력 필드 초기화
      setTitle("")
    },
    onError: (err: any) => {
      alert(`추가 실패: ${err.message}`)
    }
  })

  if (isPending) return <div className="state-card" role="status">로딩 중...</div>

  if (isError) return <div className="state-card state-error" role="alert">에러: {error.message}</div>

  return (
    <>
      <form className="plan-form"
        onSubmit={e => {
          e.preventDefault()
          mutate.mutate(title)
        }}>
        <label className="input-label" htmlFor="plan-title">졸업 전, 꼭 남기고 싶은 추억은?</label>
        <div className="input-row">
        <input
          id="plan-title"
          type="text"
          value={title}
          placeholder="졸업 전에 하고 싶은 일 (*)"
          onChange={e => setTitle(e.target.value)}
          required
          className="plan-input"
        />
        <button
          type="submit"
          disabled={mutate.isPending}
          className="add-button">
          추가
        </button>
        </div>
      </form>

      <div className="list-heading"><h2>나의 졸업 버킷리스트</h2><span>총 {myList.length}개의 버킷리스트</span></div>
      {myList.length == 0 && <div className="state-card">아직 등록된 버킷리스트가 없어요.</div>}
      <div className="plan-grid">
        {myList.map((p: any) => (
          <div className="plan-card" key={p.id}><span className="card-mark" aria-hidden="true">✦</span><p>{p.title}</p></div>
        ))}
      </div>
    </>
  )
}
