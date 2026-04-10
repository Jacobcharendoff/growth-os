'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { useStore } from '@/store';
import { Contact, LeadSource, ContactType } from '@/types';
import {
  Upload,
  FileSpreadsheet,
  ArrowRight,
  Check,
  AlertCircle,
  Download,
  ArrowLeft,
} from 'lucide-react';

const LEAD_SOURCES: { value: LeadSource; label: string }[] = [
  { value: 'existing_customer', label: 'Existing Customer' },
  { value: 'reactivation', label: 'Reactivation' },
  { value: 'cross_sell', label: 'Cross-Sell' },
  { value: 'referral', label: 'Referral' },
  { value: 'review', label: 'Review' },
  { value: 'neighborhood', label: 'Neighborhood' },
  { value: 'google_lsa', label: 'Google LSA' },
  { value: 'seo', label: 'SEO' },
  { value: 'gbp', label: 'Google Business' },
];

const CONTACT_TYPES: { value: ContactType; label: string }[] = [
  { value: 'customer', label: 'Customer' },
  { value: 'lead', label: 'Lead' },
];

interface ParsedRow {
  [key: string]: string;
}

interface ImportResult {
  successCount: number;
  duplicateCount: number;
  errorCount: number;
  details: { row: number; name: string; status: 'success' | 'duplicate' | 'error'; message?: string }[];
}

type Step = 'upload' | 'map' | 'results';

type FieldMapping = 'Name' | 'Email' | 'Phone' | 'Address' | 'Type' | 'Source' | 'Notes' | 'Skip';

