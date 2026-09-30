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
    if(r.ok){setName("");setMessage("");setPassword("");setNotice("방명록이 등록됐어요!");await load()}else setNotice(data.error||"등록에 실패했습니다.")
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
    if(r.ok){setNotice(action.type==="edit"?"수정됐어요!":"삭제됐어요.");setAction(null);await load()}
    else setNotice(data.error||"비밀번호가 맞지 않아요.")
    setLoading(false)
  }

  return (
    <main style={{minHeight:"100vh",background:"#07060f",color:"#e0e7ff",fontFamily:"'Apple SD Gothic Neo','Malgun Gothic',sans-serif"}}>
      <section style={{position:"relative",overflow:"hidden",padding:"54px 20px 42px",textAlign:"center",borderBottom:"1px solid rgba(99,102,241,.14)"}}>
        <div style={{position:"absolute",inset:0,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(99,102,241,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.035) 1px,transparent 1px)",backgroundSize:"36px 36px"}} />
        <div style={{position:"absolute",width:360,height:360,top:-170,left:-110,borderRadius:"50%",background:"radial-gradient(circle,rgba(79,70,229,.2),transparent 70%)",pointerEvents:"none"}} />
        <div style={{position:"absolute",width:300,height:300,bottom:-160,right:-90,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,.16),transparent 70%)",pointerEvents:"none"}} />

        <div style={{position:"relative",zIndex:2,maxWidth:680,margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:7,border:"1px solid rgba(99,102,241,.25)",borderRadius:999,padding:"5px 13px",marginBottom:18,fontSize:10,color:"#a5b4fc",letterSpacing:"1.2px",fontWeight:700}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#6366f1",display:"inline-block"}} />
            KANGNAM UNIV. GUESTBOOK
          </div>
          <div style={{fontSize:42,marginBottom:8}}>💬</div>
          <h1 style={{fontSize:36,fontWeight:800,lineHeight:1.15,letterSpacing:"-1.5px",margin:"0 0 12px",color:"#fff"}}>
            강남대 방명록,<br/><span style={{color:"#818cf8",textShadow:"0 0 24px rgba(99,102,241,.4)"}}>한마디 남겨주세요</span>
          </h1>
          <p style={{fontSize:13,color:"#818cf8",lineHeight:1.8,margin:"0 auto 24px"}}>
            누구나 자유롭게 글을 남길 수 있어요.<br/>작성할 때 입력한 비밀번호로 내 글을 수정하거나 삭제할 수 있습니다.
          </p>

          <div style={{display:"flex",maxWidth:360,margin:"0 auto",border:"1px solid rgba(99,102,241,.16)",borderRadius:10,overflow:"hidden",background:"rgba(26,24,51,.55)"}}>
            {[{n:String(posts.length),l:"방명록"},{n:"3",l:"기능"},{n:"2026",l:"YEAR"}].map((s,i)=>(
              <div key={i} style={{flex:1,padding:"12px 6px",borderRight:i<2?"1px solid rgba(99,102,241,.1)":"none"}}>
                <div style={{fontSize:18,fontWeight:800,color:"#818cf8"}}>{s.n}</div>
                <div style={{fontSize:9,color:"#6366f1",letterSpacing:"1px",fontWeight:700,marginTop:3}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:900,margin:"0 auto",padding:"26px 20px 60px"}}>
        <form onSubmit={create} style={{background:"linear-gradient(145deg,#17152e,#111025)",border:"1px solid rgba(99,102,241,.2)",padding:22,borderRadius:16,marginBottom:28,boxShadow:"0 12px 35px rgba(0,0,0,.2)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{width:38,height:38,borderRadius:10,display:"grid",placeItems:"center",background:"rgba(99,102,241,.15)",fontSize:19}}>✏️</div>
            <div>
              <h2 style={{margin:0,fontSize:18,color:"#fff"}}>방명록 작성</h2>
              <p style={{margin:"3px 0 0",fontSize:11,color:"#6366f1"}}>새로운 메시지를 남겨보세요</p>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="이름" style={input}/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="비밀번호" style={input}/>
          </div>
          <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="방명록에 남길 메시지를 입력해주세요 :)" rows={4} style={{...input,resize:"vertical"}}/>
          <button disabled={loading} style={primaryButton}>{loading?"등록 중...":"💜 방명록 남기기"}</button>
        </form>

        {notice && <div style={{background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.22)",color:"#c7d2fe",padding:"12px 15px",borderRadius:10,marginBottom:20,fontSize:13}}>{notice}</div>}

        <div style={{display:"flex",alignItems:"end",justifyContent:"space-between",marginBottom:14}}>
          <div>
            <p style={{margin:0,fontSize:10,color:"#6366f1",letterSpacing:"1.5px",fontWeight:700}}>MESSAGE BOARD</p>
            <h2 style={{margin:"4px 0 0",fontSize:22,color:"#fff"}}>방명록 목록</h2>
          </div>
          <span style={{fontSize:11,color:"#6366f1"}}>최신 글부터 표시</span>
        </div>

        {posts.length===0 && (
          <div style={{background:"#111025",border:"1px solid rgba(99,102,241,.15)",borderRadius:14,padding:"55px 20px",textAlign:"center"}}>
            <div style={{fontSize:42,marginBottom:10}}>📝</div>
            <p style={{margin:0,color:"#818cf8",fontSize:14}}>아직 작성된 글이 없어요</p>
            <small style={{color:"#4f46e5"}}>첫 번째 방명록을 남겨보세요!</small>
          </div>
        )}

        <div style={{display:"grid",gap:12}}>
          {posts.map((p,i)=><article key={p.id} style={{...card,animationDelay:i*30+"ms"}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:38,height:38,borderRadius:11,background:"linear-gradient(135deg,#4f46e5,#818cf8)",display:"grid",placeItems:"center",fontWeight:800,color:"#fff"}}>{p.name.trim().charAt(0).toUpperCase()}</div>
                <div>
                  <strong style={{display:"block",color:"#eef2ff",fontSize:14}}>{p.name}</strong>
                  <small style={{color:"#4f46e5",fontSize:10}}>{new Date(p.created_at).toLocaleString("ko-KR")}</small>
                </div>
              </div>
              <span style={{fontSize:10,color:"#3730a3",fontWeight:700}}>#{String(p.id).padStart(3,"0")}</span>
            </div>
            <p style={{whiteSpace:"pre-wrap",lineHeight:1.75,color:"#c7d2fe",fontSize:14,margin:"16px 0"}}>{p.message}</p>
            <div style={{display:"flex",gap:7,borderTop:"1px solid rgba(99,102,241,.09)",paddingTop:12}}>
              <button onClick={()=>openEdit(p)} style={smallButton}>✏️ 수정</button>
              <button onClick={()=>openDelete(p)} style={{...smallButton,color:"#a5b4fc"}}>🗑️ 삭제</button>
            </div>
          </article>)}
        </div>

        <footer style={{textAlign:"center",padding:"35px 0 5px",color:"#3730a3",fontSize:10,letterSpacing:".8px"}}>
          KANGNAM UNIVERSITY · GUESTBOOK<br/>
          <span style={{color:"#4f46e5"}}>개발자 장희현 · 학번 202104324</span>
        </footer>
      </div>

      {action && <div style={{position:"fixed",inset:0,zIndex:20,background:"rgba(3,2,10,.78)",backdropFilter:"blur(6px)",display:"grid",placeItems:"center",padding:20}}>
        <div style={{background:"#17152e",border:"1px solid rgba(129,140,248,.25)",padding:22,borderRadius:16,width:"100%",maxWidth:430,boxShadow:"0 20px 70px rgba(0,0,0,.5)"}}>
          <div style={{fontSize:28,marginBottom:6}}>{action.type==="edit"?"✏️":"🗑️"}</div>
          <h2 style={{margin:"0 0 6px",color:"#fff"}}>{action.type==="edit"?"글 수정":"글 삭제"}</h2>
          <p style={{margin:"0 0 16px",fontSize:12,color:"#818cf8"}}>작성할 때 입력한 비밀번호를 확인해주세요.</p>
          {action.type==="edit" && <textarea value={editMessage} onChange={e=>setEditMessage(e.target.value)} rows={5} style={{...input,resize:"vertical"}}/>}
          <input type="password" value={actionPassword} onChange={e=>setActionPassword(e.target.value)} placeholder="비밀번호" style={input}/>
          <div style={{display:"flex",gap:8}}>
            <button onClick={runAction} disabled={loading} style={primaryButton}>{action.type==="edit"?"수정하기":"삭제하기"}</button>
            <button onClick={()=>setAction(null)} style={{...smallButton,flex:1,padding:12}}>취소</button>
          </div>
        </div>
      </div>}
    </main>
  )
}

const input={width:"100%",boxSizing:"border-box" as const,padding:"12px 13px",marginBottom:10,border:"1px solid rgba(129,140,248,.18)",borderRadius:9,fontSize:14,background:"#0d0b1c",color:"#e0e7ff",outline:"none"}
const primaryButton={width:"100%",padding:13,border:0,borderRadius:9,background:"linear-gradient(135deg,#4f46e5,#6366f1)",color:"white",fontWeight:800,cursor:"pointer",boxShadow:"0 0 18px rgba(99,102,241,.18)"}
const smallButton={padding:"7px 13px",border:"1px solid rgba(129,140,248,.16)",borderRadius:8,background:"rgba(99,102,241,.06)",color:"#a5b4fc",cursor:"pointer",fontSize:12,fontWeight:600}
const card={background:"#111025",border:"1px solid rgba(99,102,241,.14)",padding:18,borderRadius:14,boxShadow:"0 8px 25px rgba(0,0,0,.14)"}
