import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

function db() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL이 설정되지 않았습니다.")
  return neon(url)
}

async function initTable() {
  const sql = db()
  await sql`CREATE TABLE IF NOT EXISTS guestbook (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`
}

export async function GET() {
  try {
    await initTable()
    const sql = db()
    const rows = await sql`SELECT id, name, message, created_at FROM guestbook ORDER BY created_at DESC`
    return NextResponse.json(rows)
  } catch {
    return NextResponse.json({ error: "조회에 실패했습니다." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await initTable()
    const { name, message, password } = await request.json()
    if (!name?.trim() || !message?.trim() || !password?.trim()) {
      return NextResponse.json({ error: "이름, 메시지, 비밀번호를 모두 입력해주세요." }, { status: 400 })
    }
    const sql = db()
    const rows = await sql`
      INSERT INTO guestbook (name, message, password)
      VALUES (${name.trim()}, ${message.trim()}, ${password.trim()})
      RETURNING id, name, message, created_at
    `
    return NextResponse.json(rows[0], { status: 201 })
  } catch {
    return NextResponse.json({ error: "등록에 실패했습니다." }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    await initTable()
    const { id, message, password } = await request.json()
    if (!id || !message?.trim() || !password?.trim()) {
      return NextResponse.json({ error: "수정할 내용과 비밀번호를 입력해주세요." }, { status: 400 })
    }
    const sql = db()
    const rows = await sql`
      UPDATE guestbook
      SET message = ${message.trim()}
      WHERE id = ${id} AND password = ${password.trim()}
      RETURNING id, name, message, created_at
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 403 })
    }
    return NextResponse.json(rows[0])
  } catch {
    return NextResponse.json({ error: "수정에 실패했습니다." }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await initTable()
    const { id, password } = await request.json()
    if (!id || !password?.trim()) {
      return NextResponse.json({ error: "비밀번호를 입력해주세요." }, { status: 400 })
    }
    const sql = db()
    const rows = await sql`
      DELETE FROM guestbook
      WHERE id = ${id} AND password = ${password.trim()}
      RETURNING id
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 403 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 500 })
  }
}
