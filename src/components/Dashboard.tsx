import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { User } from '../types';
import DailyClassesBoard from './DailyClassesBoard';
import { downloadBoletimPDF } from '../lib/pdfUtils';
import { getCompletedLessonIds } from '../data/excelCourseData';

interface DashboardProps {
  user: User | null;
  allUsers: User[];
}

export default function Dashboard({ user }: DashboardProps) {
  if (!user) return null;

  const displayName = (user.name || user.email || 'Estudante').trim().split(' ')[0] || 'Estudante';
  const displayAvatar = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email || 'user')}`;

  const isTeacher = user.role === 'teacher';
  const completedLessons = getCompletedLessonIds().length;

  // Calculate real average from user.subjectGrades if student has real grades
  const gradesList: number[] = [];
  if (user.subjectGrades) {
    Object.values(user.subjectGrades).forEach((g: any) => {
      const vals = [g?.n1, g?.n2, g?.n3].filter((v: any) => v && v !== '-' && !isNaN(Number(v))).map(Number);
      if (vals.length > 0) {
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        gradesList.push(avg);
      }
    });
  }
  const realGPA = gradesList.length > 0
    ? (gradesList.reduce((a, b) => a + b, 0) / gradesList.length).toFixed(1)
    : null;

  const handleDownloadBoletim = () => {
    try {
      toast.info('Gerando Boletim Acadêmico Oficial em PDF...');
      downloadBoletimPDF(user);
      toast.success('Boletim baixado com sucesso!');
    } catch {
      toast.error('Erro ao gerar o arquivo PDF do boletim.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  };

  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const academicModules = isTeacher ? [
    {
      title: 'Secretaria & Lançamento de Notas',
      category: 'Gestão Pedagógica',
      description: 'Lançamento de notas bimestrais, frequências escolares e aprovação de novos cadastros de alunos.',
      link: '/teachers',
      badge: 'Painel Docente',
      btnText: 'Acessar Secretaria'
    },
    {
      title: 'Sala de Aula Virtual',
      category: 'Ambiente de Estudo',
      description: 'Acompanhe as salas de aula, envie materiais e consulte comunicados da instituição.',
      link: '/classroom',
      badge: 'Ativo',
      btnText: 'Entrar na Sala'
    },
    {
      title: 'Cursos Extras',
      category: 'Capacitação Técnica',
      description: 'Cursos de capacitação prática como Excel e Lógica de Programação para formação contínua.',
      link: '/extra-courses',
      badge: `${completedLessons}/20 Aulas`,
      btnText: 'Acessar Cursos'
    },
    {
      title: 'Estágios MEC',
      category: 'Oportunidades & Convênios',
      description: 'Informações e portal oficial do Ministério da Educação para convênios e estágios técnicos.',
      link: '/internships',
      badge: 'MEC Oficial',
      btnText: 'Acessar Portal MEC'
    },
    {
      title: 'Central de Atendimento & Coordenação',
      category: 'Comunicação Escolar',
      description: 'Canal de atendimento da secretaria escolar para esclarecimento de dúvidas e solicitações.',
      link: '/contact',
      badge: 'Atendimento',
      btnText: 'Falar com a Escola'
    },
    {
      title: 'Jornal CETEP',
      category: 'Comunicação Escolar',
      description: 'Notícias institucionais, eventos pedagógicos e avisos do campus escolar.',
      link: '/journal',
      badge: 'Edição Vigente',
      btnText: 'Ler Notícias'
    }
  ] : [
    {
      title: 'Sala de Aula Virtual',
      category: 'Ambiente de Estudo',
      description: 'Acompanhe as aulas, materiais didáticos e comunicados oficiais dos professores em tempo real.',
      link: '/classroom',
      badge: 'Ativo',
      btnText: 'Entrar na Sala'
    },
    {
      title: 'Cursos Extras: Excel & Lógica',
      category: 'Capacitação Técnica',
      description: 'Cursos com aulas práticas, resumos teóricos e questionários para enriquecer seu currículo.',
      link: '/extra-courses',
      badge: `${completedLessons}/20 Aulas`,
      btnText: 'Acessar Cursos'
    },
    {
      title: 'Estágios MEC',
      category: 'Oportunidades & Convênios',
      description: 'Orientações oficiais do Ministério da Educação (MEC) para estágios curriculares.',
      link: '/internships',
      badge: 'Portal MEC',
      btnText: 'Ver Estágios MEC'
    },
    {
      title: 'Boletim & Histórico',
      category: 'Notas e Frequência',
      description: 'Consulte notas por disciplina, cálculo de médias e emita seu boletim oficial em PDF.',
      link: '/boletim',
      badge: realGPA ? `Média ${realGPA}` : 'Consultar',
      btnText: 'Consultar Notas'
    },
    {
      title: 'Central de Atendimento & Secretaria',
      category: 'Apoio ao Estudante',
      description: 'Canal direto para envio de dúvidas, solicitações de documentos e contato com a coordenação.',
      link: '/contact',
      badge: 'Secretaria',
      btnText: 'Falar com a Escola'
    },
    {
      title: 'Jornal CETEP',
      category: 'Comunicação Escolar',
      description: 'Notícias do colégio, feiras de ciências e avisos importantes da instituição.',
      link: '/journal',
      badge: 'Atualizado',
      btnText: 'Ler Notícias'
    }
  ];

  const upcomingDeadlines = [
    { title: 'Simulado Técnico Geral', date: '22 de Setembro', tag: 'Avaliação' },
    { title: 'Entrega de Relatórios de Estágio', date: '30 de Setembro', tag: 'Prazo' },
    { title: 'Feira de Ciência e Tecnologia CETEP', date: '15 de Outubro', tag: 'Evento' }
  ];

  const recentNotices = [
    {
      author: 'Coordenação Pedagógica',
      title: 'Horários de Atendimento e Monitoria para o 3º Bimestre',
      time: 'Publicado ontem',
      desc: 'Plantões de monitoria acadêmica disponíveis no laboratório de informática 02.'
    },
    {
      author: 'Secretaria Escolar',
      title: 'Emissão de Boletins e Declarações de Matrícula Atualizadas',
      time: 'Publicado há 3 dias',
      desc: 'Documentos digitais com assinatura eletrônica disponíveis diretamente na aba Boletim.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 px-4 sm:px-6 font-sans transition-colors duration-200">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        
        {/* Header Banner */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors"
        >
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
              <img src={displayAvatar} alt="Perfil" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  {isTeacher ? 'Corpo Docente • Gestão' : user.matricula ? `Matrícula: ${user.matricula}` : 'Estudante Regular'}
                </span>
                {user.matricula && !isTeacher && (
                  <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-md text-[10px] font-mono font-bold">
                    Nº {user.matricula}
                  </span>
                )}
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {isTeacher ? 'Direção & Docência' : `${user.grade || '1º Ano'} • ${user.course || 'Curso Técnico'}`}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Olá, {displayName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {isTeacher 
                  ? 'Painel do professor. Gerencie aulas do dia, secretaria acadêmica e comunicados.'
                  : 'Painel do estudante. Acompanhe suas aulas, notas e comunicados escolares.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {isTeacher ? (
              <Link
                to="/teachers"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Secretaria & Notas
              </Link>
            ) : (
              <button
                onClick={handleDownloadBoletim}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Baixar Boletim (PDF)
              </button>
            )}
            <Link
              to="/classroom"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Ir para Sala de Aula
            </Link>
          </div>
        </motion.div>

        {/* 4 Academic KPI Cards - Pure typography, no decorative icons */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              {isTeacher ? 'Perfil de Acesso' : 'Média Geral'}
            </p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {isTeacher ? 'Docente' : (realGPA || '—')}
            </h3>
            <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold rounded">
              {isTeacher ? 'Gestão / Professor' : (realGPA ? 'Desempenho apurado' : 'Aguardando notas')}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              {isTeacher ? 'Ano Letivo' : 'Frequência Escolar'}
            </p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {isTeacher ? '2026' : `${user.frequencia || 100}%`}
            </h3>
            <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold rounded">
              {isTeacher ? 'Em andamento' : 'Regularidade plena'}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Curso de Excel</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{completedLessons} / 20</h3>
            <span className="inline-block mt-2 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[11px] font-bold rounded">
              {Math.round((completedLessons / 20) * 100)}% concluído
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              {isTeacher ? 'Unidade de Ensino' : 'Situação Acadêmica'}
            </p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {isTeacher ? 'CETEP Bacia do Rio Corrente' : 'Regular'}
            </h3>
            <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded">
              {isTeacher ? 'Bahia • SEC' : 'Ano Letivo 2026'}
            </span>
          </div>

        </motion.div>

        {/* Mural de Aulas de Hoje */}
        <DailyClassesBoard 
          currentUser={user} 
          filterForCourse={user.role === 'student' ? user.course : undefined} 
          filterForGrade={user.role === 'student' ? user.grade : undefined} 
        />

        {/* Academic Modules Grid - Clean, no icons */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Módulos Acadêmicos</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Acesso direto aos recursos e ambientes do portal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {academicModules.map((mod, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="group"
              >
                <Link
                  to={mod.link}
                  className="flex flex-col justify-between h-full p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-left"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                        {mod.category}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded">
                        {mod.badge}
                      </span>
                    </div>
                    
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                      {mod.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span>{mod.btnText}</span>
                    <span>&rarr;</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Notices & Academic Calendar Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          
          {/* Notices */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Mural de Avisos da Coordenação</h3>
              <Link to="/classroom" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Ver todos na Sala
              </Link>
            </div>

            <div className="space-y-3">
              {recentNotices.map((notice, nIdx) => (
                <div key={nIdx} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-400">
                      {notice.author}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400">{notice.time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white pt-0.5">{notice.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{notice.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Deadlines */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Prazos e Calendário</h3>

            <div className="space-y-3">
              {upcomingDeadlines.map((item, dIdx) => (
                <div key={dIdx} className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {item.tag}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">{item.title}</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
