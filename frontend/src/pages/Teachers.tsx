import React, { useEffect, useState } from 'react'
import { api } from '../api'

type Teacher = { id:number; name:string; email?:string }

export default function Teachers(){
  const [items, setItems] = useState<Teacher[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')

  useEffect(()=>{ fetchAll() }, [])
  const fetchAll = async ()=>{ const r = await api.get('/teachers'); setItems(r.data) }
  const create = async (e:any)=>{ e.preventDefault(); await api.post('/teachers',{name,email: email||undefined}); setName(''); setEmail(''); fetchAll() }
  const handleDelete = async (id:number)=>{ await api.delete(`/teachers/${id}`); fetchAll() }
  const startEdit = (t:Teacher)=>{ setEditingId(t.id); setEditName(t.name); setEditEmail(t.email||'') }
  const cancelEdit = ()=>{ setEditingId(null); setEditName(''); setEditEmail('') }
  const saveEdit = async (id:number)=>{ await api.put(`/teachers/${id}`, { name: editName, email: editEmail || undefined }); cancelEdit(); fetchAll() }

  return (
    <div>
      <h2>Professores</h2>
      <table>
        <thead><tr><th>ID</th><th>Nome</th><th>Email</th><th/></tr></thead>
        <tbody>{items.map(t=> editingId===t.id ? (
          <tr key={t.id}><td>{t.id}</td><td><input value={editName} onChange={e=>setEditName(e.target.value)} /></td><td><input value={editEmail} onChange={e=>setEditEmail(e.target.value)} /></td><td><button onClick={()=>saveEdit(t.id)}>Salvar</button> <button onClick={cancelEdit}>Cancelar</button></td></tr>
        ) : (
          <tr key={t.id}><td>{t.id}</td><td>{t.name}</td><td>{t.email}</td><td className="actions"><button className="ghost" onClick={()=>startEdit(t)}>Editar</button> <button className="danger" onClick={()=>handleDelete(t.id)}>Excluir</button></td></tr>
        ))}</tbody>
      </table>
      <form onSubmit={create}>
        <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="primary" type="submit">Criar</button>
      </form>
    </div>
  )
}
