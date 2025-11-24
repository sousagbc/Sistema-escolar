import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Enrollments(){
  const [students, setStudents] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [studentId, setStudentId] = useState<number | ''>('')
  const [classId, setClassId] = useState<number | ''>('')
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editStudentId, setEditStudentId] = useState<number | ''>('')
  const [editClassId, setEditClassId] = useState<number | ''>('')

  useEffect(()=>{ fetchAll() }, [])
  const fetchAll = async ()=>{
    const [s,c,e] = await Promise.all([api.get('/students'), api.get('/classes'), api.get('/enrollments')])
    setStudents(s.data); setClasses(c.data); setEnrollments(e.data)
  }
  const create = async (ev:any)=>{ ev.preventDefault(); await api.post('/enrollments',{ studentId: Number(studentId), classId: Number(classId) }); setStudentId(''); setClassId(''); fetchAll() }
  const handleDelete = async (id:number)=>{ await api.delete(`/enrollments/${id}`); fetchAll() }
  const startEdit = (en:any)=>{ setEditingId(en.id); setEditStudentId(en.studentId); setEditClassId(en.classId) }
  const cancelEdit = ()=>{ setEditingId(null); setEditStudentId(''); setEditClassId('') }
  const saveEdit = async (id:number)=>{ await api.put(`/enrollments/${id}`, { studentId: Number(editStudentId), classId: Number(editClassId) }); cancelEdit(); fetchAll() }

  return (
    <div>
      <h2>Matrículas</h2>
      <table>
        <thead><tr><th>Aluno</th><th>Turma</th><th>Média</th><th/></tr></thead>
        <tbody>{enrollments.map(e=> editingId===e.id ? (<tr key={e.id}><td><select value={editStudentId} onChange={ev=>setEditStudentId(Number(ev.target.value))}>{students.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}</select></td><td><select value={editClassId} onChange={ev=>setEditClassId(Number(ev.target.value))}>{classes.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}</select></td><td>{e.average}</td><td className="actions"><button className="primary" onClick={()=>saveEdit(e.id)}>Salvar</button> <button className="ghost" onClick={cancelEdit}>Cancelar</button></td></tr>) : (<tr key={e.id}><td>{e.student?.name}</td><td>{e.class?.name}</td><td>{e.average}</td><td className="actions"><button className="ghost" onClick={()=>startEdit(e)}>Editar</button> <button className="danger" onClick={()=>handleDelete(e.id)}>Excluir</button></td></tr>))}</tbody>
      </table>
      <form onSubmit={create}>
        <select value={studentId} onChange={e=>setStudentId(Number(e.target.value))}>
          <option value="">Selecione aluno</option>
          {students.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={classId} onChange={e=>setClassId(Number(e.target.value))}>
          <option value="">Selecione turma</option>
          {classes.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button type="submit">Matricular</button>
      </form>
    </div>
  )
}
