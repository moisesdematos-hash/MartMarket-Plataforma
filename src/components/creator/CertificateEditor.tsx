// ==============================================================================
// MARTMARKET VISUAL CERTIFICATE EDITOR
// Drag-and-drop certificate template builder for creators.
// Live preview with student name injection, logo upload, signature,
// color palette, font selection and PDF export simulation.
// ==============================================================================

import React, { useState, useRef } from 'react';
import {
  Award, Palette, Type, Image, Download, Eye,
  RotateCcw, Check, Bold, AlignCenter, AlignLeft,
  Save, Sparkles, Upload
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useNotification } from '../../context/NotificationContext';

interface CertTemplate {
  bgColor: string;
  accentColor: string;
  textColor: string;
  fontFamily: string;
  title: string;
  subtitle: string;
  bodyText: string;
  footerText: string;
  showLogo: boolean;
  showSignature: boolean;
  showSeal: boolean;
  borderStyle: 'none' | 'simple' | 'double' | 'ornate';
}

const PRESETS: { name: string; template: Partial<CertTemplate> }[] = [
  { name: '🎓 Clássico',    template: { bgColor: '#fffef7', accentColor: '#1e40af', textColor: '#1e293b', fontFamily: 'Georgia, serif', borderStyle: 'double' } },
  { name: '🌟 Moderno',     template: { bgColor: '#0f172a', accentColor: '#6366f1', textColor: '#f1f5f9', fontFamily: 'Inter, sans-serif', borderStyle: 'simple' } },
  { name: '🏆 Elegante',    template: { bgColor: '#1c1009', accentColor: '#d97706', textColor: '#fef3c7', fontFamily: 'Playfair Display, serif', borderStyle: 'ornate' } },
  { name: '💼 Corporativo', template: { bgColor: '#f8fafc', accentColor: '#0f172a', textColor: '#0f172a', fontFamily: 'Arial, sans-serif', borderStyle: 'simple' } },
  { name: '🌿 Natural',     template: { bgColor: '#f0fdf4', accentColor: '#166534', textColor: '#14532d', fontFamily: 'Georgia, serif', borderStyle: 'none' } },
];

const FONTS = ['Georgia, serif', 'Inter, sans-serif', 'Arial, sans-serif', 'Playfair Display, serif', 'Courier New, monospace'];
const BORDER_STYLES = ['none', 'simple', 'double', 'ornate'] as const;

