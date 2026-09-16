// ==============================================================================
// MARTMARKET PIXELS & AD TRAFFIC MANAGER (META, GA4, TIKTOK)
// ==============================================================================

import React, { useState } from 'react';
import { Target, CheckCircle2, Save, Sparkles, Activity } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const PixelManager: React.FC = () => {
  const { showToast } = useNotification();

  const [metaPixelId, setMetaPixelId] = useState('184920491029482');
  const [ga4MeasurementId, setGa4MeasurementId] = useState('G-MM9201481');
  const [tiktokPixelId, setTiktokPixelId] = useState('');
  const [trackInitiateCheckout, setTrackInitiateCheckout] = useState(true);
  const [trackPurchase, setTrackPurchase] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Configurações de Pixels e Conversões salvas com sucesso!');
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl text-xs text-slate-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm" icon={<Target className="w-3.5 h-3.5" />}>
              Tracking & Tráfego Pago
            </Badge>
          </div>
          <h3 className="text-base font-bold text-slate-100 mt-1">
            Pixels de Rastreamento & API de Conversões
          </h3>
          <p className="text-slate-400 text-xs">
            Instale os seus identificadores para que o checkout envie eventos de compra automaticamente para as plataformas de anúncios.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Meta Pixel */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Meta Pixel (Facebook / Instagram Ads)</span>
              <Badge variant="primary" size="sm">Ativo</Badge>
            </div>
            <input
              type="text"
              placeholder="Ex: 184920491029482"
              value={metaPixelId}
              onChange={(e) => setMetaPixelId(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-500 block">Dispara eventos PageView, InitiateCheckout e Purchase com moeda AOA/USD.</span>
          </div>

          {/* Google Analytics 4 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Google Analytics 4 (Measurement ID)</span>
              <Badge variant="primary" size="sm">Ativo</Badge>
            </div>
            <input
              type="text"
              placeholder="Ex: G-XXXXXXXXXX"
              value={ga4MeasurementId}
              onChange={(e) => setGa4MeasurementId(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-500 block">Rastreia visualizações de página de vendas e checkout.</span>
          </div>

          {/* TikTok Pixel */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">TikTok Pixel ID</span>
              <Badge variant="neutral" size="sm">Opcional</Badge>
            </div>
            <input
              type="text"
              placeholder="Ex: C8XXXXXXXXXXXXX"
              value={tiktokPixelId}
              onChange={(e) => setTiktokPixelId(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-500 block">Otimiza campanhas de conversão no TikTok Ads.</span>
          </div>

          {/* Event settings */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="font-bold text-slate-200 block">Eventos Habilitados</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={trackInitiateCheckout}
                onChange={(e) => setTrackInitiateCheckout(e.target.checked)}
                className="accent-blue-500 w-4 h-4"
              />
              <span>Disparar <strong>InitiateCheckout</strong> no início do preenchimento</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={trackPurchase}
                onChange={(e) => setTrackPurchase(e.target.checked)}
                className="accent-blue-500 w-4 h-4"
              />
              <span>Disparar <strong>Purchase</strong> no ecrã de sucesso</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Guardar Configurações de Tracking
          </Button>
        </div>
      </form>
    </div>
  );
};
