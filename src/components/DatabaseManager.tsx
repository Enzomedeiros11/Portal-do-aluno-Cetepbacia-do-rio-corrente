import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  RefreshCw, 
  Download, 
  Code, 
  Table as TableIcon, 
  Check, 
  X, 
  AlertTriangle, 
  Server, 
  Layers, 
  FileText, 
  ShieldCheck, 
  Key, 
  Copy,
  ExternalLink
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  addDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import { toast } from 'sonner';

interface DatabaseManagerProps {
  onRefreshAll?: () => Promise<void>;
}

export default function DatabaseManager({ onRefreshAll }: DatabaseManagerProps) {
  const [activeCollection, setActiveCollection] = useState<string>('usuarios');
  const [customCollectionName, setCustomCollectionName] = useState<string>('');
  const [documents, setDocuments] = useState<Array<{ id: string; [key: string]: any }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');

  // Modals
  const [isAddDocOpen, setIsAddDocOpen] = useState<boolean>(false);
  const [isEditDocOpen, setIsEditDocOpen] = useState<boolean>(false);
  const [docToDelete, setDocToDelete] = useState<{ id: string } | null>(null);

  // Document Forms
  const [newDocId, setNewDocId] = useState<string>('');
  const [newDocJson, setNewDocJson] = useState<string>('{\n  "nome": "Novo Registro",\n  "status": "Ativo"\n}');
  
  const [editingDocId, setEditingDocId] = useState<string>('');
  const [editingDocJson, setEditingDocJson] = useState<string>('');

  const availableCollections = ['usuarios', 'mensagens', 'turmas', 'atividades', 'configuracoes'];

  // Subscribe to active collection in real-time
  useEffect(() => {
    setLoading(true);
    const colRef = collection(db, activeCollection);
    
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const docsData: Array<{ id: string; [key: string]: any }> = [];
      snapshot.forEach((d) => {
        docsData.push({ id: d.id, ...d.data() });
      });
      setDocuments(docsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, activeCollection);
      setLoading(false);
      toast.error(`Erro ao carregar coleção ${activeCollection}: ${error.message}`);
    });

    return () => unsubscribe();
  }, [activeCollection]);

  // Handle Add Document
  const handleCreateDocument = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(newDocJson);
      
      if (newDocId.trim()) {
        const docRef = doc(db, activeCollection, newDocId.trim());
        await setDoc(docRef, { ...parsedData, updatedAt: new Date().toISOString() });
      } else {
        await addDoc(collection(db, activeCollection), { ...parsedData, updatedAt: new Date().toISOString() });
      }

      toast.success(`Documento salvo na coleção '${activeCollection}'!`);
      setIsAddDocOpen(false);
      setNewDocId('');
      setNewDocJson('{\n  "nome": "Novo Registro",\n  "status": "Ativo"\n}');
      if (onRefreshAll) await onRefreshAll();
    } catch (err) {
      if (err instanceof SyntaxError) {
        toast.error('JSON inválido. Verifique a sintaxe.');
      } else {
        toast.error('Erro ao criar documento.');
      }
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (docItem: { id: string; [key: string]: any }) => {
    const { id, ...dataWithoutId } = docItem;
    setEditingDocId(id);
    setEditingDocJson(JSON.stringify(dataWithoutId, null, 2));
    setIsEditDocOpen(true);
  };

  // Save Edit Document
  const handleSaveEditDocument = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(editingDocJson);
      const docRef = doc(db, activeCollection, editingDocId);
      await setDoc(docRef, { ...parsedData, updatedAt: new Date().toISOString() }, { merge: true });

      toast.success(`Documento '${editingDocId}' atualizado!`);
      setIsEditDocOpen(false);
      if (onRefreshAll) await onRefreshAll();
    } catch (err) {
      if (err instanceof SyntaxError) {
        toast.error('JSON inválido. Corrija a formatação.');
      } else {
        toast.error('Erro ao atualizar documento.');
      }
    }
  };

  // Delete Document
  const handleDeleteDocument = async () => {
    if (!docToDelete) return;
    try {
      await deleteDoc(doc(db, activeCollection, docToDelete.id));
      toast.success(`Documento '${docToDelete.id}' excluído do Firebase!`);
      setDocToDelete(null);
      if (onRefreshAll) await onRefreshAll();
    } catch (err) {
      toast.error('Erro ao excluir documento.');
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(documents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `firebase_${activeCollection}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success(`Backup da coleção '${activeCollection}' baixado!`);
  };

  // Filter Documents
  const filteredDocs = documents.filter(d => {
    if (!searchTerm) return true;
    const str = JSON.stringify(d).toLowerCase();
    return str.includes(searchTerm.toLowerCase());
  });

  // Extract all keys dynamically for the table header
  const allKeys: string[] = Array.from(
    new Set(documents.flatMap(d => Object.keys(d)))
  ).filter((k): k is string => typeof k === 'string' && k !== 'id');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700/80 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center border border-amber-500/30 shadow-lg">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white">Controle Total do Banco de Dados</h1>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full uppercase">
                  Firebase Relacional Ativo
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Visualização, inserção, edição e gerenciamento em tempo real do Cloud Firestore.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsAddDocOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Documento</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-600"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Exportar JSON</span>
            </button>
          </div>
        </div>

        {/* Database Config Info Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Projeto Firebase</p>
              <p className="text-sm font-bold text-slate-200 font-mono truncate max-w-[180px]">{firebaseConfig.projectId}</p>
            </div>
            <Server className="w-5 h-5 text-blue-400 opacity-60" />
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">ID da Base de Dados</p>
              <p className="text-xs font-bold text-amber-400 font-mono truncate max-w-[180px]">
                {firebaseConfig.firestoreDatabaseId.slice(0, 20)}...
              </p>
            </div>
            <Key className="w-5 h-5 text-amber-400 opacity-60" />
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Coleção Selecionada</p>
              <p className="text-sm font-bold text-emerald-400 font-mono">{activeCollection}</p>
            </div>
            <Layers className="w-5 h-5 text-emerald-400 opacity-60" />
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total de Documentos</p>
              <p className="text-sm font-bold text-white font-mono">{documents.length}</p>
            </div>
            <FileText className="w-5 h-5 text-indigo-400 opacity-60" />
          </div>
        </div>

        {/* Collection Selector & Search Toolbar */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            {/* Collections Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0">
              <span className="text-xs font-bold uppercase text-slate-400 mr-2 shrink-0">Coleções:</span>
              {availableCollections.map(col => (
                <button
                  key={col}
                  onClick={() => setActiveCollection(col)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    activeCollection === col 
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20' 
                      : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>

            {/* Custom Collection Creator */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Criar/abrir coleção..."
                value={customCollectionName}
                onChange={(e) => setCustomCollectionName(e.target.value)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
              />
              <button
                onClick={() => {
                  if (customCollectionName.trim()) {
                    setActiveCollection(customCollectionName.trim().toLowerCase());
                    setCustomCollectionName('');
                  }
                }}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold"
              >
                Abrir
              </button>
            </div>
          </div>

          {/* Search and View Mode Controls */}
          <div className="pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar nos campos do banco..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Tabela</span>
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'json' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Raw JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Display */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mb-3" />
            <p className="text-sm font-medium">Carregando dados da coleção '{activeCollection}'...</p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/90 border-b border-slate-700 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="px-4 py-3 min-w-[120px]">Document ID</th>
                    {allKeys.slice(0, 6).map(key => (
                      <th key={key} className="px-4 py-3 min-w-[140px]">{key}</th>
                    ))}
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-200">
                  {filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={allKeys.length + 2} className="px-6 py-12 text-center text-slate-500">
                        Nenhum documento encontrado na coleção '{activeCollection}'.
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map(docItem => (
                      <tr key={docItem.id} className="hover:bg-slate-700/40 transition-colors font-mono">
                        <td className="px-4 py-3 text-amber-400 font-bold truncate max-w-[160px]">
                          {docItem.id}
                        </td>
                        {allKeys.slice(0, 6).map((key: string) => {
                          const val = (docItem as Record<string, any>)[key];
                          const displayVal = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '—');
                          return (
                            <td key={key} className="px-4 py-3 text-slate-300 truncate max-w-[200px]" title={displayVal}>
                              {displayVal}
                            </td>
                          );
                        })}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(docItem)}
                              className="p-1.5 bg-slate-700 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded-lg transition-all"
                              title="Editar Documento"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDocToDelete({ id: docItem.id })}
                              className="p-1.5 bg-slate-700 hover:bg-rose-500 hover:text-white text-slate-300 rounded-lg transition-all"
                              title="Excluir Documento"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* JSON Raw View */
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[600px]">
            <pre>{JSON.stringify(filteredDocs, null, 2)}</pre>
          </div>
        )}

      </div>

      {/* --- MODAL: NOVO DOCUMENTO --- */}
      <AnimatePresence>
        {isAddDocOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl max-w-lg w-full overflow-hidden text-slate-100"
            >
              <div className="p-5 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-bold">Novo Documento ({activeCollection})</h3>
                </div>
                <button onClick={() => setIsAddDocOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDocument} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Document ID (Opcional - deixe vazio para ID automático)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: user_123"
                    value={newDocId}
                    onChange={(e) => setNewDocId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-amber-400 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Dados do Documento (JSON)
                  </label>
                  <textarea
                    rows={8}
                    value={newDocJson}
                    onChange={(e) => setNewDocJson(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-emerald-400 outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddDocOpen(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20"
                  >
                    Salvar no Firebase
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL: EDITAR DOCUMENTO --- */}
      <AnimatePresence>
        {isEditDocOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl max-w-lg w-full overflow-hidden text-slate-100"
            >
              <div className="p-5 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold">Editar Documento [{editingDocId}]</h3>
                </div>
                <button onClick={() => setIsEditDocOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditDocument} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Conteúdo JSON
                  </label>
                  <textarea
                    rows={10}
                    value={editingDocJson}
                    onChange={(e) => setEditingDocJson(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-emerald-400 outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditDocOpen(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20"
                  >
                    Atualizar Documento
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL: CONFIRMAR EXCLUSÃO --- */}
      <AnimatePresence>
        {docToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-2xl max-w-md w-full text-center text-slate-100"
            >
              <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold mb-2">Remover do Firebase?</h3>
              <p className="text-xs text-slate-400 mb-6 font-mono">
                Tem certeza que deseja excluir permanentemente o documento <strong className="text-amber-400">{docToDelete.id}</strong> da coleção '{activeCollection}'?
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDocToDelete(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteDocument}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/20"
                >
                  Excluir Permanentemente
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
