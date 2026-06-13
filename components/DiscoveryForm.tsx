'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle2, ArrowRight, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Progress from '@radix-ui/react-progress';

interface DiscoveryFormData {
  fullName: string;
  companyName: string;
  businessEmail: string;
  coreGoal: string;
  targetAudience: string;
  uniqueValue: string;
  techRequirements: string;
  budgetRange: string;
  timeline: string;
}

const STORAGE_KEY = 'vyuapp-discovery-answers';

const initialAnswers: DiscoveryFormData = {
  fullName: '',
  companyName: '',
  businessEmail: '',
  coreGoal: '',
  targetAudience: '',
  uniqueValue: '',
  techRequirements: '',
  budgetRange: '',
  timeline: '',
};

const stepLabels = [
  'Corporate Identity',
  'Project Core Goals & Audience',
  'UVP, Tech & Investment',
  'Review & Submit',
];

const stepFields: Record<number, (keyof DiscoveryFormData)[]> = {
  0: ['fullName', 'companyName', 'businessEmail'],
  1: ['coreGoal', 'targetAudience'],
  2: ['uniqueValue', 'techRequirements', 'budgetRange', 'timeline'],
  3: [],
};

const budgetOptions = [
  { value: '', label: 'Pilih kisaran budget\u2026' },
  { value: '< 50jt', label: '< Rp 50 Juta' },
  { value: '50jt\u2013150jt', label: 'Rp 50 \u2013 150 Juta' },
  { value: '150jt\u2013500jt', label: 'Rp 150 \u2013 500 Juta' },
  { value: '> 500jt', label: '> Rp 500 Juta' },
  { value: 'discuss', label: 'Diskusikan dulu' },
];

const timelineOptions = [
  { value: '', label: 'Pilih estimasi timeline\u2026' },
  { value: '1\u20132 bulan', label: '1\u20132 Bulan' },
  { value: '3\u20134 bulan', label: '3\u20134 Bulan' },
  { value: '5\u20138 bulan', label: '5\u20138 Bulan' },
  { value: '> 8 bulan', label: '> 8 Bulan' },
  { value: 'flexible', label: 'Fleksibel' },
];

type FormStatus = 'idle' | 'loading' | 'sent' | 'error';

const iconBox = 'w-9 h-9 rounded-lg bg-terracotta-50 border border-terracotta-100 flex items-center justify-center text-terracotta-500';

