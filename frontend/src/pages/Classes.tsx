import React, { useEffect, useState } from 'react'
import { api } from '../api'

type Cls = { id:number; name:string; subjectId:number; teacherId:number; subject?:any; teacher?:any }

export default function Classes(){
  const [items, setItems] = useState<Cls[]>([])
  const [name, setName] = useState('')
  const [subjectId, setSubjectId] = useState<number | ''>('')
  const [teacherId, setTeacherId] = useState<number | ''>('')
  const [subjects, setSubjects] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editSubjectId, setEditSubjectId] = useState<number | ''>('')
  const [editTeacherId, setEditTeacherId] = useState<number | ''>('')

  useEffect(()=>{ fetchAll() }, [])
  const fetchAll = async ()=>{
    const [r,t,s] = await Promise.all([api.get('/classes'), api.get('/teachers'), api.get('/subjects')])
    setItems(r.data)
    setTeachers(t.data)
    setSubjects(s.data)
  }
  const create = async (e:any)=>{
    e.preventDefault()
    await api.post('/classes',{ name, subjectId: Number(subjectId), teacherId: Number(teacherId) })
    setName(''); setSubjectId(''); setTeacherId(''); fetchAll()
  }
  const handleDelete = async (id:number)=>{ await api.delete(`/classes/${id}`); fetchAll() }
  const startEdit = (c:Cls)=>{ setEditingId(c.id); setEditName(c.name); setEditSubjectId(c.subjectId); setEditTeacherId(c.teacherId) }
  const cancelEdit = ()=>{ setEditingId(null); setEditName(''); setEditSubjectId(''); setEditTeacherId('') }
  const saveEdit = async (id:number)=>{ await api.put(`/classes/${id}`, { name: editName, subjectId: Number(editSubjectId), teacherId: Number(editTeacherId) }); cancelEdit(); fetchAll() }

  return (
    <div>
      <h2>Turmas</h2>
      <table>
        <thead><tr><th>ID</th><th>Nome</th><th>Matéria</th><th>Professor</th><th/></tr></thead>
        <tbody>{items.map(c=> editingId===c.id ? (
          <tr key={c.id}><td>{c.id}</td><td><input value={editName} onChange={e=>setEditName(e.target.value)} /></td><td><select value={editSubjectId} onChange={e=>setEditSubjectId(Number(e.target.value))}>{subjects.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}</select></td><td><select value={editTeacherId} onChange={e=>setEditTeacherId(Number(e.target.value))}>{teachers.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}</select></td><td><button onClick={()=>saveEdit(c.id)}>Salvar</button> <button onClick={cancelEdit}>Cancelar</button></td></tr>
        ) : (
          <tr key={c.id}><td>{c.id}</td><td>{c.name}</td><td>{c.subject?.name}</td><td>{c.teacher?.name}</td><td className="actions"><button className="ghost" onClick={()=>startEdit(c)}>Editar</button> <button className="danger" onClick={()=>handleDelete(c.id)}>Excluir</button></td></tr>
        ))}</tbody>
      </table>
      <form onSubmit={create}>
        <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
        <select value={subjectId} onChange={e=>setSubjectId(Number(e.target.value))}>
          <option value="">Selecione matéria</option>
          {subjects.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={teacherId} onChange={e=>setTeacherId(Number(e.target.value))}>
          <option value="">Selecione professor</option>
          {teachers.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <button className="primary" type="submit">Criar</button>
      </form>
    </div>
  )
}
