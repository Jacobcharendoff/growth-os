'use client';

import { useState } from 'react';
import {
  Copy,
  Check,
  Eye,
  Code,
  Settings,
  FileInput,
} from 'lucide-react';

export default function LeadCapturePage() {
  const [formTitle, setFormTitle] = useState('Request a Free Estimate');
  const [buttonText, setButtonText] = useState('Get My Free Estimate');
  const [buttonColor, setButtonColor] = useState('#27AE60');
  const [successMessage, setSuccessMessage] = useState(
    'Thank you! We\'ll be in touch within 24 hours.'
  );
  const [pipelineStage, setPipelineStage] = useState('New Lead');
  const [includeFields, setIncludeFields] = useState({
    name: true,
    email: true,
    phone: false,
    address: false,
    serviceNeeded: false,
    preferredDate: false,
    message: false,
  });
  const [copied, setCopied] = useState(false);

  const toggleField = (field: keyof typeof includeFields) => {
    if (field === 'name' || field === 'email') return; // Always on
    setIncludeFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const embedCode = `<!-- GrowthOS Lead Capture Form -->
<div id="growthosForm" style="max-width: 500px; margin: 20px auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; background: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <h2 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #2c3e50;">${formTitle}</h2>
  <p style="margin: 0 0 24px; color: #666; font-size: 14px;">Enter your details and we'll be in touch shortly.</p>

  <form style="display: flex; flex-direction: column; gap: 16px;">
    <!-- Name (always included) -->
    <div>
      <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #2c3e50; font-size: 14px;">Full Name</label>
      <input type="text" required style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; box-sizing: border-box; font-family: inherit;">
    </div>

    <!-- Email (always included) -->
    <div>
      <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #2c3e50; font-size: 14px;">Email Address</label>
      <input type="email" required style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; box-sizing: border-box; font-family: inherit;">
    </div>

    ${includeFields.phone ? `
    <!-- Phone -->
    <div>
      <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #2c3e50; font-size: 14px;">Phone Number</label>
      <input type="tel" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; box-sizing: border-box; font-family: inherit;">
    </div>` : ''}

    ${includeFields.address ? `
    <!-- Address -->
    <div>
      <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #2c3e50; font-size: 14px;">Address</label>
      <input type="text" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; box-sizing: border-box; font-family: inherit;">
    </div>` : ''}

    ${includeFields.serviceNeeded ? `
    <!-- Service Needed -->
    <div>
      <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #2c3e50; font-size: 14px;">Service Needed</label>
      <select style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; box-sizing: border-box; font-family: inherit;">
        <option>Select a service...</option>
        <option>Plumbing</option>
        <option>Electrical</option>
        <option>HVAC</option>
        <option>General Repairs</option>
      </select>
    </div>` : ''}

    ${includeFields.preferredDate ? `
    <!-- Preferred Date -->
    <div>
      <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #2c3e50; font-size: 14px;">Preferred Date</label>
      <input type="date" style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; box-sizing: border-box; font-family: inherit;">
    </div>` : ''}

    ${includeFields.message ? `
    <!-- Message -->
    <div>
      <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #2c3e50; font-size: 14px;">Message</label>
      <textarea style="width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; box-sizing: border-box; font-family: inherit; min-height: 100px; resize: vertical;"></textarea>
    </div>` : ''}

    <!-- Submit Button -->
    <button type="submit" style="padding: 12px 16px; background-color: ${buttonColor}; color: white; border: none; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 8px; transition: opacity 0.2s;">
      ${buttonText}
    </button>
  </form>
</div>

<script>
document.getElementById('growthosForm')?.querySelector('form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  alert('${successMessage}');
});
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-slate-800 bg-gradient-to-r from-gray-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <FileInput className="w-8 h-8 text-[#27AE60]" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Lead Capture Form
            </h1>
          </div>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            Embed this form on your website to capture leads directly into your pipeline
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column - Configuration */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-[#27AE60]" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Configuration
                </h2>
              </div>

              <div className="space-y-5">
                {/* Form Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Form Title
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#27AE60]"
                  />
                </div>

                {/* Button Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#27AE60]"
                  />
                </div>

                {/* Button Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Button Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={buttonColor}
                      onChange={(e) => setButtonColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer border border-gray-300 dark:border-slate-700"
                    />
                    <input
                      type="text"
                      value={buttonColor}
                      onChange={(e) => setButtonColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#27AE60]"
                    />
                  </div>
                </div>

                {/* Success Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Success Message
                  </label>
                  <textarea
                    value={successMessage}
                    onChange={(e) => setSuccessMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#27AE60]"
                  />
                </div>

                {/* Pipeline Stage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Auto-assign to Pipeline Stage
                  </label>
                  <select
                    value={pipelineStage}
                    onChange={(e) => setPipelineStage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#27AE60]"
                  >
                    <option>New Lead</option>
                    <option>Contacted</option>
                    <option>Qualified</option>
                    <option>In Progress</option>
                  </select>
                </div>

                {/* Fields Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                    Form Fields
                  </label>
                  <div className="space-y-2">
                    {[
                      { key: 'name', label: 'Full Name' },
                      { key: 'email', label: 'Email Address' },
                      { key: 'phone', label: 'Phone Number' },
                      { key: 'address', label: 'Address' },
                      { key: 'serviceNeeded', label: 'Service Needed' },
                      { key: 'preferredDate', label: 'Preferred Date' },
                      { key: 'message', label: 'Message' },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            includeFields[key as keyof typeof includeFields]
                          }
                          onChange={() =>
                            toggleField(key as keyof typeof includeFields)
                          }
                          disabled={key === 'name' || key === 'email'}
                          className="w-4 h-4 rounded border-gray-300 text-[#27AE60] focus:ring-[#27AE60] disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span
                          className={`text-sm ${
                            key === 'name' || key === 'email'
                              ? 'text-gray-500 dark:text-slate-500'
                              : 'text-gray-700 dark:text-slate-300'
                          }`}
                        >
                          {label}
                          {(key === 'name' || key === 'email') && (
                            <span className="ml-1 text-gray-400 text-xs">
                              (always on)
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Live Preview */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-800 px-4 py-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Live Preview
                </span>
              </div>

              {/* Mock Browser Frame */}
              <div className="bg-gray-50 dark:bg-slate-950 p-3 sm:p-6">
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
                  {/* Browser URL Bar */}
                  <div className="bg-gray-100 dark:bg-slate-800 px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                    <p className="text-xs text-gray-600 dark:text-slate-400 font-mono">
                      https://yourwebsite.com
                    </p>
                  </div>

                  {/* Form Preview */}
                  <div className="p-3 sm:p-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {formTitle}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-6">
                      Enter your details and we'll be in touch shortly.
                    </p>

                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
                        />
                      </div>

                      {/* Phone */}
                      {includeFields.phone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
                          />
                        </div>
                      )}

                      {/* Address */}
                      {includeFields.address && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            Address
                          </label>
                          <input
                            type="text"
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
                          />
                        </div>
                      )}

                      {/* Service Needed */}
                      {includeFields.serviceNeeded && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            Service Needed
                          </label>
                          <select disabled className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm">
                            <option>Select a service...</option>
                          </select>
                        </div>
                      )}

                      {/* Preferred Date */}
                      {includeFields.preferredDate && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            Preferred Date
                          </label>
                          <input
                            type="date"
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
                          />
                        </div>
                      )}

                      {/* Message */}
                      {includeFields.message && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            Message
                          </label>
                          <textarea
                            disabled
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm"
                          />
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        disabled
                        style={{ backgroundColor: buttonColor }}
                        className="w-full py-2.5 text-white font-medium rounded-md text-sm mt-4 opacity-90"
                      >
                        {buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Embed Code Section */}
        <div className="mt-6 sm:mt-8 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-[#27AE60]" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Embed Code
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
            Copy this code and paste it into your website. This form will send submissions to your GrowthOS dashboard.
          </p>

          <div className="relative">
            <pre className="bg-gray-900 dark:bg-slate-950 text-gray-100 p-2 sm:p-4 rounded-lg overflow-x-auto text-xs leading-4 sm:leading-5 max-h-96 overflow-y-auto">
              <code className="text-[11px] sm:text-xs">{embedCode}</code>
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-[#27AE60] hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Code
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
