// ==============================================================================
// MARTMARKET NATIVE PODCAST PLAYER
// Embedded audio player for podcast-format courses in the members area.
// Playlist, speed control, chapter markers, offline caching indicator.
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Headphones, Download, Share2, Clock, ChevronDown,
  List, BookOpen, Wifi, WifiOff
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface PodcastEpisode {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: number; // seconds
  publishedAt: string;
  isPlayed: boolean;
  isCached: boolean;
  chapters: { time: number; label: string }[];
}

interface PodcastSeries {
  id: string;
  title: string;
  creator: string;
  coverImage: string;
  episodes: PodcastEpisode[];
}

export const PodcastPlayer: React.FC = () => {
  const [series] = useState<PodcastSeries>({
    id: 'pod-1',
    title: 'Negócios Digitais em Angola — Podcast',
    creator: 'Ana Cardoso',
    coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200&auto=format&fit=crop&q=80',
    episodes: [
      {
        id: 'ep-1', number: 12, title: 'Como vender cursos online em Angola sem Stripe',
        description: 'Neste episódio exploramos as alternativas de pagamento locais: Multicaixa Express, PayPay Angola e GPO Reference para infoprodutores.',
        duration: 2847, publishedAt: '2026-09-14', isPlayed: false, isCached: true,
        chapters: [
          { time: 0,    label: '🎙 Introdução' },
          { time: 180,  label: '💳 Multicaixa Express' },
          { time: 720,  label: '📱 PayPay Angola' },
          { time: 1200, label: '🏦 GPO Reference' },
          { time: 1800, label: '📊 Comparação de taxas' },
          { time: 2400, label: '🚀 Como configurar' },
        ]
      },
      {
        id: 'ep-2', number: 11, title: 'Marketing de afiliados: construa uma rede em Angola',
        description: 'Estratégias para recrutar e gerir afiliados no mercado angolano.',
        duration: 3124, publishedAt: '2026-09-07', isPlayed: true, isCached: false,
        chapters: [
          { time: 0,    label: 'Introdução' },
          { time: 300,  label: 'O que é marketing de afiliados' },
          { time: 900,  label: 'Como recrutar afiliados' },
          { time: 1800, label: 'Gestão de comissões' },
        ]
      },
      {
        id: 'ep-3', number: 10, title: 'Email marketing para criadores: taxas de abertura de 60%+',
        description: 'Técnicas avançadas de copywriting e segmentação para maximizar resultados.',
        duration: 2233, publishedAt: '2026-08-31', isPlayed: true, isCached: false,
        chapters: []
      },
    ]
  });

  const [currentEp, setCurrentEp] = useState<PodcastEpisode>(series.episodes[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-1
  const [currentTime, setCurrentTime] = useState(0); // seconds
  const [speed, setSpeed] = useState(1);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [showChapters, setShowChapters] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate playback
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(t => {
          const next = t + speed;
          if (next >= currentEp.duration) {
            setIsPlaying(false);
            return currentEp.duration;
          }
          setProgress(next / currentEp.duration);
          return next;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, speed, currentEp.duration]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    return `${m}:${String(sec).padStart(2,'0')}`;
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const newTime = pct * currentEp.duration;
    setCurrentTime(newTime);
    setProgress(pct);
  };

  const skipSeconds = (s: number) => {
    setCurrentTime(t => {
      const next = Math.max(0, Math.min(t + s, currentEp.duration));
      setProgress(next / currentEp.duration);
      return next;
    });
  };

  const playEpisode = (ep: PodcastEpisode) => {
    setCurrentEp(ep);
    setCurrentTime(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const currentChapter = currentEp.chapters
    .filter(c => c.time <= currentTime)
    .slice(-1)[0];

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Badge variant="primary" size="sm" icon={<Headphones className="w-3.5 h-3.5" />}>
          Player de Podcast Nativo
        </Badge>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">{series.title}</h2>
        <p className="text-xs text-slate-400">Por {series.creator}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cover + Episode Info */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-start gap-4">
              <img src={series.coverImage} alt="" className="w-20 h-20 rounded-2xl object-cover border border-slate-700 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 font-mono mb-1">EP. {currentEp.number}</div>
                <h3 className="text-sm font-black text-white leading-tight">{currentEp.title}</h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{currentEp.description}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(currentEp.duration)}</span>
                  {currentEp.isCached && <span className="flex items-center gap-1 text-emerald-400"><WifiOff className="w-3 h-3" />Offline</span>}
                  {currentChapter && <span className="text-blue-400 truncate">{currentChapter.label}</span>}
                </div>
              </div>
            </div>

            {/* Waveform / Progress bar */}
            <div className="space-y-2">
              <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer" onClick={seek}>
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                  style={{ width: `${progress * 100}%` }} />
                {/* Chapter markers */}
                {currentEp.chapters.map(ch => (
                  <div key={ch.time} className="absolute top-0 bottom-0 w-0.5 bg-white/30"
                    style={{ left: `${(ch.time / currentEp.duration) * 100}%` }} />
                ))}
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(currentEp.duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-2">
              {/* Speed */}
              <div className="flex items-center gap-1">
                {speeds.map(s => (
                  <button key={s} onClick={() => setSpeed(s)}
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded transition-colors cursor-pointer ${speed === s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                    {s}×
                  </button>
                ))}
              </div>

              {/* Playback controls */}
              <div className="flex items-center gap-2">
                <button onClick={() => skipSeconds(-15)} className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer" title="-15s">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button onClick={() => setIsPlaying(p => !p)}
                  className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg shadow-blue-500/30">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <button onClick={() => skipSeconds(30)} className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer" title="+30s">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button onClick={() => setMuted(m => !m)} className="text-slate-400 hover:text-white cursor-pointer">
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input type="range" min="0" max="1" step="0.1" value={muted ? 0 : volume}
                  onChange={e => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                  className="w-16 accent-blue-500 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Chapters */}
          {currentEp.chapters.length > 0 && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <button className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-800/30 transition-colors"
                onClick={() => setShowChapters(c => !c)}>
                <span className="text-xs font-bold text-slate-200">📑 Capítulos ({currentEp.chapters.length})</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showChapters ? 'rotate-180' : ''}`} />
              </button>
              {showChapters && (
                <div className="divide-y divide-slate-800">
                  {currentEp.chapters.map(ch => (
                    <button key={ch.time} onClick={() => { setCurrentTime(ch.time); setProgress(ch.time / currentEp.duration); }}
                      className={`w-full flex items-center gap-3 p-3 text-left text-xs transition-colors cursor-pointer hover:bg-slate-800/40 ${currentTime >= ch.time ? 'text-blue-400' : 'text-slate-400'}`}>
                      <span className="font-mono text-[11px] w-10 shrink-0">{formatTime(ch.time)}</span>
                      <span className="font-medium">{ch.label}</span>
                      {currentTime >= ch.time && currentChapter?.time === ch.time && (
                        <span className="ml-auto text-[10px] text-blue-400 font-bold">► A tocar</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Episode Playlist */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="p-3 border-b border-slate-800 flex items-center gap-2">
            <List className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-200">Episódios ({series.episodes.length})</span>
          </div>
          <div className="divide-y divide-slate-800 overflow-y-auto" style={{ maxHeight: '480px' }}>
            {series.episodes.map(ep => (
              <button key={ep.id} onClick={() => playEpisode(ep)}
                className={`w-full p-3 text-left transition-colors hover:bg-slate-800/40 cursor-pointer ${currentEp.id === ep.id ? 'bg-blue-600/10 border-l-2 border-blue-500' : ''}`}>
                <div className="flex items-start gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${currentEp.id === ep.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {currentEp.id === ep.id && isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 font-mono">EP. {ep.number}</div>
                    <div className={`text-xs font-semibold leading-tight ${currentEp.id === ep.id ? 'text-blue-400' : 'text-slate-200'}`}>
                      {ep.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <Clock className="w-3 h-3" />{formatTime(ep.duration)}
                      {ep.isCached && <span className="text-emerald-400">offline</span>}
                      {ep.isPlayed && <span className="text-slate-500">• ouvido</span>}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
