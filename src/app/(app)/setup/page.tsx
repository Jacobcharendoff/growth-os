'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { useTheme } from '@/components/ThemeProvider';
import {
  ChevronLeft, ChevronRight, Building2, Users, Settings,
  Palette, CheckCircle2, ArrowRight, AlertCircle, Trash2,
} from 'lucide-react';

type StepName = 'company' | 'team' | 'pipeline' | 'preferences' | 'ready';

interface FormErrors {
  [key: string]: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface PipelineStage {
  id: string;
  name: string;
  color: string;
}

const INDUSTRIES = [
  'plumbing', 'hvac', 'electrical', 'landscaping',
  'cleaning', 'roofing', 'general_contracting', 'other'
];

const INDUSTRY_LABELS: Record<string, string> = {
  plumbing: 'Plumbing',
  hvac: 'HVAC',
  electrical: 'Electrical',
  landscaping: 'Landscaping',
  cleaning: 'Cleaning',
  roofing: 'Roofing',
  general_contracting: 'General Contracting',
  other: 'Other',
};

const TEAM_ROLES = [
  { id: 'owner', label: 'Owner' },
  { id: 'technician', label: 'Technician' },
  { id: 'office_manager', label: 'Office Manager' },
  { id: 'sales', label: 'Sales' },
];

const DEFAULT_PIPELINE_STAGES: PipelineStage[] = [
  { id: '1', name: 'New Lead', color: 'bg-blue-500' },
  { id: '2', name: 'Contacted', color: 'bg-slate-500' },
  { id: '3', name: 'Estimate Scheduled', color: 'bg-purple-500' },
  { id: '4', name: 'Estimate Sent', color: 'bg-indigo-500' },
  { id: '5', name: 'Booked', color: 'bg-cyan-500' },
  { id: '6', name: 'In Progress', color: 'bg-amber-500' },
  { id: '7', name: 'Completed', color: 'bg-emerald-500' },
  { id: '8', name: 'Invoiced', color: 'bg-green-500' },
];

const CANADIAN_TIMEZONES = [
  { id: 'America/Vancouver', label: 'Pacific Time (BC)' },
  { id: 'America/Edmonton', label: 'Mountain Time (AB)' },
  { id: 'America/Winnipeg', label: 'Central Time (SK/MB)' },
  { id: 'America/Toronto', label: 'Eastern Time (ON)' },
  { id: 'America/Halifax', label: 'Atlantic Time (NS)' },
];

export default function SetupPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { settings, updateSettings } = useStore();
  const isDark = theme === 'dark';

  const [step, setStep] = useState<StepName>('company');
  const [errors, setErrors] = useState<FormErrors>({});
  const [mounted, setMounted] = useState(false);

  // Company step
  const [companyName, setCompanyName] = useState(settings.companyName || '');
  const [phone, setPhone] = useState(settings.companyPhone || '');
  const [email, setEmail] = useState(settings.companyEmail || '');
  const [address, setAddress] = useState(settings.companyAddress || '');
  const [industry, setIndustry] = useState(settings.industry || 'plumbing');