export const CertificateEditor: React.FC = () => {
  const { showToast } = useNotification();
  const previewRef = useRef<HTMLDivElement>(null);

  const [previewName] = useState('Edson Morais da Silva');
  const [previewDate] = useState(new Date().toLocaleDateString('pt-AO', { day: 'numeric', month: 'long', year: 'numeric' }));
  const [previewCourse] = useState('Masterclass Fullstack: De Zero a SaaS Escalável');

  const [template, setTemplate] = useState<CertTemplate>({
    bgColor: '#fffef7',
    accentColor: '#1e40af',
    textColor: '#1e293b',
    fontFamily: 'Georgia, serif',
    title: 'CERTIFICADO DE CONCLUSÃO',
    subtitle: 'Este certificado é apresentado a',
    bodyText: 'pelo cumprimento e aprovação de todas as avaliações do curso',
    footerText: 'MartMarket — Plataforma Internacional de Educação Digital',
    showLogo: true,
    showSignature: true,
    showSeal: true,
    borderStyle: 'double',
  });

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setTemplate(t => ({ ...t, ...preset.template }));
    showToast('success', `Tema "${preset.name}" aplicado!`);
  };

  const update = (key: keyof CertTemplate, value: any) => setTemplate(t => ({ ...t, [key]: value }));

  const getBorderStyle = () => {
    switch (template.borderStyle) {
      case 'simple': return `4px solid ${template.accentColor}`;
      case 'double': return `6px double ${template.accentColor}`;
      case 'ornate': return `3px solid ${template.accentColor}`;
      default: return 'none';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" size="sm" icon={<Award className="w-3.5 h-3.5" />}>
            Editor Visual de Certificados
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Personalize o Certificado do Curso</h2>
          <p className="text-xs text-slate-400">Crie um design único para os certificados dos seus alunos. Prévisualização em tempo real com nome do aluno injetado.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" leftIcon={<Eye className="w-4 h-4" />}
            onClick={() => showToast('info', 'Prévisualização em tamanho real aberta.')}>
            Tamanho Real
          </Button>
          <Button size="sm" leftIcon={<Save className="w-4 h-4" />}
            onClick={() => showToast('success', '✅ Template de certificado guardado! Será aplicado a todos os novos certificados do curso.')}>
            Guardar Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-2 space-y-5 overflow-y-auto" style={{ maxHeight: '700px' }}>

          {/* Presets */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-blue-400" />Temas Prontos</h3>
            <div className="grid grid-cols-1 gap-2">
              {PRESETS.map(p => (
                <button key={p.name} onClick={() => applyPreset(p)}
                  className="flex items-center gap-2 p-2.5 rounded-xl text-xs text-left border transition-colors cursor-pointer border-slate-700 hover:border-slate-600 hover:bg-slate-800"
                  style={{ background: p.template.bgColor ? `${p.template.bgColor}20` : undefined }}>
                  <div className="w-6 h-6 rounded-md border border-slate-600 shrink-0"
                    style={{ background: p.template.bgColor || '#fff', borderColor: p.template.accentColor }} />
                  <span className="text-slate-200 font-medium">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2"><Palette className="w-3.5 h-3.5 text-purple-400" />Cores</h3>
            {[
              { label: 'Fundo', key: 'bgColor' as const },
              { label: 'Destaque / Bordas', key: 'accentColor' as const },
              { label: 'Texto Principal', key: 'textColor' as const },
            ].map(c => (
              <div key={c.key} className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{c.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-mono">{(template[c.key] as string).toUpperCase()}</span>
                  <input type="color" value={template[c.key] as string} onChange={e => update(c.key, e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer bg-transparent p-0.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Typography */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2"><Type className="w-3.5 h-3.5 text-emerald-400" />Tipografia</h3>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Fonte</label>
              <select value={template.fontFamily} onChange={e => update('fontFamily', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 px-3 py-2">
                {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f.split(',')[0]}</option>)}
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2"><AlignCenter className="w-3.5 h-3.5 text-amber-400" />Conteúdo</h3>
            {[
              { label: 'Título Principal', key: 'title' as const },
              { label: 'Subtítulo', key: 'subtitle' as const },
              { label: 'Texto do Corpo', key: 'bodyText' as const },
              { label: 'Rodapé', key: 'footerText' as const },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[11px] text-slate-400 block mb-1">{f.label}</label>
                <input value={template[f.key] as string} onChange={e => update(f.key, e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 px-3 py-2" />
              </div>
            ))}
          </div>

          {/* Border & Elements */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200">Estilo da Borda</h3>
            <div className="grid grid-cols-4 gap-2">
              {BORDER_STYLES.map(bs => (
                <button key={bs} onClick={() => update('borderStyle', bs)}
                  className={`p-2 rounded-xl text-[10px] capitalize text-center cursor-pointer border transition-colors ${template.borderStyle === bs ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' : 'border-slate-700 text-slate-400 hover:text-white'}`}>
                  {bs === 'none' ? 'Sem' : bs === 'simple' ? 'Simples' : bs === 'double' ? 'Dupla' : 'Ornada'}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {[
                { label: 'Mostrar Logótipo', key: 'showLogo' as const },
                { label: 'Mostrar Assinatura', key: 'showSignature' as const },
                { label: 'Mostrar Selo/Carimbo', key: 'showSeal' as const },
              ].map(opt => (
                <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => update(opt.key, !template[opt.key])}
                    className={`w-8 h-4.5 rounded-full transition-colors cursor-pointer relative border ${template[opt.key] ? 'bg-blue-600 border-blue-500' : 'bg-slate-700 border-slate-600'}`}
                    style={{ height: '18px', width: '32px' }}>
                    <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform shadow ${template[opt.key] ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-xs text-slate-300">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-3">
          <div className="sticky top-4">
            <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-2">
              <Eye className="w-3 h-3" /> Prévisualização em tempo real — Nome: <span className="text-white font-medium">{previewName}</span>
            </div>

            {/* Certificate Preview */}
            <div ref={previewRef}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: template.bgColor,
                border: getBorderStyle(),
                padding: '32px',
                fontFamily: template.fontFamily,
                aspectRatio: '1.414 / 1', // A4 landscape ratio
              }}>

              {/* Ornate border inner */}
              {template.borderStyle === 'ornate' && (
                <div className="absolute inset-3 border-2 rounded-xl pointer-events-none"
                  style={{ borderColor: template.accentColor, opacity: 0.4 }} />
              )}

              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                {/* Logo */}
                {template.showLogo && (
                  <div className="mb-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg" style={{ background: `${template.accentColor}20` }}>
                      <Award className="w-4 h-4" style={{ color: template.accentColor }} />
                      <span className="text-sm font-black" style={{ color: template.accentColor }}>MartMarket</span>
                    </div>
                  </div>
                )}

                {/* Title */}
                <div>
                  <h1 className="text-xl font-black tracking-[0.2em] uppercase" style={{ color: template.accentColor }}>
                    {template.title}
                  </h1>
                  <div className="w-16 h-0.5 mx-auto mt-2 rounded-full" style={{ background: template.accentColor }} />
                </div>

                {/* Subtitle */}
                <p className="text-xs" style={{ color: template.textColor, opacity: 0.7 }}>{template.subtitle}</p>

                {/* Student Name */}
                <h2 className="text-2xl font-black" style={{ color: template.textColor, fontStyle: 'italic' }}>
                  {previewName}
                </h2>

                {/* Body */}
                <p className="text-xs max-w-xs leading-relaxed" style={{ color: template.textColor, opacity: 0.8 }}>
                  {template.bodyText}
                </p>

                {/* Course Name */}
                <div className="px-4 py-2 rounded-lg border" style={{ borderColor: template.accentColor, background: `${template.accentColor}10` }}>
                  <span className="text-xs font-bold" style={{ color: template.accentColor }}>{previewCourse}</span>
                </div>

                {/* Date */}
                <p className="text-[10px]" style={{ color: template.textColor, opacity: 0.6 }}>
                  Luanda, Angola — {previewDate}
                </p>

                {/* Signature + Seal */}
                <div className="flex items-end gap-8 pt-2">
                  {template.showSignature && (
                    <div className="text-center">
                      <div className="w-24 border-t" style={{ borderColor: template.textColor, opacity: 0.5 }} />
                      <p className="text-[9px] mt-0.5" style={{ color: template.textColor, opacity: 0.5 }}>Assinatura do Criador</p>
                    </div>
                  )}
                  {template.showSeal && (
                    <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: template.accentColor, color: template.accentColor }}>
                      <Award className="w-5 h-5" />
                    </div>
                  )}
                  {template.showSignature && (
                    <div className="text-center">
                      <div className="w-24 border-t" style={{ borderColor: template.textColor, opacity: 0.5 }} />
                      <p className="text-[9px] mt-0.5" style={{ color: template.textColor, opacity: 0.5 }}>Diretor MartMarket</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <p className="text-[9px] absolute bottom-4" style={{ color: template.textColor, opacity: 0.4 }}>
                  {template.footerText}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" leftIcon={<Download className="w-4 h-4" />} className="flex-1"
                onClick={() => showToast('success', 'Template exportado como imagem PNG.')}>
                Exportar PNG
              </Button>
              <Button size="sm" variant="outline" leftIcon={<RotateCcw className="w-4 h-4" />}
                onClick={() => applyPreset(PRESETS[0])}>
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
