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

export const downloadCertificatePDF = (
  studentName: string,
  courseTitle: string = 'Excel do Zero ao Avançado',
  hours: number = 50,
  issuedDate?: string
) => {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 210mm
    const date = issuedDate || new Date().toLocaleDateString('pt-BR');
    const authCode = `CETEP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`;

    // Background aesthetic borders
    // Outer border (Navy)
    doc.setDrawColor(15, 42, 92);
    doc.setLineWidth(2.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Inner thin border (Gold)
    doc.setDrawColor(202, 138, 4);
    doc.setLineWidth(0.8);
    doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

    // Corner decorative accents
    doc.setDrawColor(15, 42, 92);
    doc.setLineWidth(1.5);
    const cornerSize = 12;
    // Top-left
    doc.line(14, 14 + cornerSize, 14 + cornerSize, 14);
    // Top-right
    doc.line(pageWidth - 14 - cornerSize, 14, pageWidth - 14, 14 + cornerSize);
    // Bottom-left
    doc.line(14, pageHeight - 14 - cornerSize, 14 + cornerSize, pageHeight - 14);
    // Bottom-right
    doc.line(pageWidth - 14 - cornerSize, pageHeight - 14, pageWidth - 14, pageHeight - 14 - cornerSize);

    // Institution Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 42, 92);
    doc.text('CENTRO ESTADUAL DE EDUCAÇÃO PROFISSIONAL', pageWidth / 2, 28, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('PORTAL ACADÊMICO OFICIAL • CAPACITAÇÃO E EXTENSÃO TÉCNICA', pageWidth / 2, 34, { align: 'center' });

    // Certificate Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(202, 138, 4); // Gold/amber
    doc.text('CERTIFICADO DE CONCLUSÃO', pageWidth / 2, 48, { align: 'center' });

    // Divider line
    doc.setDrawColor(202, 138, 4);
    doc.setLineWidth(0.6);
    doc.line(pageWidth / 2 - 40, 52, pageWidth / 2 + 40, 52);

    // Body text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(51, 65, 85);
    doc.text('Certificamos para os devidos fins legais e acadêmicos que o(a) estudante', pageWidth / 2, 65, { align: 'center' });

    // Student Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 42, 92);
    doc.text(studentName.toUpperCase(), pageWidth / 2, 80, { align: 'center' });

    // Line under name
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 80, 84, pageWidth / 2 + 80, 84);

    // Course completion description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85);
    const line1 = `concluiu com pleno êxito o curso de capacitação técnica em`;
    doc.text(line1, pageWidth / 2, 96, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 42, 92);
    doc.text(`"${courseTitle}"`, pageWidth / 2, 107, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    const line2 = `com carga horária oficial de ${hours} horas/aula, cumprindo integralmente todas as videoaulas práticas,`;
    const line3 = `o plano de estudos teóricos e obtendo média superior a 7,0 nos questionários de avaliação contínua.`;
    doc.text(line1 ? line2 : '', pageWidth / 2, 117, { align: 'center' });
    doc.text(line3, pageWidth / 2, 124, { align: 'center' });

    // City & Date
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Emitido em ${date} • Registro no Sistema Acadêmico CETEP`, pageWidth / 2, 142, { align: 'center' });

    // Signatures
    const sigY = 168;
    // Left signature - Coordenação
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.5);
    doc.line(45, sigY, 115, sigY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('Coordenação Pedagógica', 80, sigY + 5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('CETEP Ensino Profissional', 80, sigY + 9, { align: 'center' });

    // Right signature - Direção
    doc.line(pageWidth - 115, sigY, pageWidth - 45, sigY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('Diretoria Acadêmica', pageWidth - 80, sigY + 5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Certificação Digital Eletrônica', pageWidth - 80, sigY + 9, { align: 'center' });

    // Authenticity badge at the bottom
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Autenticidade: ${authCode} • Válido em todo o território nacional para horas complementares.`, pageWidth / 2, pageHeight - 17, { align: 'center' });

    // Save PDF
    const safeName = studentName.trim().replace(/\s+/g, '_') || 'Estudante';
    doc.save(`Certificado_CETEP_${safeName}_${courseTitle.replace(/\s+/g, '_')}.pdf`);
    toast.success('Certificado Digital Oficial emitido com sucesso!');
    return true;
  } catch (err) {
    console.error('Erro ao gerar certificado:', err);
    toast.error('Não foi possível gerar o certificado.');
    return false;
  }
};
