import { z } from 'zod'

export const studentCreateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email().optional(),
})

export const teacherCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
})

export const subjectCreateSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
})

export const classCreateSchema = z.object({
  name: z.string().min(1),
  subjectId: z.number().int(),
  teacherId: z.number().int(),
})

export const enrollmentCreateSchema = z.object({
  studentId: z.number().int(),
  classId: z.number().int(),
})

export const gradeCreateSchema = z.object({
  enrollmentId: z.number().int(),
  value: z.number().min(0).max(10),
  type: z.string().optional(),
})

export const gradeAverageSchema = z.object({
  enrollmentId: z.number().int(),
  nota1: z.number().min(0).max(10),
  nota2: z.number().min(0).max(10),
})
