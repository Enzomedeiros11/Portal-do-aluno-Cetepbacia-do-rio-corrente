import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { User } from '../types';

export const downloadBoletimPDF = (user: User) => {
  const getSubjectGrade = (subName: string, subjectGrades: any) => {
    const grades = subjectGrades?.[subName];
    if (!grades) return '-';
    
    const vals = [grades.n1, grades.n2, grades.n3].filter((v: any) => v !== '' && !isNaN(Number(v)));
    if (vals.length === 0) return '-';
    
    const sum = vals.reduce((acc: number, val: any) => acc + Number(val), 0);
    return (sum / vals.length).toFixed(1);
  };

  const getSubjects = (courseName?: string, subjectGrades?: any) => {
    const regular = [
      'Português', 'Matemática', 'Química', 'Física', 'Biologia', 'História', 
      'Geografia', 'Inglês', 'Filosofia', 'Sociologia', 'Educação Física', 'Artes'
    ].map(name => ({ name, grade: getSubjectGrade(name, subjectGrades) }));

    const technicalSubjects: Record<string, string[]> = {
      'Técnico em Informática': ['Banco de Dados', 'Robótica', 'Prática Profissional', 'Fundamentos e Arquitetura', 'Programação Web'],
      'Administração': ['Gestão de Pessoas', 'Logística', 'Contabilidade', 'Marketing', 'Administração Financeira'],
      'Nutrição': ['Anatomia', 'Fisiologia', 'Composição de Alimentos', 'Nutrição Clínica', 'Higiene de Alimentos'],
      'Agropecuária': ['Zootecnia', 'Fitotecnia', 'Máquinas Agrícolas', 'Solos', 'Topografia'],
      'Enfermagem': ['Fundamentos de Enfermagem', 'Anatomia Humana', 'Farmacologia', 'Saúde Coletiva', 'Enfermagem Cirúrgica'],
      'Meio Ambiente': ['Ecologia', 'Gestão Ambiental', 'Educação Ambiental', 'Poluição e Controle', 'Microbiologia Ambiental']
    };

    const techMapped = (technicalSubjects[courseName || ''] || []).map(name => ({ name, grade: getSubjectGrade(name, subjectGrades) }));
    if (!courseName || courseName === 'Regular') return regular;
    return [...regular, ...techMapped];
  };

  const subjects = getSubjects(user.course, user.subjectGrades);
  const validGrades = subjects.filter(s => s.grade !== '-').map(s => Number(s.grade));
  const ira = validGrades.length === 0 ? '0.0' : (validGrades.reduce((a, b) => a + b, 0) / validGrades.length).toFixed(1);

  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const date = new Date().toLocaleDateString('pt-BR');
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102);
    doc.text('CETEP - Portal Acadêmico', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text('Boletim de Notas Oficial', pageWidth / 2, 30, { align: 'center' });
    
    // Student Info
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Aluno: ${user.name}`, 20, 45);
    doc.text(`Curso: ${user.course}`, 20, 50);
    doc.text(`Série: ${user.grade}`, 20, 55);
    doc.text(`Data de Emissão: ${date}`, pageWidth - 20, 45, { align: 'right' });
    doc.text(`IRA: ${ira}`, pageWidth - 20, 50, { align: 'right' });
    doc.text(`Frequência: ${user.frequencia || 100}%`, pageWidth - 20, 55, { align: 'right' });
    
    doc.setDrawColor(200);
    doc.line(20, 60, pageWidth - 20, 60);
    
    // Table
    const tableData = subjects.map(sub => [sub.name, sub.grade]);

    (doc as any).autoTable({
      startY: 65,
      head: [['Matéria', 'Média']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [0, 51, 102] },
      styles: { fontSize: 9 },
    });
    
    // Footer
    const finalY = Math.max((doc as any).lastAutoTable.finalY + 20, 250);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Documento gerado eletronicamente pelo Sistema de Gestão Acadêmica CETEP.', pageWidth / 2, finalY, { align: 'center' });
    doc.text('Este documento tem caráter informativo.', pageWidth / 2, finalY + 5, { align: 'center' });

    // Using output as blob to handle potential iframe download restrictions
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Boletim_${user.name.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    return true;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
};
