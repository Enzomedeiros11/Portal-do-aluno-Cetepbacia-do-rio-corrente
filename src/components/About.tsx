import { motion } from 'motion/react';
import { Shield, Target, Eye, Users, Award, BookOpen, MapPin, Phone, Mail } from 'lucide-react';
import Logo from './Logo';

export default function About() {
  const values = [
    { icon: Target, title: 'Missão', desc: 'Promover educação profissional integrada ao trabalho, ciência e tecnologia, visando o desenvolvimento humano.' },
    { icon: Eye, title: 'Visão', desc: 'Ser referência na Bacia do Rio Corrente em excelência educacional e formação técnica de qualidade.' },
    { icon: Shield, title: 'Valores', desc: 'Ética, compromisso social, inovação e sustentabilidade em todas as nossas ações educativas.' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Hero Section */}
        <section className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-indigo-100 p-2 shadow-xl shadow-indigo-600/5"
          >
            <Logo className="w-full h-full" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-medium text-slate-900 mb-6"
          >
            Nossa História e <span className="italic text-indigo-600">Compromisso</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed"
          >
            O Centro Territorial de Educação Profissional Bacia do Rio Corrente (CETEP) é mais que uma escola; é um celeiro de talentos e oportunidades.
          </motion.p>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-serif font-medium text-slate-900 leading-tight">Excelência no Coração da <span className="text-indigo-600">Bacia do Rio Corrente</span></h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Fundado para atender à demanda crescente por mão de obra qualificada em Santa Maria da Vitória e cidades circunvizinhas, o CETEP tem se destacado por oferecer cursos alinhados com a realidade econômica local.
              </p>
              <p>
                Nossa infraestrutura conta com laboratórios de informática, nutrição, agropecuária e administração, permitindo que o aluno aprenda na prática as competências necessárias para o mercado de trabalho moderno.
              </p>
            </div>
            <div className="flex gap-12 pt-4">
              <div>
                <span className="block text-4xl font-black text-indigo-900">15+</span>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Anos de História</span>
              </div>
              <div>
                <span className="block text-4xl font-black text-indigo-900">2000+</span>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Alunos Formados</span>
              </div>
              <div>
                <span className="block text-4xl font-black text-indigo-900">10+</span>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Cursos Técnicos</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square bg-indigo-50 rounded-[80px] overflow-hidden relative border-[16px] border-white shadow-2xl">
              <img 
                src="https://picsum.photos/seed/school/800/800" 
                alt="Instalações CETEP" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-indigo-900/10 mix-blend-multiply" />
            </div>
            {/* Decors */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white z-10 animate-bounce">
               <Award className="text-white w-16 h-16" />
            </div>
          </motion.div>
        </div>

        {/* Mission/Vision/Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
           {values.map((v, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="bg-gray-50 p-10 rounded-[48px] border border-transparent hover:border-indigo-100 hover:bg-white transition-all group"
             >
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <v.icon className="w-8 h-8 text-indigo-600 group-hover:text-white" />
               </div>
               <h3 className="text-2xl font-serif font-medium mb-4">{v.title}</h3>
               <p className="text-gray-500 leading-relaxed italic">{v.desc}</p>
             </motion.div>
           ))}
        </div>

        {/* Contact Info Footer */}
        <section className="bg-indigo-950 p-16 rounded-[60px] text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-md">
                 <h2 className="text-3xl font-serif mb-6">Estamos em <br/><span className="italic text-indigo-400">Santa Maria da Vitória</span></h2>
                 <p className="text-white/60 leading-relaxed mb-8">Venha nos visitar e conhecer nossa estrutura de perto. Estamos prontos para te receber.</p>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm font-medium">
                       <MapPin className="text-indigo-400 w-5 h-5" /> Rua das Acácias, S/N - Centro
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium">
                       <Phone className="text-indigo-400 w-5 h-5" /> (77) 3483-XXXX
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium">
                       <Mail className="text-indigo-400 w-5 h-5" /> cetep.bacia@educacao.ba.gov.br
                    </div>
                 </div>
              </div>
              <div className="w-full md:w-1/2 aspect-video bg-white/5 rounded-[40px] border border-white/10 overflow-hidden">
                 <img 
                   src="https://picsum.photos/seed/location/1000/600" 
                   alt="Mapa/Fachada" 
                   className="w-full h-full object-cover opacity-60"
                   referrerPolicy="no-referrer"
                 />
              </div>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
        </section>
      </div>
    </div>
  );
}