export default function DiscoveryForm() {
  const [answers, setAnswers] = useState<DiscoveryFormData>(initialAnswers);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');
  const refs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setAnswers((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
    }
  }, [answers]);

  useEffect(() => {
    const fields = stepFields[step];
    if (fields.length > 0) {
      const timer = setTimeout(() => {
        refs.current[fields[0]]?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const validateStep = useCallback((s: number, data: DiscoveryFormData): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (!data.fullName.trim()) errs.fullName = 'Nama lengkap wajib diisi.';
      if (!data.companyName.trim()) errs.companyName = 'Nama perusahaan wajib diisi.';
      if (!data.businessEmail.trim()) {
        errs.businessEmail = 'Email wajib diisi.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.businessEmail)) {
        errs.businessEmail = 'Format email tidak valid.';
      }
    } else if (s === 1) {
      if (!data.coreGoal.trim()) errs.coreGoal = 'Tujuan utama proyek wajib diisi.';
      if (!data.targetAudience.trim()) errs.targetAudience = 'Target audiens wajib diisi.';
    } else if (s === 2) {
      if (!data.uniqueValue.trim()) errs.uniqueValue = 'Nilai unik wajib diisi.';
      if (!data.techRequirements.trim()) errs.techRequirements = 'Kebutuhan teknis wajib diisi.';
      if (!data.budgetRange) errs.budgetRange = 'Pilih kisaran budget.';
      if (!data.timeline) errs.timeline = 'Pilih estimasi timeline.';
    }
    return errs;
  }, []);

  const handleChange = (field: keyof DiscoveryFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const next = { ...answers, [field]: e.target.value };
    setAnswers(next);
    if (errors[field]) {
      const nextErrors = { ...errors };
      delete nextErrors[field];
      setErrors(nextErrors);
    }
  };

  const handleNext = () => {
    const stepErrors = validateStep(step, answers);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 0));
    setErrors({});
  };

  const handleSubmit = async () => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const res = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Terjadi kesalahan.');
        setStatus('error');
        return;
      }
      setStatus('sent');
      setAnswers(initialAnswers);
      setStep(0);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
      }
      setTimeout(() => setStatus('idle'), 8000);
    } catch {
      setErrorMessage('Gagal mengirim. Periksa koneksi Anda.');
      setStatus('error');
    }
  };

  const inputClass = 'w-full bg-white border border-sand-200 rounded-xl px-4 py-3 text-sm text-sand-900 placeholder:text-sand-400 focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/10 transition';
  const errClass = 'text-red-500 text-xs mt-1.5 flex items-center gap-1';

  const isStepValid = Object.keys(validateStep(step, answers)).length === 0;

  const renderField = (
    field: keyof DiscoveryFormData,
    label: string,
    type: 'input' | 'textarea' | 'select' = 'input',
    options?: { value: string; label: string }[],
    placeholder?: string,
  ) => {
    const error = errors[field];
    const common = {
      ref: (el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null) => {
        refs.current[field] = el;
      },
      value: answers[field],
      onChange: handleChange(field),
      'aria-invalid': !!error,
      className: inputClass,
    };

    return (
      <div>
        <label className="block anth-overline mb-2">{label}</label>
        {type === 'textarea' ? (
          <textarea
            {...common}
            placeholder={placeholder}
            className={`${inputClass} min-h-[100px] resize-y`}
          />
        ) : type === 'select' ? (
          <select {...common} className={inputClass}>
            {options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...common}
            type={field === 'businessEmail' ? 'email' : 'text'}
            placeholder={placeholder}
          />
        )}
        {error && (
          <p className={errClass}>
            <AlertCircle className="w-3.5 h-3.5" /> {error}
          </p>
        )}
      </div>
    );
  };

  if (status === 'sent') {
    return (
      <div className="anth-card p-8 md:p-10 animate-fade-in-up border-terracotta-200">
        <div className="flex flex-col items-center text-center py-6">
          <span className={`${iconBox} w-14 h-14 mb-5`}>
            <CheckCircle2 className="w-7 h-7" />
          </span>
          <h3 className="text-xl font-semibold text-sand-900 mb-2">
            Discovery Brief Terkirim
          </h3>
          <p className="text-sm text-sand-500 max-w-md">
            Terima kasih, {answers.fullName}. Tim kami akan meninjau brief Anda
            dan merespon ke{' '}
            <strong className="text-sand-700">{answers.businessEmail}</strong>{' '}
            dalam 1x24 jam.
          </p>
        </div>
      </div>
    );
  }

  const progressValue = ((step + 1) / 4) * 100;
  const budgetLabel = budgetOptions.find((o) => o.value === answers.budgetRange)?.label || answers.budgetRange;
  const timelineLabel = timelineOptions.find((o) => o.value === answers.timeline)?.label || answers.timeline;

  return (
    <div className="anth-card p-8 md:p-10">
      {/* step circles */}
      <div className="flex items-center justify-center gap-1 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                i < step
                  ? 'bg-terracotta-500 text-white'
                  : i === step
                    ? 'bg-terracotta-500 text-white ring-2 ring-terracotta-500/30'
                    : 'bg-sand-100 text-sand-400'
              }`}
            >
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            {i < 3 && (
              <div
                className={`w-8 sm:w-12 h-0.5 mx-1 transition-colors duration-300 ${
                  i < step ? 'bg-terracotta-400' : 'bg-sand-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Radix progress bar */}
      <Progress.Root
        value={progressValue}
        className="relative h-1.5 w-full rounded-full bg-sand-200 mb-8 overflow-hidden"
      >
        <Progress.Indicator
          className="h-full rounded-full bg-terracotta-500 transition-all duration-500 ease-out"
          style={{ width: `${progressValue}%` }}
        />
      </Progress.Root>

      {/* step heading */}
      <div className="mb-6">
        <p className="anth-overline text-xs mb-1">LANGKAH {step + 1} DARI 4</p>
        <h3 className="text-xl font-semibold text-sand-900">{stepLabels[step]}</h3>
      </div>

      {/* animated step body */}
      <div key={step} className="animate-fade-in-up space-y-5">
        {step === 0 && (
          <>
            {renderField('fullName', 'Nama Lengkap', 'input', undefined, 'Budi Santoso')}
            {renderField('companyName', 'Nama Perusahaan', 'input', undefined, 'PT. Maju Jaya')}
            {renderField('businessEmail', 'Email Bisnis', 'input', undefined, 'budi@majujaya.com')}
          </>
        )}

        {step === 1 && (
          <>
            {renderField('coreGoal', 'Tujuan Utama Proyek', 'textarea', undefined, 'Ceritakan tujuan utama proyek ini — masalah bisnis apa yang ingin diselesaikan?')}
            {renderField('targetAudience', 'Target Audiens', 'textarea', undefined, 'Siapa pengguna utama dari sistem ini? Jelaskan demografi dan kebutuhan mereka.')}
          </>
        )}

        {step === 2 && (
          <>
            {renderField('uniqueValue', 'Nilai Unik / Keunggulan', 'textarea', undefined, 'Apa yang membedakan proyek ini dari kompetitor atau solusi yang sudah ada?')}
            {renderField('techRequirements', 'Kebutuhan Teknis', 'textarea', undefined, 'Ceritakan stack teknologi yang diinginkan, integrasi dengan sistem existing, atau batasan teknis.')}
            {renderField('budgetRange', 'Kisaran Budget', 'select', budgetOptions)}
            {renderField('timeline', 'Estimasi Timeline', 'select', timelineOptions)}
          </>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {[
              { label: 'Nama Lengkap', value: answers.fullName },
              { label: 'Perusahaan', value: answers.companyName },
              { label: 'Email', value: answers.businessEmail },
              { label: 'Tujuan Utama', value: answers.coreGoal },
              { label: 'Target Audiens', value: answers.targetAudience },
              { label: 'Nilai Unik', value: answers.uniqueValue },
              { label: 'Kebutuhan Teknis', value: answers.techRequirements },
              { label: 'Budget', value: budgetLabel },
              { label: 'Timeline', value: timelineLabel },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col sm:flex-row sm:gap-4 py-2 border-b border-sand-200 last:border-0"
              >
                <span className="anth-overline text-[0.65rem] sm:w-40 flex-shrink-0">
                  {item.label}
                </span>
                <span className="text-sm text-sand-700">
                  {item.value || <span className="text-sand-300">&mdash;</span>}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* error banner */}
      {status === 'error' && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm mt-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {errorMessage}
        </div>
      )}

      {/* navigation */}
      <div className="flex items-center justify-between gap-4 mt-8 pt-4 border-t border-sand-200">
        {step > 0 ? (
          <button
            type="button"
            onClick={handlePrev}
            disabled={status === 'loading'}
            className="anth-btn-secondary text-sm !py-2.5 !px-5"
          >
            <ChevronLeft className="w-4 h-4" /> Sebelumnya
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!isStepValid}
            className={`anth-btn-primary text-sm !py-2.5 !px-5 ${!isStepValid ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Lanjut <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === 'loading'}
            className={`anth-btn-primary text-sm !py-2.5 !px-5 ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Mengirim...
              </>
            ) : (
              <>
                Submit Discovery Brief <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