export default function ContactsImportPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { contacts, addContact } = useStore();

  const [step, setStep] = useState<Step>('upload');
  const [csvData, setCsvData] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [fieldMappings, setFieldMappings] = useState<Record<string, FieldMapping>>({});
  const [importResults, setImportResults] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  // Parse CSV using simple string splitting with quote handling
  const parseCSV = (text: string): ParsedRow[] => {
    const lines = text.split('\n').filter((line) => line.trim());
    if (lines.length < 1) return [];

    const headers = parseCSVLine(lines[0]);
    const rows: ParsedRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const row: ParsedRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }

    return rows;
  };

  // Parse a single CSV line with quote handling
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  };

  // Auto-detect field mappings based on column names
  const autoDetectMappings = (columns: string[]): Record<string, FieldMapping> => {
    const mappings: Record<string, FieldMapping> = {};
    const nameLower = ['name', 'full name', 'contact name', 'first name last name'].map((n) => n.toLowerCase());
    const emailLower = ['email', 'email address', 'e-mail'].map((e) => e.toLowerCase());
    const phoneLower = ['phone', 'phone number', 'tel', 'mobile', 'cell'].map((p) => p.toLowerCase());
    const addressLower = ['address', 'street', 'location'].map((a) => a.toLowerCase());
    const typeLower = ['type', 'contact type', 'customer type'].map((t) => t.toLowerCase());
    const sourceLower = ['source', 'lead source', 'origin'].map((s) => s.toLowerCase());
    const notesLower = ['notes', 'comments', 'remarks', 'description'].map((n) => n.toLowerCase());

    columns.forEach((col) => {
      const colLower = col.toLowerCase();
      if (nameLower.includes(colLower)) mappings[col] = 'Name';
      else if (emailLower.includes(colLower)) mappings[col] = 'Email';
      else if (phoneLower.includes(colLower)) mappings[col] = 'Phone';
      else if (addressLower.includes(colLower)) mappings[col] = 'Address';
      else if (typeLower.includes(colLower)) mappings[col] = 'Type';
      else if (sourceLower.includes(colLower)) mappings[col] = 'Source';
      else if (notesLower.includes(colLower)) mappings[col] = 'Notes';
      else mappings[col] = 'Skip';
    });

    return mappings;
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = parseCSV(text);
        setCsvData(data);
        setFileName(file.name);

        if (data.length > 0) {
          const columns = Object.keys(data[0]);
          const mappings = autoDetectMappings(columns);
          setFieldMappings(mappings);
          setStep('map');
        }
      } catch (error) {
        alert('Error parsing CSV file. Please ensure it is a valid CSV.');
      }
    };
    reader.readAsText(file);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const data = parseCSV(text);
          setCsvData(data);
          setFileName(file.name);

          if (data.length > 0) {
            const columns = Object.keys(data[0]);
            const mappings = autoDetectMappings(columns);
            setFieldMappings(mappings);
            setStep('map');
          }
        } catch (error) {
          alert('Error parsing CSV file. Please ensure it is a valid CSV.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Download sample CSV
  const downloadSampleCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Address', 'Type', 'Source', 'Notes'];
    const sampleData = [
      ['John Doe', 'john@example.com', '(555) 123-4567', '123 Main St', 'customer', 'referral', 'Regular customer'],
      ['Jane Smith', 'jane@example.com', '(555) 234-5678', '456 Oak Ave', 'lead', 'seo', 'Found via SEO'],
    ];

    const csv =
      headers.join(',') +
      '\n' +
      sampleData.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_contacts.csv';
    a.click();
  };

  // Get preview data for Step 2
  const getPreviewData = (): ParsedRow[] => {
    return csvData.slice(0, 3);
  };

  // Map CSV row to Contact object
  const mapRowToContact = (row: ParsedRow): Omit<Contact, 'id' | 'createdAt'> | null => {
    const mapped: Record<string, string> = {};
    Object.entries(fieldMappings).forEach(([column, field]) => {
      if (field !== 'Skip') {
        mapped[field] = row[column] || '';
      }
    });

    if (!mapped['Name'] || !mapped['Name'].trim()) {
      return null;
    }

    // Normalize source
    let source: LeadSource = 'referral';
    if (mapped['Source']) {
      const sourceLower = mapped['Source'].toLowerCase().replace(/[_\s-]/g, '_');
      const validSource = LEAD_SOURCES.find(
        (s) => s.value === sourceLower || s.label.toLowerCase() === mapped['Source'].toLowerCase()
      );
      if (validSource) {
        source = validSource.value;
      }
    }

    // Normalize type
    let type: ContactType = 'lead';
    if (mapped['Type']) {
      const typeLower = mapped['Type'].toLowerCase();
      if (typeLower.includes('customer')) {
        type = 'customer';
      } else if (typeLower.includes('lead')) {
        type = 'lead';
      }
    }

    return {
      name: mapped['Name'] || '',
      email: mapped['Email'] || '',
      phone: mapped['Phone'] || '',
      address: mapped['Address'] || '',
      type,
      source,
      notes: mapped['Notes'] || '',
    };
  };

  // Execute import
  const handleImport = async () => {
    setIsImporting(true);
    setImportProgress(0);

    const results: ImportResult = {
      successCount: 0,
      duplicateCount: 0,
      errorCount: 0,
      details: [],
    };

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      const mappedContact = mapRowToContact(row);

      if (!mappedContact) {
        results.errorCount++;
        results.details.push({
          row: i + 2,
          name: row[Object.keys(fieldMappings)[0]] || 'Unknown',
          status: 'error',
          message: 'No name provided',
        });
      } else {
        // Check for duplicates (by email)
        const isDuplicate =
          mappedContact.email && contacts.some((c) => c.email === mappedContact.email);

        if (isDuplicate && mappedContact.email) {
          results.duplicateCount++;
          results.details.push({
            row: i + 2,
            name: mappedContact.name,
            status: 'duplicate',
            message: 'Email already exists',
          });
        } else {
          try {
            addContact(mappedContact);
            results.successCount++;
            results.details.push({
              row: i + 2,
              name: mappedContact.name,
              status: 'success',
            });
          } catch (error) {
            results.errorCount++;
            results.details.push({
              row: i + 2,
              name: mappedContact.name,
              status: 'error',
              message: 'Failed to import',
            });
          }
        }
      }

      setImportProgress(((i + 1) / csvData.length) * 100);
    }

    setImportResults(results);
    setStep('results');
    setIsImporting(false);
  };

  // Render Step 1: Upload
  const renderUploadStep = () => (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
          isDark
            ? 'border-slate-600 bg-slate-800/50 hover:border-green-500'
            : 'border-slate-300 bg-slate-50 hover:border-green-500'
        }`}
      >
        <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <p className={`text-lg font-medium mb-2 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
          Drag and drop your CSV file here
        </p>
        <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          or
        </p>
        <label className="inline-block">
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <span
            className="inline-block px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition cursor-pointer"
            onClick={(e) => {
              (e.currentTarget as HTMLElement).parentElement?.querySelector('input')?.click();
            }}
          >
            Browse Files
          </span>
        </label>
        <p className={`text-xs mt-4 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          Supports CSV and XLSX files
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={downloadSampleCSV}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            isDark
              ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
          }`}
        >
          <Download className="h-4 w-4" />
          Download Sample CSV
        </button>
      </div>
    </div>
  );

  // Render Step 2: Map Fields
  const renderMapStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
        {/* CSV Columns */}
        <div>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
            CSV Columns
          </h3>
          <div className="space-y-3">
            {Object.keys(fieldMappings).map((column) => (
              <div
                key={column}
                className={`p-3 rounded-lg ${
                  isDark ? 'bg-slate-700 border border-slate-600' : 'bg-slate-100 border border-slate-300'
                }`}
              >
                <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  {column}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Field Mappings */}
        <div>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
            Map to Staybookt Fields
          </h3>
          <div className="space-y-3">
            {Object.keys(fieldMappings).map((column) => (
              <select
                key={column}
                value={fieldMappings[column]}
                onChange={(e) =>
                  setFieldMappings({
                    ...fieldMappings,
                    [column]: e.target.value as FieldMapping,
                  })
                }
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isDark
                    ? 'bg-slate-700 border border-slate-600 text-slate-200'
                    : 'bg-white border border-slate-300 text-slate-900'
                }`}
              >
                <option value="Skip">Skip</option>
                <option value="Name">Name</option>
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
                <option value="Address">Address</option>
                <option value="Type">Type</option>
                <option value="Source">Source</option>
                <option value="Notes">Notes</option>
              </select>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div>
        <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
          Preview (First 3 Rows)
        </h3>
        <div className="overflow-x-auto">
          <table
            className={`w-full text-sm ${
              isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-300'
            }`}
          >
            <thead>
              <tr className={isDark ? 'bg-slate-700 border-b border-slate-600' : 'bg-slate-100 border-b border-slate-300'}>
                <th className={`px-3 py-2 text-left font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  Name
                </th>
                <th className={`px-3 py-2 text-left font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  Email
                </th>
                <th className={`px-3 py-2 text-left font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  Phone
                </th>
                <th className={`px-3 py-2 text-left font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              {getPreviewData().map((row, idx) => {
                const mapped = mapRowToContact(row);
                return (
                  <tr
                    key={idx}
                    className={`border-t ${isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-300 hover:bg-slate-50'}`}
                  >
                    <td className={`px-3 py-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {mapped?.name || '-'}
                    </td>
                    <td className={`px-3 py-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {mapped?.email || '-'}
                    </td>
                    <td className={`px-3 py-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {mapped?.phone || '-'}
                    </td>
                    <td className={`px-3 py-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {mapped?.type || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
        <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
          <strong>Total rows:</strong> {csvData.length}
        </p>
      </div>
    </div>
  );

  // Render Step 3: Results
  const renderResultsStep = () => {
    if (!importResults) return null;

    return (
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="w-full bg-slate-300 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: '100%' }}
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
            <div className="flex items-center gap-3">
              <Check className={`h-8 w-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-green-200' : 'text-green-800'}`}>
                  Imported
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-green-100' : 'text-green-900'}`}>
                  {importResults.successCount}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className="flex items-center gap-3">
              <AlertCircle className={`h-8 w-8 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-yellow-200' : 'text-yellow-800'}`}>
                  Duplicates
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-yellow-100' : 'text-yellow-900'}`}>
                  {importResults.duplicateCount}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-3">
              <AlertCircle className={`h-8 w-8 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-red-200' : 'text-red-800'}`}>
                  Errors
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-red-100' : 'text-red-900'}`}>
                  {importResults.errorCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Table */}
        {importResults.details.length > 0 && (
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              Import Details
            </h3>
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table
                className={`w-full text-sm ${
                  isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-300'
                }`}
              >
                <thead>
                  <tr className={isDark ? 'bg-slate-700 border-b border-slate-600 sticky top-0' : 'bg-slate-100 border-b border-slate-300 sticky top-0'}>
                    <th className={`px-3 py-2 text-left font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                      Row
                    </th>
                    <th className={`px-3 py-2 text-left font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                      Name
                    </th>
                    <th className={`px-3 py-2 text-left font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                      Status
                    </th>
                    <th className={`px-3 py-2 text-left font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {importResults.details.map((detail, idx) => (
                    <tr
                      key={idx}
                      className={`border-t ${isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-300 hover:bg-slate-50'}`}
                    >
                      <td className={`px-3 py-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {detail.row}
                      </td>
                      <td className={`px-3 py-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {detail.name}
                      </td>
                      <td className="px-3 py-2">
                        {detail.status === 'success' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                            <Check className="h-3 w-3" /> Success
                          </span>
                        )}
                        {detail.status === 'duplicate' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                            <AlertCircle className="h-3 w-3" /> Duplicate
                          </span>
                        )}
                        {detail.status === 'error' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                            <AlertCircle className="h-3 w-3" /> Error
                          </span>
                        )}
                      </td>
                      <td className={`px-3 py-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {detail.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/contacts')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-6 font-medium transition ${
              isDark
                ? 'text-slate-300 hover:bg-slate-800'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contacts
          </button>

          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className={`text-xl sm:text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Import Contacts
              </h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Step {step === 'upload' ? 1 : step === 'map' ? 2 : 3} of 3
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex items-center gap-4 mb-8">
          {(['upload', 'map', 'results'] as const).map((s, idx) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition ${
                  step === s
                    ? isDark
                      ? 'bg-green-600 text-white'
                      : 'bg-green-600 text-white'
                    : step === 'results' || (step === 'map' && s !== 'upload') || (step === 'upload' && s === 'upload')
                      ? isDark
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-300 text-slate-600'
                      : isDark
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-green-100 text-green-700'
                }`}
              >
                {step === s || (step === 'results' && s === 'results') ? (
                  ['upload', 'map', 'results'].indexOf(step) >= idx ? (
                    step === s ? (
                      <span>{idx + 1}</span>
                    ) : (
                      <Check className="h-4 w-4" />
                    )
                  ) : (
                    <span>{idx + 1}</span>
                  )
                ) : ['upload', 'map', 'results'].indexOf(step) > idx ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              {idx < 2 && (
                <div
                  className={`w-12 h-1 mx-2 rounded transition ${
                    ['upload', 'map', 'results'].indexOf(step) > idx
                      ? 'bg-green-600'
                      : isDark
                        ? 'bg-slate-700'
                        : 'bg-slate-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div
          className={`rounded-lg p-4 sm:p-8 ${
            isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
          }`}
        >
          {step === 'upload' && renderUploadStep()}
          {step === 'map' && renderMapStep()}
          {step === 'results' && renderResultsStep()}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          {step === 'map' && (
            <>
              <button
                onClick={() => setStep('upload')}
                className={`flex-1 px-4 sm:px-6 py-3 rounded-lg font-medium transition ${
                  isDark
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                }`}
              >
                Back
              </button>
              <button
                onClick={handleImport}
                disabled={isImporting}
                className="flex-1 px-4 sm:px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isImporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    Import Contacts
                  </>
                )}
              </button>
            </>
          )}

          {step === 'results' && (
            <>
              <button
                onClick={() => router.push('/contacts')}
                className="flex-1 px-4 sm:px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
              >
                View Contacts
              </button>
              <button
                onClick={() => {
                  setCsvData([]);
                  setFieldMappings({});
                  setImportResults(null);
                  setFileName('');
                  setStep('upload');
                }}
                className={`flex-1 px-4 sm:px-6 py-3 rounded-lg font-medium transition ${
                  isDark
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                }`}
              >
                Import More
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
