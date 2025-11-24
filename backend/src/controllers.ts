import { Request, Response } from 'express'
import prisma from './prisma'
import { studentCreateSchema, teacherCreateSchema, subjectCreateSchema, classCreateSchema, enrollmentCreateSchema, gradeCreateSchema } from './schemas'
import { gradeAverageSchema } from './schemas'

export const listStudents = async (req: Request, res: Response) => {
  const students = await prisma.student.findMany()
  res.json(students)
}

export const createStudent = async (req: Request, res: Response) => {
  const parsed = studentCreateSchema.parse(req.body)
  const s = await prisma.student.create({ data: parsed })
  res.status(201).json(s)
}

export const getStudent = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const s = await prisma.student.findUnique({ where: { id }, include: { enrollments: true } })
  if (!s) return res.status(404).json({ error: 'Not found' })
  res.json(s)
}

export const updateStudent = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const parsed = studentCreateSchema.partial().parse(req.body)
  const s = await prisma.student.update({ where: { id }, data: parsed })
  res.json(s)
}

export const deleteStudent = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  await prisma.student.delete({ where: { id } })
  res.status(204).send()
}

// Teachers
export const listTeachers = async (req: Request, res: Response) => {
  const items = await prisma.teacher.findMany()
  res.json(items)
}
export const createTeacher = async (req: Request, res: Response) => {
  const parsed = teacherCreateSchema.parse(req.body)
  const t = await prisma.teacher.create({ data: parsed })
  res.status(201).json(t)
}
export const deleteTeacher = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  await prisma.teacher.delete({ where: { id } })
  res.status(204).send()
}
export const updateTeacher = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const parsed = teacherCreateSchema.partial().parse(req.body)
  const t = await prisma.teacher.update({ where: { id }, data: parsed })
  res.json(t)
}

// Subjects
export const listSubjects = async (req: Request, res: Response) => {
  const items = await prisma.subject.findMany()
  res.json(items)
}
export const createSubject = async (req: Request, res: Response) => {
  const parsed = subjectCreateSchema.parse(req.body)
  const s = await prisma.subject.create({ data: parsed })
  res.status(201).json(s)
}
export const deleteSubject = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  await prisma.subject.delete({ where: { id } })
  res.status(204).send()
}
export const updateSubject = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const parsed = subjectCreateSchema.partial().parse(req.body)
  const s = await prisma.subject.update({ where: { id }, data: parsed })
  res.json(s)
}

// Classes (turmas)
export const listClasses = async (req: Request, res: Response) => {
  const items = await prisma.class.findMany({ include: { subject: true, teacher: true } })
  res.json(items)
}
export const createClass = async (req: Request, res: Response) => {
  const parsed = classCreateSchema.parse(req.body)
  const c = await prisma.class.create({ data: parsed })
  res.status(201).json(c)
}
export const deleteClass = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  await prisma.class.delete({ where: { id } })
  res.status(204).send()
}
export const updateClass = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const parsed = classCreateSchema.partial().parse(req.body)
  const c = await prisma.class.update({ where: { id }, data: parsed })
  res.json(c)
}

// Enrollments
export const createEnrollment = async (req: Request, res: Response) => {
  const parsed = enrollmentCreateSchema.parse(req.body)
  // prevent duplicate
  const exists = await prisma.enrollment.findFirst({ where: { studentId: parsed.studentId, classId: parsed.classId } })
  if (exists) return res.status(400).json({ error: 'Student already enrolled' })
  const e = await prisma.enrollment.create({ data: parsed })
  res.status(201).json(e)
}

export const listEnrollments = async (req: Request, res: Response) => {
  const { studentId, classId } = req.query
  const where: any = {}
  if (studentId) where.studentId = Number(studentId)
  if (classId) where.classId = Number(classId)
  const items = await prisma.enrollment.findMany({ where, include: { student: true, class: { include: { subject: true, teacher: true } }, grades: true } })
  res.json(items)
}
export const deleteEnrollment = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  await prisma.enrollment.delete({ where: { id } })
  res.status(204).send()
}
export const updateEnrollment = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const parsed = enrollmentCreateSchema.partial().parse(req.body)
  const e = await prisma.enrollment.update({ where: { id }, data: parsed })
  res.json(e)
}

// Grades
export const createGrade = async (req: Request, res: Response) => {
  const parsed = gradeCreateSchema.parse(req.body)
  const g = await prisma.grade.create({ data: parsed })
  // recompute average
  const all = await prisma.grade.findMany({ where: { enrollmentId: parsed.enrollmentId } })
  const avg = all.reduce((s, x) => s + x.value, 0) / all.length
  await prisma.enrollment.update({ where: { id: parsed.enrollmentId }, data: { average: avg } })
  res.status(201).json(g)
}

export const deleteGrade = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  await prisma.grade.delete({ where: { id } })
  res.status(204).send()
}

export const listGrades = async (req: Request, res: Response) => {
  const { enrollmentId } = req.query
  const where: any = {}
  if (enrollmentId) where.enrollmentId = Number(enrollmentId)
  const items = await prisma.grade.findMany({ where, orderBy: { createdAt: 'desc' } })
  res.json(items)
}

export const updateGrade = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const parsed = gradeCreateSchema.partial().parse(req.body)
  const g = await prisma.grade.update({ where: { id }, data: parsed })
  // recompute average for enrollment
  const all = await prisma.grade.findMany({ where: { enrollmentId: g.enrollmentId } })
  const avg = all.length ? all.reduce((s, x) => s + x.value, 0) / all.length : null
  if (avg !== null) await prisma.enrollment.update({ where: { id: g.enrollmentId }, data: { average: avg } })
  res.json(g)
}

export const createGradesAverage = async (req: Request, res: Response) => {
  const parsed = gradeAverageSchema.parse(req.body)
  const { enrollmentId, nota1, nota2 } = parsed
  const g1 = await prisma.grade.create({ data: { enrollmentId, value: nota1, type: 'N1' } })
  const g2 = await prisma.grade.create({ data: { enrollmentId, value: nota2, type: 'N2' } })
  const average = (nota1 + nota2) / 2
  await prisma.enrollment.update({ where: { id: enrollmentId }, data: { average } })
  const status = average >= 7 ? 'APROVADO' : 'REPROVADO'
  res.status(201).json({ grades: [g1, g2], average, status })
}

// Report / boletim individual
export const studentReport = async (req: Request, res: Response) => {
  const studentId = Number(req.params.id)
  const student = await prisma.student.findUnique({ where: { id: studentId } })
  if (!student) return res.status(404).json({ error: 'Student not found' })
  const enrollments = await prisma.enrollment.findMany({ where: { studentId }, include: { class: { include: { subject: true, teacher: true } }, grades: true } })
  const report = {
    student,
    enrollments: enrollments.map(e => ({
      class: e.class,
      absences: e.absences,
      average: e.average ?? (e.grades.length ? e.grades.reduce((s, g) => s + g.value, 0) / e.grades.length : null),
      grades: e.grades
    }))
  }
  res.json(report)
}
