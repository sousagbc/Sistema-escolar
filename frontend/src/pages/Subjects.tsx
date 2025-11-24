import React, { useEffect, useState } from 'react'
import { api } from '../api'

type Subject = { id:number; name:string; code?:string }

export default function Subjects(){
  const [items, setItems] = useState<Subject[]>([])
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editCode, setEditCode] = useState('')
  useEffect(()=>{ fetchAll() }, [])
  const fetchAll = async ()=>{ const r = await api.get('/subjects'); setItems(r.data) }
  const create = async (e:any)=>{ e.preventDefault(); await api.post('/subjects',{name,code: code||undefined}); setName(''); setCode(''); fetchAll() }
  const handleDelete = async (id:number)=>{ await api.delete(`/subjects/${id}`); fetchAll() }
  const startEdit = (s:Subject)=>{ setEditingId(s.id); setEditName(s.name); setEditCode(s.code||'') }
  const cancelEdit = ()=>{ setEditingId(null); setEditName(''); setEditCode('') }
  const saveEdit = async (id:number)=>{ await api.put(`/subjects/${id}`, { name: editName, code: editCode || undefined }); cancelEdit(); fetchAll() }
  return (
    <div>
      <h2>Matérias</h2>
      <table>
        <thead><tr><th>ID</th><th>Nome</th><th>Código</th></tr></thead>
        <tbody>{items.map(s=> editingId===s.id ? (
          <tr key={s.id}><td>{s.id}</td><td><input value={editName} onChange={e=>setEditName(e.target.value)} /></td><td><input value={editCode} onChange={e=>setEditCode(e.target.value)} /></td><td><button onClick={()=>saveEdit(s.id)}>Salvar</button> <button onClick={cancelEdit}>Cancelar</button></td></tr>
        ) : (
          <tr key={s.id}><td>{s.id}</td><td>{s.name}</td><td>{s.code}</td><td className="actions"><button className="ghost" onClick={()=>startEdit(s)}>Editar</button> <button className="danger" onClick={()=>handleDelete(s.id)}>Excluir</button></td></tr>
        ))}</tbody>
      </table>
      <form onSubmit={create}>
        <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Código" value={code} onChange={e=>setCode(e.target.value)} />
        <button className="primary" type="submit">Criar</button>
      </form>
    </div>
  )
}
