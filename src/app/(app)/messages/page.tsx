'use client';

import { useState } from 'react';
import {
  Search,
  Send,
  Edit3,
  MessageSquare,
  Mail,
  Zap,
  Copy,
  Eye,
  CheckCheck,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';

interface Message {
  id: string;
  contactName: string;
  contactId: string;
  preview: string;
  timestamp: string;
  type: 'SMS' | 'Email';
  status: 'Sent' | 'Delivered' | 'Read' | 'Failed';
  fullContent: string;
  recipient: string;
}

interface Template {
  id: string;
  title: string;
  preview: string;
  content: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    contactName: 'John Smith',
    contactId: '1',
    preview: 'Your appointment is confirmed for tomorrow at 2:00 PM',
    timestamp: '2 mins ago',
    type: 'SMS',
    status: 'Delivered',
    fullContent:
      'Hi John, your appointment is confirmed for tomorrow at 2:00 PM with our service team. Please be ready 15 mins before. Reply CONFIRM or call us if you have questions.',
    recipient: '(555) 123-4567',
  },
  {
    id: '2',
    contactName: 'Sarah Johnson',
    contactId: '2',
    preview: 'Your estimate for HVAC maintenance is ready to review',
    timestamp: '1 hour ago',
    type: 'Email',
    status: 'Read',
    fullContent:
      'Hi Sarah,\n\nYour estimate for HVAC maintenance is ready for your review. The total cost is $1,250 for a full system inspection and cleaning.\n\nPlease review and let us know if you have any questions.\n\nBest regards,\nGrowth OS Team',
    recipient: 'sarah.j@email.com',
  },
  {
    id: '3',
    contactName: 'Mike Davis',
    contactId: '3',
    preview: 'Thank you for choosing us! Would you mind leaving a review?',
    timestamp: '3 hours ago',
    type: 'SMS',
    status: 'Delivered',
    fullContent:
      'Hi Mike, thank you for choosing us for your plumbing needs! We\'d love your feedback. Please leave a review on Google - it helps us serve you better.',
    recipient: '(555) 456-7890',
  },
  {
    id: '4',
    contactName: 'Emily Brown',
    contactId: '4',
    preview: 'Your invoice #2024-001 for $2,500 is due on Mar 28',
    timestamp: '5 hours ago',
    type: 'Email',
    status: 'Delivered',
    fullContent:
      'Hi Emily,\n\nThis is a reminder that your invoice #2024-001 for $2,500 is due on March 28, 2026.\n\nPlease remit payment at your earliest convenience. You can pay online at [payment link].\n\nThank you!',
    recipient: 'emily@company.com',
  },
  {
    id: '5',
    contactName: 'Robert Wilson',
    contactId: '5',
    preview: 'Your technician Tom is on the way! ETA: 2:30 PM',
    timestamp: '6 hours ago',
    type: 'SMS',
    status: 'Read',
    fullContent:
      'Hi Robert, your technician Tom is on the way to your home! Expected arrival time is 2:30 PM. You can track his location here: [link]',
    recipient: '(555) 789-0123',
  },
  {
    id: '6',
    contactName: 'Jessica Lee',
    contactId: '6',
    preview: 'It\'s time for your annual air filter replacement!',
    timestamp: '1 day ago',
    type: 'Email',
    status: 'Read',
    fullContent:
      'Hi Jessica,\n\nIt\'s time for your annual HVAC air filter replacement! Fresh filters keep your system running efficiently and improve air quality.\n\nSpecial offer: Schedule this month and receive 15% off your next service.\n\nLet us know when you\'d like to schedule.',
    recipient: 'jessica.lee@email.com',
  },
  {
    id: '7',
    contactName: 'David Martinez',
    contactId: '7',
    preview: 'Appointment reminder: Tomorrow at 10:00 AM',
    timestamp: '1 day ago',
    type: 'SMS',
    status: 'Delivered',
    fullContent:
      'Hi David, reminder: your appointment is tomorrow at 10:00 AM. We\'ll be at 123 Main St. Please have access ready. Questions? Call us.',
    recipient: '(555) 234-5678',
  },
  {
    id: '8',
    contactName: 'Lisa Anderson',
    contactId: '8',
    preview: 'We missed you! Come back for 20% off your next service',
    timestamp: '2 days ago',
    type: 'Email',
    status: 'Delivered',
    fullContent:
      'Hi Lisa,\n\nWe haven\'t heard from you in a while! We miss serving you. As a valued customer, enjoy 20% off your next service.\n\nThis offer expires March 31, 2026.\n\nWe look forward to seeing you soon!',
    recipient: 'lisa.anderson@email.com',
  },
  {
    id: '9',
    contactName: 'James Taylor',
    contactId: '9',
    preview: 'Work completed! Please review our service quality',
    timestamp: '2 days ago',
    type: 'SMS',
    status: 'Failed',
    fullContent:
      'Hi James, your plumbing job is now complete! We\'d appreciate your feedback on our service. Rate us on Google.',
    recipient: '(555) 345-6789',
  },
  {
    id: '10',
    contactName: 'Amanda White',
    contactId: '10',
    preview: 'Spring maintenance special: HVAC tune-up at 25% off',
    timestamp: '3 days ago',
    type: 'Email',
    status: 'Delivered',
    fullContent:
      'Hi Amanda,\n\nSpring is here! Prepare your HVAC system for the warm season with our special tune-up service at 25% off.\n\nThis limited-time offer includes:\n- System inspection\n- Filter replacement\n- Performance optimization\n\nBook today!',
    recipient: 'amanda.white@email.com',
  },
  {
    id: '11',
    contactName: 'Christopher Lee',
    contactId: '11',
    preview: 'Thank you for your payment! Receipt attached',
    timestamp: '4 days ago',
    type: 'Email',
    status: 'Read',
    fullContent:
      'Hi Christopher,\n\nThank you for your payment of $1,750! Your invoice has been marked as paid.\n\nReceipt details:\nInvoice #: 2024-087\nAmount: $1,750\nDate: Mar 24, 2026\n\nThank you for your business!',
    recipient: 'christopher@company.com',
  },
  {
    id: '12',
    contactName: 'Nicole Harris',
    contactId: '12',
    preview: 'Your estimate is expiring in 2 days. Act now!',
    timestamp: '4 days ago',
    type: 'SMS',
    status: 'Delivered',
    fullContent:
      'Hi Nicole, your estimate for electrical work expires in 2 days. The quote was $3,200. Approve now to lock in the price!',
    recipient: '(555) 456-7891',
  },
];

