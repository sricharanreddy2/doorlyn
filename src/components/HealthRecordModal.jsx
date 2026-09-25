import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Download, 
  Activity
} from 'lucide-react';

export const HealthRecordModal = ({ onClose }) => {

  const records = [
    {
      id: 'REC-101',
      title: 'Complete Blood Count (CBC) Report',
      date: '2026-07-28',
      lab: 'Doorlyn Diagnostics / Dr. Lal PathLabs',
      status: 'Normal',
      findings: 'Hemoglobin: 14.2 g/dL (Normal: 13-17 g/dL), RBC: 4.8 M/uL (Healthy), Platelets: 250,000 /uL (Optimal range).',
      aiExplanation: 'Your CBC report is completely healthy! Hemoglobin levels are in the optimal range. Keep maintaining a balanced diet with green leafy vegetables and iron-rich foods.',
      metrics: [
        { name: 'Hemoglobin', value: '14.2 g/dL', normal: '13.0 - 17.0', status: 'Good' },
        { name: 'WBC Count', value: '7,200 /uL', normal: '4,000 - 11,000', status: 'Good' },
        { name: 'Platelets', value: '2.5 Lakhs', normal: '1.5 - 4.5 Lakhs', status: 'Good' }
      ]
    },
    {
      id: 'REC-102',
      title: 'Fasting Blood Sugar (FBS)',
      date: '2026-06-15',
      lab: 'Apollo Health Care',
      status: 'Normal',
      findings: 'FBS: 95 mg/dL (Normal Fasting Range: 70-99 mg/dL).',
      aiExplanation: 'Blood sugar is well within the non-diabetic range. Regular morning walks are helping maintain good glycemic control.',
      metrics: [
        { name: 'Fasting Glucose', value: '95 mg/dL', normal: '70 - 99 mg/dL', status: 'Good' }
      ]
    }
  ];

  const [selectedRecord, setSelectedRecord] = useState(records[0]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                Digital Health Records & AI Explainer
              </h3>
              <p className="text-xs text-slate-500">
                AI simplifies complex medical jargon into easy terms
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Records Selector Tabs */}
          <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
            {records.map(rec => (
              <button
                key={rec.id}
                onClick={() => setSelectedRecord(rec)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                  selectedRecord.id === rec.id
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {rec.title} ({rec.date})
              </button>
            ))}
          </div>

          {/* AI Explanation Banner */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              <span className="font-bold text-xs uppercase tracking-wider text-amber-300">
                Doorlyn AI Report Explanation
              </span>
            </div>
            <p className="text-sm font-medium leading-relaxed">
              "{selectedRecord.aiExplanation}"
            </p>
          </div>

          {/* Test Metrics Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Diagnostic Parameters Breakdown
            </h4>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 divide-y divide-slate-200">
              {selectedRecord.metrics.map((m, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{m.name}</span>
                    <span className="text-[10px] text-slate-400 block">Normal Range: {m.normal}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 text-sm">{m.value}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">
                      ✓ {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              onClick={() => alert('PDF Diagnostic Report Downloaded to device!')}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              Download Lab PDF Report
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
