import React from 'react';
import { Mic, MicOff, Volume2, Square, AlertTriangle, Sparkles } from 'lucide-react';

export const VoiceStatusIndicator = ({
  voiceState = 'IDLE', // 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING' | 'ERROR'
  statusMessage = '',
  onToggleMic,
  onInterruptSpeaking
}) => {
  if (voiceState === 'IDLE' && !statusMessage) return null;

  const stateConfigs = {
    IDLE: {
      color: 'border-slate-700 bg-slate-900 text-slate-300',
      label: 'Voice System Ready',
      icon: <Mic className="w-4 h-4 text-slate-400" />
    },
    LISTENING: {
      color: 'border-red-500/60 bg-gradient-to-r from-red-950 via-slate-900 to-red-950 text-red-200 animate-pulse',
      label: '🎤 Listening...',
      icon: <Mic className="w-4 h-4 text-red-400 animate-bounce" />
    },
    PROCESSING: {
      color: 'border-teal-500/60 bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 text-teal-200',
      label: '🤔 Understanding intent...',
      icon: <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
    },
    SPEAKING: {
      color: 'border-amber-500/60 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-amber-200',
      label: '🔊 Speaking response...',
      icon: <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
    },
    ERROR: {
      color: 'border-rose-500/60 bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 text-rose-200',
      label: 'Microphone / Voice Error',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />
    }
  };

  const currentConfig = stateConfigs[voiceState] || stateConfigs.IDLE;

  return (
    <div className={`px-4 py-2 border-b flex items-center justify-between gap-3 text-xs font-bold transition-all ${currentConfig.color}`}>
      <div className="flex items-center gap-2 overflow-hidden">
        {currentConfig.icon}
        <span className="truncate">
          {statusMessage || currentConfig.label}
        </span>
      </div>

      {/* Waveforms */}
      {(voiceState === 'LISTENING' || voiceState === 'SPEAKING') && (
        <div className="flex items-center gap-1 h-5 shrink-0">
          <span className="w-1 bg-amber-400 wave-bar-1 rounded-full"></span>
          <span className="w-1 bg-teal-400 wave-bar-2 rounded-full"></span>
          <span className="w-1 bg-emerald-400 wave-bar-3 rounded-full"></span>
          <span className="w-1 bg-amber-400 wave-bar-4 rounded-full"></span>
          <span className="w-1 bg-teal-400 wave-bar-5 rounded-full"></span>
        </div>
      )}

      {/* Interruption / Control Button */}
      {voiceState === 'SPEAKING' ? (
        <button
          onClick={onInterruptSpeaking}
          className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black shadow-md shrink-0 flex items-center gap-1 active:scale-95 transition-all"
          title="Stop AI speech playback immediately and start asking question"
        >
          <Square className="w-3 h-3 fill-current text-white" /> Barge-in / Interrupt
        </button>
      ) : (
        <button
          onClick={onToggleMic}
          className={`p-1.5 rounded-xl border transition-all shrink-0 ${
            voiceState === 'LISTENING'
              ? 'bg-red-600 text-white border-red-500'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
          }`}
          title={voiceState === 'LISTENING' ? 'Stop Listening' : 'Start Microphone Voice Input'}
        >
          {voiceState === 'LISTENING' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
};
