import prisma from './prisma'

async function main() {
  await prisma.grade.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.class.deleteMany()
  await prisma.student.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.subject.deleteMany()

  const t1 = await prisma.teacher.create({ data: { name: 'Maria Silva', email: 'maria@example.com' } })
  const t2 = await prisma.teacher.create({ data: { name: 'João Souza', email: 'joao@example.com' } })

  const s1 = await prisma.subject.create({ data: { name: 'Matemática', code: 'MAT' } })
  const s2 = await prisma.subject.create({ data: { name: 'Português', code: 'POR' } })

  const c1 = await prisma.class.create({ data: { name: 'Matemática - 1A', subjectId: s1.id, teacherId: t1.id } })
  const c2 = await prisma.class.create({ data: { name: 'Português - 1A', subjectId: s2.id, teacherId: t2.id } })

  const st1 = await prisma.student.create({ data: { name: 'Alice', email: 'alice@example.com' } })
  const st2 = await prisma.student.create({ data: { name: 'Carlos', email: 'carlos@example.com' } })

  const e1 = await prisma.enrollment.create({ data: { studentId: st1.id, classId: c1.id } })
  const e2 = await prisma.enrollment.create({ data: { studentId: st1.id, classId: c2.id } })
  const e3 = await prisma.enrollment.create({ data: { studentId: st2.id, classId: c1.id } })

  await prisma.grade.create({ data: { enrollmentId: e1.id, value: 8.5 } })
  await prisma.grade.create({ data: { enrollmentId: e1.id, value: 7.0 } })
  await prisma.grade.create({ data: { enrollmentId: e2.id, value: 9.0 } })

  // recompute averages
  for (const e of [e1, e2, e3]) {
    const grades = await prisma.grade.findMany({ where: { enrollmentId: e.id } })
    if (grades.length) {
      const avg = grades.reduce((s, g) => s + g.value, 0) / grades.length
      await prisma.enrollment.update({ where: { id: e.id }, data: { average: avg } })
    }
  }

  console.log('Seed complete')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