const TEMPLATES: Template[] = [
  {
    id: 'apt-confirm',
    title: 'Appointment Confirmation',
    preview: 'Hi {name}, your appointment is confirmed for {date} at {time}...',
    content:
      'Hi {name}, your appointment is confirmed for {date} at {time}. Please be ready 15 minutes before. Call if you have questions.',
  },
  {
    id: 'est-sent',
    title: 'Estimate Sent',
    preview: 'Hi {name}, your estimate for {service} is ready to review...',
    content:
      'Hi {name}, your estimate for {service} is ready for your review. Total cost: ${amount}. Please let us know if you have questions.',
  },
  {
    id: 'review-req',
    title: 'Review Request',
    preview: 'Hi {name}, thank you for choosing us! Would you mind leaving a review?...',
    content:
      'Hi {name}, thank you for choosing us! We\'d love your feedback. Please leave a review on Google - it helps us serve you better.',
  },
  {
    id: 'payment-reminder',
    title: 'Payment Reminder',
    preview: 'Hi {name}, your invoice #{number} for ${amount} is due on {date}...',
    content:
      'Hi {name}, your invoice #{number} for ${amount} is due on {date}. Please remit payment at your earliest convenience.',
  },
  {
    id: 'on-way',
    title: 'On My Way',
    preview: 'Hi {name}, your technician {tech} is on the way! ETA: {time}...',
    content:
      'Hi {name}, your technician {tech} is on the way! Expected arrival time is {time}. You can track his location here: [link]',
  },
  {
    id: 'seasonal',
    title: 'Seasonal Promo',
    preview: 'Hi {name}, it\'s time for your annual {service} maintenance...',
    content:
      'Hi {name}, it\'s time for your annual {service} maintenance! Special offer: Schedule this month and receive 15% off.',
  },
];

type FilterTab = 'all' | 'sms' | 'email' | 'automated' | 'templates';

