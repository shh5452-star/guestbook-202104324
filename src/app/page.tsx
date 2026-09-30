"use client"

import { FormEvent, useEffect, useState } from "react"

type Guestbook = {
  id: number
  name: string
  message: string
  created_at: string
}

export default function Home() {
  const [items, setItems] = useState<Guestbook[]>([])
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function loadGuestbooks() {
    const res = await fetch("/api/guestbook")
    if (res.ok) setItems(await res.json())
  }

  useEffect(() => {
    loadGuestbooks()
  }, [])

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) {
      alert("이름과 내용을 입력해주세요.")
      return
    }

    setLoading(true)
    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    })

    if (res.ok) {
      setName("")
      setMessage("")
      await loadGuestbooks()
    } else {
      alert("등록에 실패했습니다.")
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f5f7fb", padding: "40px 20px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>미니 방명록</h1>
        <p style={{ color: "#666", marginBottom: 24 }}>
          Next.js + TypeScript + API Routes + Neon PostgreSQL
        </p>

        <form onSubmit={submit} style={{ background: "white", padding: 20, borderRadius: 12, marginBottom: 24 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            style={{ width: "100%", padding: 12, marginBottom: 10, border: "1px solid #ddd", borderRadius: 8 }}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="방명록 내용을 입력하세요"
            rows={4}
            style={{ width: "100%", padding: 12, marginBottom: 10, border: "1px solid #ddd", borderRadius: 8, resize: "vertical" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: 12, border: 0, borderRadius: 8, background: "#111827", color: "white", cursor: "pointer" }}
          >
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </form>

        <section>
          {items.length === 0 ? (
            <div style={{ background: "white", padding: 30, borderRadius: 12, textAlign: "center", color: "#777" }}>
              아직 방명록이 없습니다.
            </div>
          ) : (
            items.map((item) => (
              <article key={item.id} style={{ background: "white", padding: 18, borderRadius: 12, marginBottom: 12 }}>
                <strong>{item.name}</strong>
                <p style={{ margin: "10px 0", whiteSpace: "pre-wrap" }}>{item.message}</p>
                <small style={{ color: "#999" }}>
                  {new Date(item.created_at).toLocaleString("ko-KR")}
                </small>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  )
}
