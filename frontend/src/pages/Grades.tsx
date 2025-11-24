import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Grades(){
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [enrollmentId, setEnrollmentId] = useState<number | ''>('')
  const [nota1, setNota1] = useState<number | ''>('')
  const [nota2, setNota2] = useState<number | ''>('')
  const [grades, setGrades] = useState<any[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<number | ''>('')

  useEffect(()=>{ fetchAll() }, [])
  const fetchAll = async ()=>{
    const [e,g] = await Promise.all([api.get('/enrollments'), api.get('/grades')])
    setEnrollments(e.data); setGrades(g.data)
  }
  const create = async (ev:any)=>{
    ev.preventDefault()
    if (!enrollmentId) return
    await api.post('/grades/average', { enrollmentId: Number(enrollmentId), nota1: Number(nota1), nota2: Number(nota2) })
    setEnrollmentId(''); setNota1(''); setNota2(''); fetchAll()
  }
  const handleDelete = async (id:number)=>{ await api.delete(`/grades/${id}`); fetchAll() }
  const startEdit = (g:any)=>{ setEditingId(g.id); setEditValue(g.value) }
  const cancelEdit = ()=>{ setEditingId(null); setEditValue('') }
  const saveEdit = async (id:number)=>{ await api.put(`/grades/${id}`, { value: Number(editValue) }); cancelEdit(); fetchAll() }

  return (
    <div>
      <h2>Notas</h2>
      <table>
        <thead><tr><th>ID</th><th>Matrícula</th><th>Valor</th><th>Data</th><th/></tr></thead>
        <tbody>{grades.map(g=> editingId===g.id ? (
          <tr key={g.id}><td>{g.id}</td><td>{g.enrollmentId}</td><td><input value={editValue as any} onChange={e=>setEditValue(Number(e.target.value))} /></td><td>{new Date(g.createdAt).toLocaleString()}</td><td className="actions"><button className="primary" onClick={()=>saveEdit(g.id)}>Salvar</button> <button className="ghost" onClick={cancelEdit}>Cancelar</button></td></tr>
        ) : (
          <tr key={g.id}><td>{g.id}</td><td>{g.enrollmentId}</td><td>{g.value}</td><td>{new Date(g.createdAt).toLocaleString()}</td><td className="actions"><button className="ghost" onClick={()=>startEdit(g)}>Editar</button> <button className="danger" onClick={()=>handleDelete(g.id)}>Excluir</button></td></tr>
        ))}</tbody>
      </table>
      <form onSubmit={create}>
        <select value={enrollmentId} onChange={e=>setEnrollmentId(Number(e.target.value))}>
          <option value="">Selecione matrícula</option>
          {enrollments.map(en=> <option key={en.id} value={en.id}>{en.student?.name} - {en.class?.name}</option>)}
        </select>
        <input placeholder="Nota 1 (0-10)" value={nota1 as any} onChange={e=>setNota1(Number(e.target.value))} />
        <input placeholder="Nota 2 (0-10)" value={nota2 as any} onChange={e=>setNota2(Number(e.target.value))} />
        <button className="primary" type="submit">Lançar notas e Calcular Média</button>
      </form>

      <div style={{marginTop:12}}>
        <h3>Médias por Matrícula</h3>
        <table>
          <thead><tr><th>Aluno</th><th>Turma</th><th>Média</th><th>Status</th></tr></thead>
          <tbody>
            {enrollments.map(en => (
              <tr key={en.id}><td>{en.student?.name}</td><td>{en.class?.name}</td><td>{en.average ?? '-'}</td><td>{typeof en.average === 'number' ? (en.average >= 7 ? 'APROVADO' : 'REPROVADO') : '-'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
