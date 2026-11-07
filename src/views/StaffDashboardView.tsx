import React, { useState } from 'react';
import { Appointment, Language, PageView } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  Users,
  Search,
  Filter,
  PhoneCall,
  Calendar,
  AlertCircle,
  CheckCircle2,
  PlusCircle,
  Globe,
  Clock,
  Sparkles,
  FileText,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { speechService } from '../utils/speech';

interface StaffDashboardViewProps {
  currentLanguage: Language;
  appointments: Appointment[];
  onSelectAppointment: (apt: Appointment) => void;
  onUpdateAppointment: (apt: Appointment) => void;
  onAddAppointment: (apt: Appointment) => void;
  onPageChange: (page: PageView) => void;
}

export const StaffDashboardView: React.FC<StaffDashboardViewProps> = ({
  currentLanguage,
  appointments,
  onSelectAppointment,
  onUpdateAppointment,
  onAddAppointment,
  onPageChange,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unconfirmed' | 'confirmed' | 'rescheduled'>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [callAlertToast, setCallAlertToast] = useState<string | null>(null);

  // New appointment form state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAge, setNewAge] = useState(55);
  const [newLang, setNewLang] = useState<Language>('kn');
  const [newTest, setNewTest] = useState('Abdominal CT Scan');
  const [newDate, setNewDate] = useState('2026-11-20');
  const [newTime, setNewTime] = useState('11:00 AM');

  // Filtered appointments
  const filtered = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery) ||
      apt.patientId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = appointments.length;
  const unconfirmedCount = appointments.filter((a) => a.status === 'unconfirmed').length;
  const rescheduledCount = appointments.filter((a) => a.status === 'rescheduled').length;
  const caregiversNotifiedCount = appointments.filter((a) => (a.caregiver?.notifiedCount || 0) > 0).length;

  const handleTriggerVoiceCall = (apt: Appointment) => {
    const toastMsg = `Spoken reminder call initiated in ${
      apt.preferredLanguage === 'kn' ? 'Kannada' : apt.preferredLanguage === 'te' ? 'Telugu' : 'English'
    } to ${apt.patientPhone} (${apt.patientName})`;
    
    setCallAlertToast(toastMsg);

    // Speak a short staff preview
    const script =
      apt.preferredLanguage === 'kn'
        ? `ನಮಸ್ಕಾರ ${apt.patientNameKannada} ರವರೇ. ನಿಮ್ಮ ಸಿಟಿ ಸ್ಕ್ಯಾನ್ ದಿನಾಂಕ ${apt.date}.`
        : apt.preferredLanguage === 'te'
        ? `నమస్కారం ${apt.patientNameTelugu} గారూ. మీ సిటి స్కాన్ తేదీ ${apt.date}.`
        : `Reminder for ${apt.patientName}: appointment on ${apt.date}.`;

    speechService.speak(script, apt.preferredLanguage);

    setTimeout(() => {
      setCallAlertToast(null);
    }, 5000);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newApt: Appointment = {
      id: `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      pin: `${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: newName,
      patientNameKannada: newName,
      patientNameTelugu: newName,
      patientAge: Number(newAge),
      patientPhone: newPhone,
      patientVillage: 'District Rural Area',
      patientDistrict: 'District Center',
      preferredLanguage: newLang,
      testName: newTest,
      testNameKannada: `${newTest} (ಸಿಟಿ ಸ್ಕ್ಯಾನ್)`,
      testNameTelugu: `${newTest} (సిటి స్కాన్)`,
      testCategory: 'Radiology & Imaging',
      hospitalName: 'Victoria District Government Hospital',
      hospitalNameKannada: 'ವಿಕ್ಟೋರಿಯಾ ಜಿಲ್ಲಾ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆ',
      hospitalNameTelugu: 'విక్టోరియా జిల్లా ప్రభుత్వ ఆసుపత్రి',
      department: 'Department of Radiodiagnosis',
      roomNumber: 'Diagnostic Wing, Block B, Room 104',
      doctorName: 'Dr. Suresh Patil, MD',
      date: newDate,
      time: newTime,
      dayOfWeek: 'Friday',
      preparationInstructions: {
        kn: ['ಪರೀಕ್ಷೆಗೆ ೪ ಗಂಟೆಗಳ ಮುನ್ನ ಘನ ಆಹಾರ ಸೇವಿಸಬಾರದು.', 'ಹಳೆಯ ವರದಿಗಳನ್ನು ತನ್ನಿ.'],
        te: ['స్కాన్‌కు 4 గంటల ముందు ఏమీ తినకూడదు.', 'పాత రిపోర్టులు వెంట తీసుకురండి.'],
        en: ['Fasting 4 hours required.', 'Bring previous reports and arrive 30 mins early.'],
      },
      directions: {
        kn: 'ರೇಡಿಯಾಲಜಿ ವಿಭಾಗ ಕೊಠಡಿ ೧೦೪.',
        te: 'రేడియాలజీ విభాగం గది 104.',
        en: 'Radiology Department, Block B, Room 104.',
      },
      status: 'unconfirmed',
      reminderPreferences: {
        sms: true,
        voiceCall: true,
        whatsapp: true,
        caregiver: true,
      },
      reminderIntervals: ['7_days', '1_day', '4_hours'],
      history: [
        {
          timestamp: new Date().toLocaleString(),
          action: 'Created by Hospital Radiology Staff',
          actionKannada: 'ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿಯಿಂದ ದಾಖಲಿಸಲಾಗಿದೆ',
          actionTelugu: 'హాస్పిటల్ సిబ్బంది ద్వారా జోడించబడింది',
          author: 'Staff Desk',
        },
      ],
    };

    onAddAppointment(newApt);
    setShowNewModal(false);
    setNewName('');
    setNewPhone('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs text-amber-900">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>{t.staff.demoNotice}</strong> Simulated government hospital outpatient radiology coordinator desk.
          </span>
        </div>
        <span className="hidden sm:inline font-mono font-bold bg-amber-200/60 px-2 py-0.5 rounded">
          STAFF ROLE: NURSE / COORDINATOR
        </span>
      </div>

      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider block">
            {currentLanguage === 'kn' ? 'ಆಸ್ಪತ್ರೆ ಆಡಳಿತ' : currentLanguage === 'te' ? 'హాస్పిటల్ అడ్మిన్' : 'Department Operations'}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3C3330]">
            {t.staff.title}
          </h1>
          <p className="text-sm text-[#3C3330]/80">
            {t.staff.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="py-3 px-6 rounded-2xl bg-[#BEA06D] hover:bg-[#8F7242] active:scale-95 text-white font-bold text-sm shadow flex items-center gap-2 cursor-pointer transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{t.staff.newAppointmentBtn}</span>
        </button>
      </div>

      {/* Toast Alert when Voice Call is Dispatched */}
      {callAlertToast && (
        <div className="p-4 bg-emerald-900 text-white rounded-2xl shadow-lg border border-emerald-400 flex items-center gap-3 animate-in fade-in-50">
          <PhoneCall className="w-5 h-5 text-emerald-300 animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{callAlertToast}</span>
        </div>
      )}

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#BEA06D]/30 shadow-xs space-y-1">
          <span className="text-xs text-[#8F7242] font-semibold block">{t.staff.statsTotal}</span>
          <p className="text-3xl font-bold font-mono text-[#3C3330]">{totalCount}</p>
          <span className="text-[11px] text-[#3C3330]/70">CT & MRI Outpatients</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-red-200 shadow-xs space-y-1">
          <span className="text-xs text-red-600 font-semibold block">{t.staff.statsUnconfirmed}</span>
          <p className="text-3xl font-bold font-mono text-red-700">{unconfirmedCount}</p>
          <span className="text-[11px] text-red-900/70">Requires follow-up / IVR</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-1">
          <span className="text-xs text-amber-700 font-semibold block">{t.staff.statsRescheduled}</span>
          <p className="text-3xl font-bold font-mono text-amber-800">{rescheduledCount}</p>
          <span className="text-[11px] text-amber-900/70">Updated hospital slots</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#A2B29B]/50 shadow-xs space-y-1">
          <span className="text-xs text-[#4A6347] font-semibold block">{t.staff.statsCaregivers}</span>
          <p className="text-3xl font-bold font-mono text-[#4A6347]">{caregiversNotifiedCount}</p>
          <span className="text-[11px] text-[#4A6347]/80">Safety net engaged</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-[#BEA06D]/30 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder={t.staff.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-[#FCF9F5] focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FCF9F5] rounded-xl border border-[#BEA06D]/30 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              statusFilter === 'all' ? 'bg-[#BEA06D] text-white shadow-xs font-bold' : 'text-[#3C3330] hover:text-[#8F7242]'
            }`}
          >
            {t.staff.filterAll}
          </button>
          <button
            onClick={() => setStatusFilter('unconfirmed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              statusFilter === 'unconfirmed' ? 'bg-red-600 text-white shadow-xs font-bold' : 'text-[#3C3330] hover:text-red-700'
            }`}
          >
            {t.staff.filterUnconfirmed} ({unconfirmedCount})
          </button>
          <button
            onClick={() => setStatusFilter('rescheduled')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              statusFilter === 'rescheduled' ? 'bg-amber-600 text-white shadow-xs font-bold' : 'text-[#3C3330] hover:text-amber-800'
            }`}
          >
            {t.staff.filterRescheduled}
          </button>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white border border-[#BEA06D]/30 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#3C3330]">
            <thead className="bg-[#FCF9F5] border-b border-[#BEA06D]/20 text-[#8F7242] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">{t.staff.colPatient}</th>
                <th className="py-3.5 px-4">{t.staff.colTest}</th>
                <th className="py-3.5 px-4">{t.staff.colDate}</th>
                <th className="py-3.5 px-4">{t.staff.colLanguage}</th>
                <th className="py-3.5 px-4">{t.staff.colStatus}</th>
                <th className="py-3.5 px-4 text-right">{t.staff.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#BEA06D]/15 font-medium">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-[#FCF9F5]/70 transition-colors">
                  {/* Patient Info */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-sm text-[#3C3330]">{apt.patientName}</p>
                    <span className="text-[11px] text-[#3C3330]/70">
                      {apt.patientPhone} · Age {apt.patientAge} · {apt.patientDistrict}
                    </span>
                  </td>

                  {/* Test */}
                  <td className="py-4 px-4">
                    <p className="font-semibold text-xs text-[#3C3330]">{apt.testName}</p>
                    <span className="text-[11px] text-[#8F7242]">{apt.roomNumber}</span>
                  </td>

                  {/* Date & Time */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-xs">{apt.date}</p>
                    <span className="text-[11px] text-[#8F7242]">{apt.time} ({apt.dayOfWeek})</span>
                  </td>

                  {/* Language */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        apt.preferredLanguage === 'kn'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : apt.preferredLanguage === 'te'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}
                    >
                      {apt.preferredLanguage === 'kn' ? 'ಕನ್ನಡ (Kn)' : apt.preferredLanguage === 'te' ? 'తెలుగు (Te)' : 'English (En)'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    {apt.status === 'confirmed' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Confirmed
                      </span>
                    ) : apt.status === 'rescheduled' ? (
                      <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-full">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" /> Rescheduled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-800 font-bold bg-red-50 border border-red-300 px-2.5 py-1 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600" /> Unconfirmed
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleTriggerVoiceCall(apt)}
                        title="Trigger Automated Multilingual IVR Voice Call"
                        className="py-1.5 px-3 rounded-lg bg-[#BEA06D]/20 hover:bg-[#BEA06D] hover:text-white text-[#8F7242] font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Voice Call</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectAppointment(apt);
                          onPageChange('appointment');
                        }}
                        className="py-1.5 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#3C3330] font-semibold text-xs transition-colors cursor-pointer"
                      >
                        {t.staff.viewDetailsBtn}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Appointment Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#BEA06D] space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display text-xl font-bold text-[#3C3330]">
                {t.staff.newAppointmentBtn}
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-gray-400 hover:text-black font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#3C3330] block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Basappa Gowda"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#3C3330] block mb-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    placeholder="98451 23456"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3C3330] block mb-1">Age</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#BEA06D]"
                  />
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="font-bold text-[#3C3330] block mb-1">
                  Patient Preferred Language (Critical for Voice Calls)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewLang('kn')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      newLang === 'kn' ? 'bg-[#BEA06D] text-white border-[#BEA06D]' : 'bg-gray-50'
                    }`}
                  >
                    ಕನ್ನಡ (Kannada)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewLang('te')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      newLang === 'te' ? 'bg-[#BEA06D] text-white border-[#BEA06D]' : 'bg-gray-50'
                    }`}
                  >
                    తెలుగు (Telugu)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewLang('en')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      newLang === 'en' ? 'bg-[#BEA06D] text-white border-[#BEA06D]' : 'bg-gray-50'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#3C3330] block mb-1">Diagnostic Procedure</label>
                <select
                  value={newTest}
                  onChange={(e) => setNewTest(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none"
                >
                  <option value="Abdominal CT Scan with Contrast">Abdominal CT Scan with Contrast</option>
                  <option value="Cardiac 2D Echocardiography">Cardiac 2D Echocardiography</option>
                  <option value="Ultrasound Pelvis & Abdomen">Ultrasound Pelvis & Abdomen</option>
                  <option value="MRI Brain & Spine">MRI Brain & Spine</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#3C3330] block mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3C3330] block mb-1">Reporting Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="py-2.5 px-4 rounded-xl border text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-[#BEA06D] hover:bg-[#8F7242] text-white font-bold shadow"
                >
                  Save & Trigger Multilingual Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
