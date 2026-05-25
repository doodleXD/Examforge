const prisma = require('../utils/prismaClient');
const { generateExamCode } = require('../utils/codeGen');

// ── EXAM CRUD ──────────────────────────────────────────────────────

const createExam = async (req, res) => {
  try {
    const { title, subject, durationMinutes, totalMarks } = req.body;
    const exam = await prisma.exam.create({
      data: {
        adminId: req.user.userId,
        title,
        subject,
        durationMinutes: parseInt(durationMinutes),
        totalMarks: parseInt(totalMarks),
        status: 'draft'
      }
    });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyExams = async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      where: { adminId: req.user.userId },
      include: { questions: true, examCodes: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id },
      include: { questions: { orderBy: { orderIndex: 'asc' } }, examCodes: true }
    });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    if (exam.adminId !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateExam = async (req, res) => {
  try {
    const exam = await prisma.exam.findUnique({ where: { id: req.params.id } });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    if (exam.adminId !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });
    if (exam.status !== 'draft') return res.status(400).json({ message: 'Cannot edit a finalized exam' });
    const updated = await prisma.exam.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const finalizeExam = async (req, res) => {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id },
      include: { questions: true }
    });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    if (exam.adminId !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });
    if (exam.status !== 'draft') return res.status(400).json({ message: 'Exam already finalized' });
    if (exam.questions.length === 0) return res.status(400).json({ message: 'Add at least one question before finalizing' });

    const code = generateExamCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.exam.update({
      where: { id: req.params.id },
      data: { status: 'active' }
    });

    const examCode = await prisma.examCode.create({
      data: { examId: exam.id, code, expiresAt, isActive: true }
    });

    const shareableLink = `${process.env.FRONTEND_URL}/join?code=${code}`;
    res.json({ code, expiresAt, shareableLink, examCode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── QUESTION CRUD ──────────────────────────────────────────────────

const addQuestion = async (req, res) => {
  try {
    const { questionText, modelAnswer, marks } = req.body;
    const exam = await prisma.exam.findUnique({ where: { id: req.params.examId } });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    if (exam.adminId !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });
    if (exam.status !== 'draft') return res.status(400).json({ message: 'Cannot edit a finalized exam' });

    const count = await prisma.question.count({ where: { examId: req.params.examId } });
    const question = await prisma.question.create({
      data: {
        examId: req.params.examId,
        questionText,
        modelAnswer,
        marks: parseInt(marks),
        orderIndex: count + 1
      }
    });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await prisma.question.findUnique({ where: { id: req.params.id } });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    const exam = await prisma.exam.findUnique({ where: { id: question.examId } });
    if (exam.adminId !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });
    if (exam.status !== 'draft') return res.status(400).json({ message: 'Cannot edit a finalized exam' });
    const updated = await prisma.question.update({
      where: { id: req.params.id },
      data: {
        questionText: req.body.questionText,
        modelAnswer: req.body.modelAnswer,
        marks: parseInt(req.body.marks)  // ← parse to integer
      }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await prisma.question.findUnique({ where: { id: req.params.id } });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    const exam = await prisma.exam.findUnique({ where: { id: question.examId } });
    if (exam.adminId !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });
    if (exam.status !== 'draft') return res.status(400).json({ message: 'Cannot edit a finalized exam' });
    await prisma.question.delete({ where: { id: req.params.id } });
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getResults = async (req, res) => {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id },
      select: { title: true, subject: true }
    });
    const submissions = await prisma.submission.findMany({
      where: { examId: req.params.id },
      include: {
        student: { select: { name: true, email: true } },
        answers: {
          include: {
            question: { select: { questionText: true, marks: true,  modelAnswer: true } }
          }
        },
        violations: true
      },
      orderBy: { submittedAt: 'desc' }
    });
    res.json({ exam, submissions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const overrideScore = async (req, res) => {
  try {
    const { score } = req.body;
    const answer = await prisma.answer.update({
      where: { id: req.params.id },
      data: { adminOverrideScore: parseFloat(score) }
    });
    res.json(answer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const exportResults = async (req, res) => {
  try {
    const submissions = await prisma.submission.findMany({
      where: { examId: req.params.id },
      include: {
        student: { select: { name: true, email: true } },
        answers: { include: { question: true } }
      }
    });
    let csv = 'Student Name,Email,Submitted At,Total Score,Violations\n';
    submissions.forEach(sub => {
      const total = sub.answers.reduce((sum, a) =>
        sum + (a.adminOverrideScore ?? a.aiScore ?? 0), 0);
      csv += `"${sub.student.name}","${sub.student.email}","${sub.submittedAt}",${total},${sub.violationCount}\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=results.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteExam = async (req, res) => {
  try {
    const exam = await prisma.exam.findUnique({ where: { id: req.params.id } });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    if (exam.adminId !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });

    // Delete in correct order to avoid FK constraint errors
    const submissions = await prisma.submission.findMany({ where: { examId: exam.id } });
    for (const sub of submissions) {
      await prisma.violation.deleteMany({ where: { submissionId: sub.id } });
      await prisma.answer.deleteMany({ where: { submissionId: sub.id } });
    }
    await prisma.submission.deleteMany({ where: { examId: exam.id } });
    await prisma.examCode.deleteMany({ where: { examId: exam.id } });
    await prisma.question.deleteMany({ where: { examId: exam.id } });
    await prisma.exam.delete({ where: { id: exam.id } });

    res.json({ message: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createExam, getMyExams, getExamById, updateExam, deleteExam, finalizeExam,
  addQuestion, updateQuestion, deleteQuestion,
  getResults, overrideScore, exportResults
};