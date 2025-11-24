import React, { useEffect, useState } from 'react'
import { api } from '../api'

type Student = { id: number; name: string; email?: string }

export default function Students(){
  const [students, setStudents] = useState<Student[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')

  useEffect(() => { fetchAll() }, [])
  const fetchAll = async () => {
    const res = await api.get('/students')
    setStudents(res.data)
  }

  const handleCreate = async (e: any) => {
    e.preventDefault()
    await api.post('/students', { name, email: email || undefined })
    setName('')
    setEmail('')
    fetchAll()
  }

  const handleDelete = async (id: number) => {
    await api.delete(`/students/${id}`)
    fetchAll()
  }

  const startEdit = (s: Student) => {
    setEditingId(s.id)
    setEditName(s.name)
    setEditEmail(s.email ?? '')
  }

  const cancelEdit = () => { setEditingId(null); setEditName(''); setEditEmail('') }

  const saveEdit = async (id:number) => {
    await api.put(`/students/${id}`, { name: editName, email: editEmail || undefined })
    cancelEdit()
    fetchAll()
  }

  return (
    <div>
      <h2>Alunos</h2>
      <table>
        <thead><tr><th>ID</th><th>Nome</th><th>Email</th><th/></tr></thead>
        <tbody>
          {students.map(s => (
            editingId === s.id ? (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td><input value={editName} onChange={e=>setEditName(e.target.value)} /></td>
                <td><input value={editEmail} onChange={e=>setEditEmail(e.target.value)} /></td>
                        <td>
                          <button className="primary" onClick={()=>saveEdit(s.id)}>Salvar</button>
                          <button className="ghost" onClick={cancelEdit}>Cancelar</button>
                        </td>
              </tr>
            ) : (
              <tr key={s.id}><td>{s.id}</td><td>{s.name}</td><td>{s.email}</td><td className="actions"><button className="ghost" onClick={()=>startEdit(s)}>Editar</button> <button className="danger" onClick={()=>handleDelete(s.id)}>Excluir</button></td></tr>
            )
          ))}
        </tbody>
      </table>

      <form onSubmit={handleCreate}>
        <h3>Novo aluno</h3>
        <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="primary" type="submit">Criar</button>
      </form>
    </div>
  )
}
