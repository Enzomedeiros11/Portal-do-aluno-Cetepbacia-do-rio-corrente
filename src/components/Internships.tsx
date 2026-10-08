import React from 'react';
import { motion } from 'motion/react';
import { School, ExternalLink, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function Internships() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 pt-24 pb-20 px-4 sm:px-6 font-sans transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Oficial */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
            <School className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ministério da Educação • Governo Federal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Estágios Supervisionados MEC
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Consulte diretrizes oficiais, programas de estágio técnico e normas regulamentadas pelo Ministério da Educação (MEC) para estudantes do CETEP.
            </p>
          </div>

          {/* O Botão Principal para o Portal do MEC */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://www.gov.br/mec/pt-br"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-base shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span>Ir para a Página Oficial do MEC</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            Você será redirecionado para o portal governamental oficial (gov.br/mec).
          </p>
        </motion.div>

        {/* Informações da Coordenação de Estágio do CETEP */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
        >
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Coordenação Pedagógica de Estágios CETEP
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Para entrega de termos de compromisso, relatórios de estágio supervisionado ou dúvidas sobre convênios da escola com empresas locais, procure a coordenação pedagógica ou utilize os canais abaixo:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="font-medium text-slate-700 dark:text-slate-300">secretaria.cetep@ba.gov.br</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="font-medium text-slate-700 dark:text-slate-300">(77) 3481-2000</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Sala de Coordenação • Campus CETEP</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