  // Team step
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    settings.teamMembers?.map(m => ({ id: m.id, name: m.name, role: m.role })) || [
      { id: '0', name: 'You', role: 'owner' }
    ]
  );
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('technician');

  // Pipeline step
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(
    settings.pipelineStages || DEFAULT_PIPELINE_STAGES
  );
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Preferences step
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('CAD');
  const [timezone, setTimezone] = useState(settings.timezone || 'America/Toronto');
  const [darkMode, setDarkMode] = useState(isDark);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Validation
  const validateCompanyStep = (): boolean => {
    const newErrors: FormErrors = {};
    if (!companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (email && !email.includes('@')) newErrors.email = 'Valid email required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTeamStep = (): boolean => {
    if (teamMembers.length === 0) {
      setErrors({ general: 'At least one team member required' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    switch (step) {
      case 'company':
        if (validateCompanyStep()) {
          updateSettings({
            companyName,
            companyPhone: phone,
            companyEmail: email,
            companyAddress: address,
            industry,
          });
          setStep('team');
        }
        break;
      case 'team':
        if (validateTeamStep()) {
          updateSettings({
            teamMembers: teamMembers.map(m => ({
              id: m.id,
              name: m.name,
              role: m.role,
              color: `bg-${['blue', 'emerald', 'purple', 'orange'][Math.floor(Math.random() * 4)]}-500`,
            })),
          });
          setStep('pipeline');
        }
        break;
      case 'pipeline':
        updateSettings({ pipelineStages });
        setStep('preferences');
        break;
      case 'preferences':
        updateSettings({ timezone });
        setStep('ready');
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    const steps: StepName[] = ['company', 'team', 'pipeline', 'preferences', 'ready'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleLaunch = () => {
    updateSettings({
      companyName,
      companyPhone: phone,
      companyEmail: email,
      companyAddress: address,
      industry,
      teamMembers: teamMembers.map(m => ({
        id: m.id,
        name: m.name,
        role: m.role,
        color: `bg-${['blue', 'emerald', 'purple', 'orange'][Math.floor(Math.random() * 4)]}-500`,
      })),
      pipelineStages,
      timezone,
    });
    localStorage.setItem('growth-os-onboarded', 'true');
    router.push('/dashboard');
  };

  const addTeamMember = () => {
    if (!newMemberName.trim()) {
      setErrors({ newMember: 'Name is required' });
      return;
    }
    setTeamMembers([
      ...teamMembers,
      {
        id: Date.now().toString(),
        name: newMemberName,
        role: newMemberRole,
      },
    ]);
    setNewMemberName('');
    setNewMemberRole('technician');
    setErrors({});
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  const startEditingStage = (id: string, name: string) => {
    setEditingStageId(id);
    setEditingName(name);
  };

  const saveEditingStage = () => {
    if (editingStageId && editingName.trim()) {
      setPipelineStages(pipelineStages.map(s =>
        s.id === editingStageId ? { ...s, name: editingName } : s
      ));
    }
    setEditingStageId(null);
    setEditingName('');
  };

  const resetPipeline = () => {
    setPipelineStages(DEFAULT_PIPELINE_STAGES);
  };

  // Step indicator
  const steps: { name: StepName; label: string }[] = [
    { name: 'company', label: 'Company' },
    { name: 'team', label: 'Team' },
    { name: 'pipeline', label: 'Pipeline' },
    { name: 'preferences', label: 'Preferences' },
    { name: 'ready', label: 'Ready' },
  ];

  const currentStepIndex = steps.findIndex(s => s.name === step);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`border-b transition-colors duration-200 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className={`text-3xl font-bold transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Welcome to GrowthOS
          </h1>
          <p className={`text-sm mt-1 transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Let's set up your business in under 2 minutes
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className={`transition-colors duration-200 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div key={s.name} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 ${
                    i < currentStepIndex
                      ? 'bg-green-500 text-white'
                      : i === currentStepIndex
                        ? 'bg-green-600 text-white ring-4 ring-green-200 dark:ring-green-900'
                        : isDark
                          ? 'bg-slate-700 text-slate-400'
                          : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {i < currentStepIndex ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-1 w-8 sm:w-12 mx-2 transition-all duration-200 ${
                      i < currentStepIndex
                        ? 'bg-green-500'
                        : isDark
                          ? 'bg-slate-700'
                          : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className={`text-sm font-medium transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].label}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`rounded-2xl shadow-lg transition-all duration-200 ${isDark ? 'bg-slate-800' : 'bg-white'} p-8`}>
          {/* Step 1: Company Info */}
          {step === 'company' && (
            <div>
              <h2 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Welcome to GrowthOS
              </h2>
              <p className={`mb-6 transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Let's start with your company information
              </p>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="Your Business Name"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                      errors.companyName
                        ? 'border-red-500'
                        : isDark
                          ? 'border-slate-700'
                          : 'border-slate-300'
                    } ${isDark ? 'bg-slate-700 text-white' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                  {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                      errors.phone
                        ? 'border-red-500'
                        : isDark
                          ? 'border-slate-700'
                          : 'border-slate-300'
                    } ${isDark ? 'bg-slate-700 text-white' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="info@yourbusiness.com"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                      errors.email
                        ? 'border-red-500'
                        : isDark
                          ? 'border-slate-700'
                          : 'border-slate-300'
                    } ${isDark ? 'bg-slate-700 text-white' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="123 Main St, City, Province"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-700 bg-slate-700 text-white' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-700 bg-slate-700 text-white' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  >
                    {INDUSTRIES.map(ind => (
                      <option key={ind} value={ind}>
                        {INDUSTRY_LABELS[ind]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Team */}
          {step === 'team' && (
            <div>
              <h2 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Who's on your team?
              </h2>
              <p className={`mb-6 transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Add team members (optional)
              </p>

              {errors.general && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.general}
                </div>
              )}

              {/* Team members list */}
              <div className="space-y-3 mb-6">
                {teamMembers.map(member => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-700 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}
                  >
                    <div>
                      <p className={`font-medium transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {member.name}
                      </p>
                      <p className={`text-sm transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {TEAM_ROLES.find(r => r.id === member.role)?.label || member.role}
                      </p>
                    </div>
                    {member.id !== '0' && (
                      <button
                        onClick={() => removeTeamMember(member.id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add new member */}
              <div className={`border-t transition-colors duration-200 ${isDark ? 'border-slate-700 pt-6' : 'border-slate-200 pt-6'}`}>
                <p className={`text-sm font-medium mb-3 transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Add a team member
                </p>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={e => setNewMemberName(e.target.value)}
                      placeholder="Member name"
                      className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-700 bg-slate-700 text-white' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    {errors.newMember && <p className="text-red-500 text-sm mt-1">{errors.newMember}</p>}
                  </div>
                  <div className="flex gap-3">
                    <select
                      value={newMemberRole}
                      onChange={e => setNewMemberRole(e.target.value)}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-700 bg-slate-700 text-white' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                    >
                      {TEAM_ROLES.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={addTeamMember}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pipeline */}
          {step === 'pipeline' && (
            <div>
              <h2 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Customize your pipeline
              </h2>
              <p className={`mb-6 transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Rename stages to match your business
              </p>

              <div className="space-y-3 mb-6">
                {pipelineStages.map(stage => (
                  <div
                    key={stage.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-700 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}
                  >
                    <div className={`w-4 h-4 rounded-full ${stage.color}`} />
                    {editingStageId === stage.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={e => setEditingName(e.target.value)}
                        onBlur={saveEditingStage}
                        onKeyDown={e => e.key === 'Enter' && saveEditingStage()}
                        autoFocus
                        className={`flex-1 px-3 py-1 rounded border transition-colors duration-200 ${isDark ? 'border-slate-600 bg-slate-800 text-white' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                      />
                    ) : (
                      <button
                        onClick={() => startEditingStage(stage.id, stage.name)}
                        className={`flex-1 text-left font-medium transition-colors duration-200 ${isDark ? 'text-white hover:text-slate-200' : 'text-slate-900 hover:text-slate-700'}`}
                      >
                        {stage.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={resetPipeline}
                className={`w-full py-2 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-600' : 'border-slate-300 text-slate-600 hover:text-slate-900'}`}
              >
                Reset to defaults
              </button>
            </div>
          )}

          {/* Step 4: Preferences */}
          {step === 'preferences' && (
            <div>
              <h2 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Your preferences
              </h2>
              <p className={`mb-6 transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Customize how GrowthOS works for you
              </p>

              <div className="space-y-6">
                {/* Language */}
                <div>
                  <label className={`block text-sm font-medium mb-3 transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Language
                  </label>
                  <div className="flex gap-3">
                    {['en', 'fr'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`flex-1 py-2 rounded-lg border-2 font-medium transition-all ${
                          language === lang
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : isDark
                              ? 'border-slate-700 text-slate-300 hover:border-slate-600'
                              : 'border-slate-300 text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        {lang === 'en' ? 'English' : 'Français'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Currency */}
                <div>
                  <label className={`block text-sm font-medium mb-3 transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Currency
                  </label>
                  <div className="flex gap-3">
                    {['CAD', 'USD'].map(cur => (
                      <button
                        key={cur}
                        onClick={() => setCurrency(cur)}
                        className={`flex-1 py-2 rounded-lg border-2 font-medium transition-all ${
                          currency === cur
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : isDark
                              ? 'border-slate-700 text-slate-300 hover:border-slate-600'
                              : 'border-slate-300 text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        {cur}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timezone */}
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={e => setTimezone(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-700 bg-slate-700 text-white' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  >
                    {CANADIAN_TIMEZONES.map(tz => (
                      <option key={tz.id} value={tz.id}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between p-4 rounded-lg border transition-colors duration-200" style={{
                  borderColor: isDark ? '#334155' : '#e2e8f0',
                  backgroundColor: isDark ? '#1e293b' : '#f8fafc'
                }}>
                  <div className="flex items-center gap-3">
                    <Palette className={`w-5 h-5 transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                    <label className={`font-medium transition-colors duration-200 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Dark Mode
                    </label>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-green-500' : 'bg-slate-300'}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Ready */}
          {step === 'ready' && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className={`text-3xl font-bold mb-3 transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                You're all set!
              </h2>
              <p className={`mb-8 transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Your GrowthOS is ready to go. Here are some quick tips to get started:
              </p>

              <div className="space-y-3 mb-8 text-left">
                <div className={`p-4 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-700 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}>
                  <p className={`font-medium transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Add your first lead
                  </p>
                  <p className={`text-sm transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Start building your pipeline with real opportunities
                  </p>
                </div>
                <div className={`p-4 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-700 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}>
                  <p className={`font-medium transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Create an estimate
                  </p>
                  <p className={`text-sm transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Send professional estimates that convert more leads
                  </p>
                </div>
                <div className={`p-4 rounded-lg border transition-colors duration-200 ${isDark ? 'border-slate-700 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}>
                  <p className={`font-medium transition-colors duration-200 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Import your contacts
                  </p>
                  <p className={`text-sm transition-colors duration-200 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Bring in your existing customers to start tracking history
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className={`flex gap-3 mt-8 pt-6 border-t transition-colors duration-200 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <button
              onClick={handleBack}
              disabled={step === 'company'}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                step === 'company'
                  ? `opacity-50 cursor-not-allowed ${isDark ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400'}`
                  : isDark
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {step === 'ready' ? (
              <button
                onClick={handleLaunch}
                className="ml-auto flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg shadow-green-500/20"
              >
                Launch GrowthOS
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="ml-auto flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg shadow-green-500/20"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
