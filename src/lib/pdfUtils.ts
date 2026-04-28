import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';
import { User } from '../types';

export const downloadBoletimPDF = (user: User) => {
  const getDetailedGrades = (subName: string, subjectGrades: any) => {
    const grades = subjectGrades?.[subName] || { n1: '-', n2: '-', n3: '-' };
    const n1 = grades.n1 || '-';
    const n2 = grades.n2 || '-';
    const n3 = grades.n3 || '-';
    
    const vals = [n1, n2, n3].filter((v: any) => v !== '-' && v !== '' && !isNaN(Number(v)));
    const media = vals.length === 0 ? '-' : (vals.reduce((acc: number, val: any) => acc + Number(val), 0) / vals.length).toFixed(1);
    
    return { n1, n2, n3, media };
  };

  const getSubjects = (courseName?: string, subjectGrades?: any) => {
    const regularNames = [
      'Português', 'Matemática', 'Química', 'Física', 'Biologia', 'História', 
      'Geografia', 'Inglês', 'Filosofia', 'Sociologia', 'Educação Física', 'Artes'
    ];

    const technicalSubjects: Record<string, string[]> = {
      'Técnico em Informática': ['Banco de Dados', 'Robótica', 'Prática Profissional', 'Fundamentos e Arquitetura', 'Programação Web'],
      'Administração': ['Gestão de Pessoas', 'Logística', 'Contabilidade', 'Marketing', 'Administração Financeira'],
      'Nutrição': ['Anatomia', 'Fisiologia', 'Composição de Alimentos', 'Nutrição Clínica', 'Higiene de Alimentos'],
      'Agropecuária': ['Zootecnia', 'Fitotecnia', 'Máquinas Agrícolas', 'Solos', 'Topografia'],
      'Enfermagem': ['Fundamentos de Enfermagem', 'Anatomia Humana', 'Farmacologia', 'Saúde Coletiva', 'Enfermagem Cirúrgica'],
      'Meio Ambiente': ['Ecologia', 'Gestão Ambiental', 'Educação Ambiental', 'Poluição e Controle', 'Microbiologia Ambiental']
    };

    const techNames = technicalSubjects[courseName || ''] || [];
    const allNames = courseName === 'Regular' ? regularNames : [...regularNames, ...techNames];
    
    return allNames.map(name => ({ name, ...getDetailedGrades(name, subjectGrades) }));
  };

  const subjects = getSubjects(user.course, user.subjectGrades);
  const validGrades = subjects.filter(s => s.media !== '-').map(s => Number(s.media));
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
    
    // Table Data
    const tableData = subjects.map(sub => [
      sub.name, 
      sub.n1, 
      sub.n2, 
      sub.n3, 
      sub.media
    ]);

    // Robust autoTable call using the imported function directly
    autoTable(doc, {
      startY: 65,
      head: [['Matéria', '1º Bim', '2º Bim', '3º Bim', 'Média Final']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [0, 51, 102] },
      styles: { fontSize: 9, halign: 'center' },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold' }
      }
    });
    
    // Footer - safe check after autoTable
    const finalY = (doc as any).lastAutoTable?.finalY ? Math.min((doc as any).lastAutoTable.finalY + 20, 280) : 200;
    
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Documento gerado eletronicamente pelo Sistema de Gestão Acadêmica CETEP.', pageWidth / 2, finalY, { align: 'center' });
    doc.text('Este documento tem caráter informativo.', pageWidth / 2, finalY + 5, { align: 'center' });

    // Directly save
    doc.save(`Boletim_${user.name.replace(/\s+/g, '_')}.pdf`);

    return true;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    toast.error('Erro ao gerar o PDF. Verifique os dados ou tente novamente.');
    return false;
  }
};
