import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

function getDb() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL이 설정되지 않았습니다.")
  return neon(url)
}

async function initTable() {
  const sql = getDb()
  await sql`CREATE TABLE IF NOT EXISTS guestbook (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`
}

export async function GET() {
  try {
    await initTable()
    const sql = getDb()
    const rows = await sql`SELECT id, name, message, created_at FROM guestbook ORDER BY created_at DESC`
    return NextResponse.json(rows)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "방명록 조회 실패" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await initTable()
    const { name, message } = await request.json()

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "이름과 내용을 입력해주세요." }, { status: 400 })
    }

    const sql = getDb()
    const rows = await sql`
      INSERT INTO guestbook (name, message)
      VALUES (${name.trim()}, ${message.trim()})
      RETURNING id, name, message, created_at
    `

    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "방명록 등록 실패" }, { status: 500 })
  }
}
