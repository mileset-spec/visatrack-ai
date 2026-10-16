/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { storage } from './services/storage';
import {
  ActiveTab,
  VisaApplication,
  DocumentItem,
  UserProfile,
  ChatMessage,
  ChecklistItem,
  PassportData,
} from './types';
import { AndroidFrame } from './components/AndroidFrame';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { MyApplicationsScreen } from './components/screens/MyApplicationsScreen';
import { ApplicationWizard } from './components/screens/ApplicationWizard';
import { ApplicationDetail } from './components/screens/ApplicationDetail';
import { DocumentsScreen } from './components/screens/DocumentsScreen';
import { PassportScanner } from './components/screens/PassportScanner';
import { AIAssistantScreen } from './components/screens/AIAssistantScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { DocumentViewerModal } from './components/modals/DocumentViewerModal';
import { UploadDocModal } from './components/modals/UploadDocModal';
import { HelpCircle, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeSubView, setActiveSubView] = useState<
    'none' | 'wizard' | 'application_detail' | 'passport_scanner'
  >('none');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // Core Data State
  const [applications, setApplications] = useState<VisaApplication[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(storage.getUserProfile());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [viewMode, setViewMode] = useState<'mobile_frame' | 'responsive'>('mobile_frame');

  // Modals
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [uploadModalTarget, setUploadModalTarget] = useState<{
    checklistItem?: ChecklistItem | null;
    applicationId?: string;
    applicationTitle?: string;
  } | null>(null);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    setApplications(storage.getApplications());
    setDocuments(storage.getDocuments());
    setUserProfile(storage.getUserProfile());
    setChatMessages(storage.getChatMessages());
    setViewMode(storage.getViewMode());
  }, []);

  // Update applications
  const handleUpdateApplication = (updatedApp: VisaApplication) => {
    storage.saveApplication(updatedApp);
    setApplications(storage.getApplications());
  };

  // Add new application from wizard
  const handleCompleteWizard = (newApp: VisaApplication) => {
    storage.saveApplication(newApp);
    setApplications(storage.getApplications());
    setSelectedAppId(newApp.id);
    setActiveSubView('application_detail');
  };

  // Delete application
  const handleDeleteApplication = (appId: string) => {
    if (confirm('Are you sure you want to remove this visa application dossier?')) {
      storage.deleteApplication(appId);
      setApplications(storage.getApplications());
      if (selectedAppId === appId) {
        setSelectedAppId(null);
        setActiveSubView('none');
      }
    }
  };

  // Reset all data to sample
  const handleResetData = () => {
    storage.resetAllData();
    setApplications(storage.getApplications());
    setDocuments(storage.getDocuments());
    setUserProfile(storage.getUserProfile());
    setChatMessages(storage.getChatMessages());
    setSelectedAppId(null);
    setActiveSubView('none');
    setActiveTab('home');
  };

  // Handle uploaded document (from modal)
  const handleSaveUploadedDocument = (doc: DocumentItem, targetChecklistId?: string) => {
    storage.addDocument(doc);
    setDocuments(storage.getDocuments());

    // If linked to a checklist item on an application, update that checklist item
    if (targetChecklistId && selectedAppId) {
      const targetApp = applications.find((a) => a.id === selectedAppId);
      if (targetApp) {
        const updatedChecklist = targetApp.checklist.map((item) => {
          if (item.id === targetChecklistId) {
            return {
              ...item,
              isCompleted: true,
              documentId: doc.id,
              documentName: doc.name,
              documentUrl: doc.dataUrl,
              uploadedAt: doc.uploadDate,
              notes: doc.notes || item.notes,
              status: 'verified' as const,
            };
          }
          return item;
        });

        handleUpdateApplication({
          ...targetApp,
          checklist: updatedChecklist,
        });
      }
    }
  };

  // Delete document
  const handleDeleteDocument = (docId: string) => {
    if (confirm('Delete this document from your library?')) {
      storage.deleteDocument(docId);
      setDocuments(storage.getDocuments());
    }
  };

  // Save confirmed passport scan
  const handleSavePassport = (passport: PassportData) => {
    storage.updatePassportData(passport);
    setUserProfile(storage.getUserProfile());
  };

  // Chat message send
  const handleSendMessage = (msg: ChatMessage) => {
    const updated = [...chatMessages, msg];
    setChatMessages(updated);
    storage.saveChatMessages(updated);
  };

  // Reset chat
  const handleClearChat = () => {
    storage.saveChatMessages([]);
    setChatMessages(storage.getChatMessages());
  };

  // View mode toggle
  const handleToggleViewMode = (mode: 'mobile_frame' | 'responsive') => {
    setViewMode(mode);
    storage.setViewMode(mode);
  };

  // Sub-view navigation
  const selectedApp = applications.find((a) => a.id === selectedAppId);

  const getScreenTitle = () => {
    if (activeSubView === 'wizard') return 'Create Visa Application';
    if (activeSubView === 'application_detail') {
      return selectedApp ? `${selectedApp.destination} Application` : 'Application Checklist';
    }
    if (activeSubView === 'passport_scanner') return 'Biometric Passport Scan';

    switch (activeTab) {
      case 'home':
        return 'VisaTrack AI';
      case 'applications':
        return 'My Applications';
      case 'documents':
        return 'Document Library';
      case 'assistant':
        return 'VisaTrack AI Assistant';
      case 'profile':
        return 'Applicant Profile';
      default:
        return 'VisaTrack AI';
    }
  };

  return (
    <AndroidFrame viewMode={viewMode} onToggleViewMode={handleToggleViewMode}>
      {/* Top App Bar */}
      <TopBar
        title={getScreenTitle()}
        showBack={activeSubView !== 'none'}
        onBack={() => {
          setActiveSubView('none');
          setSelectedAppId(null);
        }}
        onOpenHelp={() => setShowHelpModal(true)}
      />

      {/* Main Screen Router */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        {/* SUBVIEWS */}
        {activeSubView === 'wizard' ? (
          <ApplicationWizard
            onComplete={handleCompleteWizard}
            onCancel={() => setActiveSubView('none')}
          />
        ) : activeSubView === 'application_detail' && selectedApp ? (
          <ApplicationDetail
            application={selectedApp}
            onUpdateApplication={handleUpdateApplication}
            onUploadDocumentForItem={(item) =>
              setUploadModalTarget({
                checklistItem: item,
                applicationId: selectedApp.id,
                applicationTitle: `${selectedApp.destination} (${selectedApp.visaCategory})`,
              })
            }
            onViewDocument={(item) => {
              const matchedDoc = documents.find((d) => d.name === item.documentName);
              if (matchedDoc) {
                setPreviewDoc(matchedDoc);
              } else {
                setPreviewDoc({
                  id: item.id,
                  category: item.category,
                  name: item.documentName || item.title,
                  fileType: 'PDF Document',
                  sizeBytes: 1200000,
                  uploadDate: item.uploadedAt || '2026-10-12',
                  notes: item.notes,
                  isSample: true,
                });
              }
            }}
            onBack={() => {
              setActiveSubView('none');
              setSelectedAppId(null);
            }}
          />
        ) : activeSubView === 'passport_scanner' ? (
          <PassportScanner
            currentPassport={userProfile.passportData}
            onSavePassport={handleSavePassport}
            onClose={() => setActiveSubView('none')}
          />
        ) : (
          /* BOTTOM TAB VIEWS */
          <>
            {activeTab === 'home' && (
              <HomeScreen
                userProfile={userProfile}
                applications={applications}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenApplication={(appId) => {
                  setSelectedAppId(appId);
                  setActiveSubView('application_detail');
                }}
                onStartNewApplication={() => setActiveSubView('wizard')}
                onStartPassportScan={() => setActiveSubView('passport_scanner')}
                onLoadSampleApplication={handleResetData}
              />
            )}

            {activeTab === 'applications' && (
              <MyApplicationsScreen
                applications={applications}
                onOpenApplication={(appId) => {
                  setSelectedAppId(appId);
                  setActiveSubView('application_detail');
                }}
                onStartNewApplication={() => setActiveSubView('wizard')}
                onDeleteApplication={handleDeleteApplication}
                onLoadSampleApplication={handleResetData}
              />
            )}

            {activeTab === 'documents' && (
              <DocumentsScreen
                documents={documents}
                onOpenUploadModal={() =>
                  setUploadModalTarget({
                    applicationId: applications[0]?.id,
                    applicationTitle: applications[0]
                      ? `${applications[0].destination} (${applications[0].visaCategory})`
                      : 'General Vault',
                  })
                }
                onPreviewDocument={(doc) => setPreviewDoc(doc)}
                onDeleteDocument={handleDeleteDocument}
              />
            )}

            {activeTab === 'assistant' && (
              <AIAssistantScreen
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onClearHistory={handleClearChat}
                activeApplication={selectedApp || applications[0]}
                documents={documents}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileScreen
                profile={userProfile}
                onUpdateProfile={(p) => {
                  storage.saveUserProfile(p);
                  setUserProfile(p);
                }}
                onScanPassport={() => setActiveSubView('passport_scanner')}
                onResetAllData={handleResetData}
              />
            )}
          </>
        )}
      </div>

      {/* 5-Item Bottom Navigation Bar (Shown on main tab views) */}
      {activeSubView === 'none' && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          applicationsCount={applications.length}
        />
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <DocumentViewerModal
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
          onReplace={() => {
            const docToReplace = previewDoc;
            setPreviewDoc(null);
            setUploadModalTarget({
              applicationId: docToReplace.applicationId,
              applicationTitle: docToReplace.applicationTitle,
            });
          }}
        />
      )}

      {/* Upload Document Modal */}
      {uploadModalTarget && (
        <UploadDocModal
          checklistItem={uploadModalTarget.checklistItem}
          applicationId={uploadModalTarget.applicationId}
          applicationTitle={uploadModalTarget.applicationTitle}
          onSave={handleSaveUploadedDocument}
          onClose={() => setUploadModalTarget(null)}
        />
      )}

      {/* Help & Information Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#126B68]/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#126B68]" />
                <h3 className="text-sm font-bold text-[#172B3A]">
                  About VisaTrack AI
                </h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-[#697A86] hover:text-[#172B3A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#172B3A]">
              <p>
                <strong>VisaTrack AI</strong> is a mobile-first visa preparation assistant designed for Nigerian and international travelers applying to Canada, the United Kingdom, and the Schengen Area.
              </p>
              <div className="bg-[#DFF4ED]/60 p-3 rounded-2xl border border-[#126B68]/15 space-y-1">
                <span className="font-bold text-[#126B68] block">Key Capabilities:</span>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  <li>Destination checklist generator with stamping requirements</li>
                  <li>Biometric passport OCR capture & validation</li>
                  <li>Preparation milestone tracker (Created to Decision)</li>
                  <li>AI Assistant powered by Gemini 3.8 Flash</li>
                </ul>
              </div>
              <p className="text-[11px] text-[#697A86] leading-relaxed">
                <strong>Disclaimer:</strong> VisaTrack AI provides organizational assistance and checklist management. It does not issue visas, guarantee consular decisions, or retrieve live confidential embassy records.
              </p>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full h-11 bg-[#126B68] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#0D4E4C]"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </AndroidFrame>
  );
}
