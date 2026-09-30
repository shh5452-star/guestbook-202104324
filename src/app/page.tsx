"use client"

import { FormEvent, useEffect, useState } from "react"

type Post = { id:number; name:string; message:string; created_at:string }
type Action = { id:number; type:"edit"|"delete" } | null

export default function Home() {
  const [posts,setPosts]=useState<Post[]>([])
  const [name,setName]=useState("")
  const [message,setMessage]=useState("")
  const [password,setPassword]=useState("")
  const [action,setAction]=useState<Action>(null)
  const [actionPassword,setActionPassword]=useState("")
  const [editMessage,setEditMessage]=useState("")
  const [notice,setNotice]=useState("")
  const [loading,setLoading]=useState(false)

  async function load(){
    const r=await fetch("/api/guestbook")
    if(r.ok) setPosts(await r.json())
  }
  useEffect(()=>{ load() },[])

  async function create(e:FormEvent){
    e.preventDefault()
    setNotice("")
    if(!name.trim()||!message.trim()||!password.trim()){setNotice("이름, 메시지, 비밀번호를 모두 입력해주세요.");return}
    setLoading(true)
    const r=await fetch("/api/guestbook",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,message,password})})
    const data=await r.json()
    if(r.ok){setName("");setMessage("");setPassword("");setNotice("등록되었습니다.");await load()}else setNotice(data.error||"등록에 실패했습니다.")
    setLoading(false)
  }

  function openEdit(p:Post){setAction({id:p.id,type:"edit"});setEditMessage(p.message);setActionPassword("");setNotice("")}
  function openDelete(p:Post){setAction({id:p.id,type:"delete"});setActionPassword("");setNotice("")}

  async function runAction(){
    if(!action||!actionPassword.trim()){setNotice("비밀번호를 입력해주세요.");return}
    setLoading(true)
    const opts=action.type==="edit"
      ? {method:"PATCH",body:JSON.stringify({id:action.id,message:editMessage,password:actionPassword})}
      : {method:"DELETE",body:JSON.stringify({id:action.id,password:actionPassword})}
    const r=await fetch("/api/guestbook",{...opts,headers:{"Content-Type":"application/json"}})
    const data=await r.json()
    if(r.ok){setNotice(action.type==="edit"?"수정되었습니다.":"삭제되었습니다.");setAction(null);await load()}
    else setNotice(data.error||"처리에 실패했습니다.")
    setLoading(false)
  }

  return <main style={{minHeight:"100vh",background:"#f4f6f8",padding:"35px 18px",fontFamily:"Arial,sans-serif"}}>
    <div style={{maxWidth:720,margin:"0 auto"}}>
      <header style={{background:"#111827",color:"white",padding:24,borderRadius:14,marginBottom:18}}>
        <h1 style={{margin:0,fontSize:30}}>미니 방명록</h1>
        <p style={{margin:"8px 0 0",opacity:.85}}>이름, 메시지, 작성 시각이 함께 기록됩니다.</p>
        <small style={{display:"block",marginTop:14,opacity:.75}}>개발자: 장희현 · 학번: 202202453</small>
      </header>

      <form onSubmit={create} style={{background:"white",padding:20,borderRadius:14,marginBottom:18}}>
        <h2 style={{marginTop:0}}>방명록 작성</h2>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="이름" style={input}/>
        <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="메시지" rows={4} style={input}/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="비밀번호 (수정/삭제에 사용)" style={input}/>
        <button disabled={loading} style={button}>{loading?"처리 중...":"등록하기"}</button>
      </form>

      {notice && <div style={{background:"#fff7ed",padding:14,borderRadius:10,marginBottom:18}}>{notice}</div>}

      <h2>방명록 목록</h2>
      {posts.length===0 && <div style={card}>아직 작성된 글이 없습니다.</div>}
      {posts.map(p=><article key={p.id} style={card}>
        <div style={{display:"flex",justifyContent:"space-between",gap:10}}>
          <strong>{p.name}</strong><small>{new Date(p.created_at).toLocaleString("ko-KR")}</small>
        </div>
        <p style={{whiteSpace:"pre-wrap",lineHeight:1.6}}>{p.message}</p>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>openEdit(p)} style={smallButton}>수정</button>
          <button onClick={()=>openDelete(p)} style={smallButton}>삭제</button>
        </div>
      </article>)}

      {action && <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"grid",placeItems:"center",padding:20}}>
        <div style={{background:"white",padding:22,borderRadius:14,width:"100%",maxWidth:430}}>
          <h2>{action.type==="edit"?"글 수정":"글 삭제"}</h2>
          {action.type==="edit" && <textarea value={editMessage} onChange={e=>setEditMessage(e.target.value)} rows={5} style={input}/>}
          <input type="password" value={actionPassword} onChange={e=>setActionPassword(e.target.value)} placeholder="작성할 때 입력한 비밀번호" style={input}/>
          <div style={{display:"flex",gap:8}}>
            <button onClick={runAction} disabled={loading} style={button}>{action.type==="edit"?"수정하기":"삭제하기"}</button>
            <button onClick={()=>setAction(null)} style={{...button,background:"#6b7280"}}>취소</button>
          </div>
        </div>
      </div>}
    </div>
  </main>
}

const input={width:"100%",boxSizing:"border-box" as const,padding:12,marginBottom:10,border:"1px solid #d1d5db",borderRadius:8,fontSize:15}
const button={flex:1,padding:12,border:0,borderRadius:8,background:"#111827",color:"white",fontWeight:700,cursor:"pointer"}
const smallButton={padding:"7px 14px",border:"1px solid #d1d5db",borderRadius:7,background:"white",cursor:"pointer"}
const card={background:"white",padding:18,borderRadius:14,marginBottom:12}
