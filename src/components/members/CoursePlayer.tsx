// ==============================================================================
// MARTMARKET FULL-FEATURED LMS COURSE PLAYER
// Enterprise LMS with Dynamic DRM Watermarking, AI Student Tutor,
// Interactive Module Quizzes, Discussion Forum, and Certificate Generator.
// ==============================================================================

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Play, 
  Download, 
  FileText, 
  Award, 
  Sparkles, 
  ChevronRight,
  Printer,
  Shield,
  MessageSquare,
  Bot,
  HelpCircle,
  ExternalLink,
  Users
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { LessonDiscussion } from './LessonDiscussion';
import { DynamicWatermark } from './DynamicWatermark';
import { AIStudentTutor } from './AIStudentTutor';
import { ModuleQuizModal } from './ModuleQuizModal';
import { CourseCommunityFeed } from './CourseCommunityFeed';

interface CoursePlayerProps {
  productId: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  productId,
  onNavigate
}) => {
  const { products, toggleLessonCompleted, isLessonCompleted, getCourseProgressPercent } = useMarketplace();
  const { t } = useI18n();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const product = products.find((p) => p.id === productId);
  const course = product?.course;

  const currentUserId = user?.id || 'usr-creator-1';

  // First lesson as default
  const defaultLesson = course?.modules[0]?.lessons[0];
  const [activeLesson, setActiveLesson] = useState(defaultLesson);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  
  // Tab control: 'discussion' | 'tutor' | 'community'
  const [activeTab, setActiveTab] = useState<'discussion' | 'tutor' | 'community'>('discussion');

  // Quiz Modal State
  const [activeQuizModule, setActiveQuizModule] = useState<string | null>(null);

  if (!product || !course) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-100">Curso não encontrado.</h2>
        <Button variant="outline" size="sm" onClick={() => onNavigate('members')} className="mt-4">
          Voltar à Biblioteca
        </Button>
      </div>
    );
  }

  const progressPercent = getCourseProgressPercent(currentUserId, course.id);
  const isCurrentLessonDone = activeLesson ? isLessonCompleted(currentUserId, activeLesson.id) : false;

  const handleToggleCurrentLesson = () => {
    if (!activeLesson) return;
    toggleLessonCompleted(currentUserId, activeLesson.id);

    const nowCompleted = !isCurrentLessonDone;
    if (nowCompleted) {
      showToast('success', 'Aula concluída!');
      // Check if finished entire course
      if (progressPercent >= 80) {
        confetti({ particleCount: 70, spread: 60 });
      }
    }
  };

  const activeModule = course.modules.find(m => m.lessons.some(l => l.id === activeLesson?.id)) || course.modules[0];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Navigation Bar */}
      <div className="w-full bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => onNavigate('members')}
            className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-slate-100 truncate">{product.title}</h2>
            <span className="text-[11px] text-slate-400 truncate block">Instrutor: {product.creatorName}</span>
          </div>
        </div>

        {/* Progress Badge, DRM Shield and Certificate Button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono">
            <Shield className="w-3 h-3" />
            <span>DRM Protegido</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Progresso:</span>
            <span className="font-bold text-emerald-400">{progressPercent}%</span>
          </div>

          {progressPercent === 100 && (
            <Button
              variant="success"
              size="sm"
              onClick={() => setIsCertificateModalOpen(true)}
              leftIcon={<Award className="w-3.5 h-3.5" />}
              className="animate-bounce"
            >
              Ver Certificado
            </Button>
          )}
        </div>
      </div>

      {/* Main LMS Layout: Left Player (8 cols) + Right Curriculum Sidebar (4 cols) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left: Video Player & Lesson Notes & Tabs */}
        <div className="lg:col-span-8 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          
          {/* Video Container with Dynamic Anti-Piracy Watermark and context protection */}
          <div 
            className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl aspect-video relative select-none"
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Dynamic Watermark floating on video */}
            <DynamicWatermark
              studentName={user ? user.fullName : 'Kelson Manuel'}
              studentEmail={user ? user.email : 'aluno@martmarket.com'}
              studentIp="102.214.88.19 (Luanda, AO)"
            />

            {activeLesson?.videoUrl ? (
              <video
                key={activeLesson.id}
                src={activeLesson.videoUrl}
                controls
                controlsList="nodownload"
                autoPlay
                className="w-full h-full object-contain bg-black pointer-events-auto"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                <Play className="w-12 h-12 mb-2" />
                <span>Selecione uma aula na barra lateral para reproduzir.</span>
              </div>
            )}
          </div>

          {/* Lesson Header & Complete Action */}
          {activeLesson && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <Badge variant="primary" size="sm" className="mb-2">
                    Aula Atual
                  </Badge>
                  <h1 className="text-xl font-bold text-white">{activeLesson.title}</h1>
                  <span className="text-xs text-slate-400 font-mono">
                    Duração: {Math.floor(activeLesson.durationSeconds / 60)} minutos • Módulo: {activeModule?.title}
                  </span>
                </div>

                <Button
                  variant={isCurrentLessonDone ? 'success' : 'primary'}
                  size="md"
                  onClick={handleToggleCurrentLesson}
                  leftIcon={
                    isCurrentLessonDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )
                  }
                >
                  {isCurrentLessonDone ? t('completed') : t('markAsCompleted')}
                </Button>
              </div>

              {/* Lesson Description */}
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
                <h4 className="font-bold text-slate-200">Resumo da Aula</h4>
                <p>{activeLesson.description || 'Assista a esta videoaula prática e acompanhe os códigos e materiais anexos.'}</p>
              </div>

              {/* Lesson Attachment (if present) */}
              {activeLesson.attachmentUrl && (
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center gap-2.5 text-xs">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium text-slate-200">{activeLesson.attachmentName || 'Material_Complementar.pdf'}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(activeLesson.attachmentUrl, '_blank')}
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                  >
                    Descarregar
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Interactive Player Tab Bar: Community Q&A vs AI Student Tutor */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('discussion')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'discussion'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Fórum da Aula & Dúvidas</span>
              </button>

              <button
                onClick={() => setActiveTab('tutor')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'tutor'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-purple-300 hover:bg-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span>Tutor de IA (LMS Copilot)</span>
              </button>

              <button
                onClick={() => setActiveTab('community')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'community'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-900'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-300" />
                <span>Comunidade & Feed da Turma</span>
              </button>
            </div>

            {/* Tab 1: Discussion Forum */}
            {activeTab === 'discussion' && activeLesson && (
              <LessonDiscussion
                lessonId={activeLesson.id}
                lessonTitle={activeLesson.title}
              />
            )}

            {/* Tab 2: AI Student Tutor */}
            {activeTab === 'tutor' && activeLesson && (
              <AIStudentTutor
                lessonTitle={activeLesson.title}
                moduleTitle={activeModule?.title || 'Módulo Geral'}
              />
            )}

            {/* Tab 3: Community Social Feed */}
            {activeTab === 'community' && (
              <CourseCommunityFeed
                courseTitle={product.title}
              />
            )}
          </div>

        </div>

        {/* Right: Modules & Lessons Navigator Sidebar */}
        <div className="lg:col-span-4 bg-slate-900/60 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-slate-100">Grade Curricular</h3>
            <span className="text-xs text-slate-400 font-mono">
              {course.modules.length} Módulos
            </span>
          </div>

          <div className="space-y-4">
            {course.modules.map((module) => (
              <div key={module.id} className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="p-3.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-200 truncate pr-2">
                    {module.title}
                  </span>
                  
                  {/* Module Quiz Trigger */}
                  <button
                    onClick={() => setActiveQuizModule(module.title)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 px-2 py-0.5 rounded-full transition-colors shrink-0 cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>Quiz</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-800/50">
                  {module.lessons.map((lesson) => {
                    const isDone = isLessonCompleted(currentUserId, lesson.id);
                    const isSelected = activeLesson?.id === lesson.id;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full flex items-center justify-between p-3 text-left transition-colors cursor-pointer text-xs ${
                          isSelected
                            ? 'bg-blue-600/20 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">
                          {Math.floor(lesson.durationSeconds / 60)}m
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {activeQuizModule && (
        <ModuleQuizModal
          moduleTitle={activeQuizModule}
          onClose={() => setActiveQuizModule(null)}
          onPassed={() => {
            showToast('success', `Parabéns! Módulo "${activeQuizModule}" avaliado com sucesso!`);
            confetti({ particleCount: 50, spread: 50 });
          }}
        />
      )}

      {/* Certificate Modal */}
      <Modal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        title="Certificado de Conclusão Oficial"
        maxWidth="3xl"
      >
        <div className="p-8 bg-slate-950 rounded-3xl border-2 border-amber-500/40 text-center space-y-6 text-slate-100 relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-bold">
              CERTIFICADO DE RECONHECIMENTO & CONCLUSÃO
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {user ? user.fullName : 'Aluno MartMarket'}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Concluiu com aproveitamento integral a formação <strong>"{product.title}"</strong>, totalizando a carga horária estabelecida pelo instrutor <strong>{product.creatorName}</strong>.
          </p>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>Autenticação: MM-CERT-{product.id.slice(0, 8).toUpperCase()}-{Date.now().toString().slice(-4)}</span>
            <span>Data: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('verify-cert')}
            leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Auditar no Validador Público
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Imprimir / Guardar em PDF
          </Button>
        </div>
      </Modal>
    </div>
  );
};