export default function MessagesPage() {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(MOCK_MESSAGES[0]?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [composeMode, setComposeMode] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    type: 'SMS' as 'SMS' | 'Email',
    subject: '',
    message: '',
    selectedTemplate: '',
  });

  const selectedMessage = MOCK_MESSAGES.find((m) => m.id === selectedMessageId);

  const filteredMessages = MOCK_MESSAGES.filter((msg) => {
    const matchesSearch =
      msg.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.preview.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'sms') return matchesSearch && msg.type === 'SMS';
    if (activeFilter === 'email') return matchesSearch && msg.type === 'Email';
    if (activeFilter === 'automated') return matchesSearch;
    return matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Sent':
        return <Send className="w-4 h-4 text-slate-500" />;
      case 'Delivered':
        return <CheckCheck className="w-4 h-4 text-blue-600" />;
      case 'Read':
        return <Eye className="w-4 h-4 text-green-600" />;
      case 'Failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent':
        return 'bg-slate-100 text-slate-700';
      case 'Delivered':
        return 'bg-blue-100 text-blue-700';
      case 'Read':
        return 'bg-green-100 text-green-700';
      case 'Failed':
        return 'bg-red-100 text-red-700';
      default:
        return '';
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Left Sidebar - Filters */}
      <div className="hidden lg:flex lg:w-56 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <button
            onClick={() => {
              setComposeMode(true);
              setActiveFilter('all');
            }}
            className="w-full flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <Edit3 className="w-4 h-4" />
            Compose
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="p-3 space-y-1">
            {[
              { id: 'all', label: 'All Messages', icon: MessageSquare },
              { id: 'sms', label: 'SMS', icon: Send },
              { id: 'email', label: 'Email', icon: Mail },
              { id: 'automated', label: 'Automated', icon: Zap },
              { id: 'templates', label: 'Templates', icon: Copy },
            ].map((filter) => {
              const IconComponent = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => {
                    setActiveFilter(filter.id as FilterTab);
                    setComposeMode(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                    activeFilter === filter.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {filter.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Center Panel - Message List OR Templates */}
        <div className="w-full lg:w-96 border-r border-slate-200 flex flex-col bg-white lg:border-r-4">
          {/* Search Bar */}
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Templates Grid */}
          {activeFilter === 'templates' ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer"
                >
                  <p className="font-medium text-sm text-slate-900 mb-1">{template.title}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">{template.preview}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setComposeData((prev) => ({
                          ...prev,
                          message: template.content,
                          selectedTemplate: template.id,
                        }));
                        setComposeMode(true);
                      }}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Use Template
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <Edit3 className="w-3 h-3 text-slate-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => {
                    setSelectedMessageId(message.id);
                    setComposeMode(false);
                  }}
                  className={`w-full px-4 py-3 border-b border-slate-100 text-left hover:bg-slate-50 transition-colors ${
                    selectedMessageId === message.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-sm text-slate-900 truncate">
                      {message.contactName}
                    </p>
                    <span className="text-xs text-slate-500">{message.timestamp}</span>
                  </div>
                  <p className="text-sm text-slate-600 truncate mb-2">{message.preview}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        message.type === 'SMS'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {message.type}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(
                        message.status
                      )}`}
                    >
                      {getStatusIcon(message.status)}
                      {message.status}
                    </span>
                  </div>
                </button>
              ))}

              {filteredMessages.length === 0 && (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No messages found</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Message Detail OR Compose */}
        <div className="flex-1 flex flex-col bg-white">
          {composeMode ? (
            <div className="flex flex-col h-full">
              {/* Compose Header */}
              <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Compose Message</h2>
                <button
                  onClick={() => setComposeMode(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Compose Form */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 space-y-5">
                {/* To Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">To</label>
                  <input
                    type="text"
                    placeholder="Search contact..."
                    value={composeData.to}
                    onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Type Toggle */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                  <div className="flex gap-3">
                    {(['SMS', 'Email'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setComposeData({ ...composeData, type })}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                          composeData.type === type
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject (Email only) */}
                {composeData.type === 'Email' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="Email subject..."
                      value={composeData.subject}
                      onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Template Selector */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Template
                  </label>
                  <select
                    value={composeData.selectedTemplate}
                    onChange={(e) => {
                      const template = TEMPLATES.find((t) => t.id === e.target.value);
                      if (template) {
                        setComposeData((prev) => ({
                          ...prev,
                          selectedTemplate: e.target.value,
                          message: template.content,
                        }));
                      }
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a template...</option>
                    {TEMPLATES.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea
                    value={composeData.message}
                    onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                    placeholder="Type your message..."
                    rows={10}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  {composeData.type === 'SMS' && (
                    <p className="text-xs text-slate-500 mt-2">
                      {composeData.message.length} / 160 characters
                    </p>
                  )}
                </div>
              </div>

              {/* Compose Actions */}
              <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-slate-200 flex gap-4">
                <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Send Message
                </button>
                <button
                  onClick={() => setComposeMode(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : selectedMessage ? (
            <div className="flex flex-col h-full">
              {/* Message Header */}
              <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {selectedMessage.contactName}
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">{selectedMessage.recipient}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 mb-2">{selectedMessage.timestamp}</p>
                    <div className="flex gap-2 justify-end">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full ${
                          selectedMessage.type === 'SMS'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {selectedMessage.type}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full ${getStatusColor(
                          selectedMessage.status
                        )}`}
                      >
                        {getStatusIcon(selectedMessage.status)}
                        {selectedMessage.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <p className="text-slate-900 whitespace-pre-wrap">
                    {selectedMessage.fullContent}
                  </p>
                </div>
              </div>

              {/* Message Actions */}
              <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-slate-200 flex gap-4">
                <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Reply
                </button>
                <button className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium flex items-center justify-center gap-2">
                  <Copy className="w-4 h-4" />
                  Forward
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg font-medium">No message selected</p>
                <p className="text-slate-500 text-sm mt-1">Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
