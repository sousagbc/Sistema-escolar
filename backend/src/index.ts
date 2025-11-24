import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import 'express-async-errors'
import prisma from './prisma'
import * as ctrl from './controllers'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Students
app.get('/students', ctrl.listStudents)
app.post('/students', ctrl.createStudent)
app.get('/students/:id', ctrl.getStudent)
app.put('/students/:id', ctrl.updateStudent)
app.delete('/students/:id', ctrl.deleteStudent)

// Teachers
app.get('/teachers', ctrl.listTeachers)
app.post('/teachers', ctrl.createTeacher)
app.delete('/teachers/:id', ctrl.deleteTeacher)
app.put('/teachers/:id', ctrl.updateTeacher)

// Subjects
app.get('/subjects', ctrl.listSubjects)
app.post('/subjects', ctrl.createSubject)
app.delete('/subjects/:id', ctrl.deleteSubject)
app.put('/subjects/:id', ctrl.updateSubject)

// Classes
app.get('/classes', ctrl.listClasses)
app.post('/classes', ctrl.createClass)
app.delete('/classes/:id', ctrl.deleteClass)
app.put('/classes/:id', ctrl.updateClass)

// Enrollments
app.post('/enrollments', ctrl.createEnrollment)
app.get('/enrollments', ctrl.listEnrollments)
app.delete('/enrollments/:id', ctrl.deleteEnrollment)
app.put('/enrollments/:id', ctrl.updateEnrollment)

// Grades
app.post('/grades', ctrl.createGrade)
app.get('/grades', ctrl.listGrades)
app.delete('/grades/:id', ctrl.deleteGrade)
app.put('/grades/:id', ctrl.updateGrade)
app.post('/grades/average', ctrl.createGradesAverage)

// Report
app.get('/report/:id', ctrl.studentReport)

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err)
  res.status(500).json({ error: err?.message ?? 'Internal error' })
})

const port = process.env.PORT || 4000
app.listen(Number(port), () => {
  console.log(`Server running on http://localhost:${port}`)
})
