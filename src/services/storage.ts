import { VisaApplication, DocumentItem, UserProfile, PassportData, ChatMessage } from '../types';
import { INITIAL_APPLICATIONS, INITIAL_DOCUMENTS, INITIAL_USER_PROFILE } from '../data/defaultData';

const KEYS = {
  APPLICATIONS: 'visatrack_applications_v1',
  DOCUMENTS: 'visatrack_documents_v1',
  USER_PROFILE: 'visatrack_profile_v1',
  CHAT_MESSAGES: 'visatrack_chat_history_v1',
  VIEW_MODE: 'visatrack_view_mode_v1',
};

export const storage = {
  // Applications
  getApplications(): VisaApplication[] {
    try {
      const data = localStorage.getItem(KEYS.APPLICATIONS);
      if (!data) {
        localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
        return INITIAL_APPLICATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_APPLICATIONS;
    }
  },

  saveApplications(applications: VisaApplication[]): void {
    try {
      localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch (err) {
      console.error('Failed to save applications to localStorage:', err);
    }
  },

  getApplicationById(id: string): VisaApplication | undefined {
    const list = this.getApplications();
    return list.find((a) => a.id === id);
  },

  saveApplication(app: VisaApplication): void {
    const list = this.getApplications();
    const index = list.findIndex((a) => a.id === app.id);
    if (index >= 0) {
      list[index] = { ...app, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(app);
    }
    this.saveApplications(list);
  },

  deleteApplication(id: string): void {
    const list = this.getApplications().filter((a) => a.id !== id);
    this.saveApplications(list);
  },

  // Documents
  getDocuments(): DocumentItem[] {
    try {
      const data = localStorage.getItem(KEYS.DOCUMENTS);
      if (!data) {
        localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
        return INITIAL_DOCUMENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DOCUMENTS;
    }
  },

  saveDocuments(documents: DocumentItem[]): void {
    try {
      localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(documents));
    } catch (err) {
      console.error('Failed to save documents to localStorage:', err);
    }
  },

  addDocument(doc: DocumentItem): void {
    const list = this.getDocuments();
    list.unshift(doc);
    this.saveDocuments(list);
  },

  deleteDocument(id: string): void {
    const list = this.getDocuments().filter((d) => d.id !== id);
    this.saveDocuments(list);
  },

  // User Profiles & Multi-User Sessions
  getAllProfiles(): UserProfile[] {
    try {
      const data = localStorage.getItem('visatrack_all_profiles_v1');
      if (!data) {
        localStorage.setItem('visatrack_all_profiles_v1', JSON.stringify([INITIAL_USER_PROFILE]));
        return [INITIAL_USER_PROFILE];
      }
      return JSON.parse(data);
    } catch {
      return [INITIAL_USER_PROFILE];
    }
  },

  saveAllProfiles(profiles: UserProfile[]): void {
    try {
      localStorage.setItem('visatrack_all_profiles_v1', JSON.stringify(profiles));
    } catch (err) {
      console.error(err);
    }
  },

  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.USER_PROFILE);
      if (!data) {
        localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
        return INITIAL_USER_PROFILE;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_USER_PROFILE;
    }
  },

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
      // Also update in all profiles
      const all = this.getAllProfiles();
      const idx = all.findIndex((p) => p.id === profile.id);
      if (idx >= 0) {
        all[idx] = profile;
      } else {
        all.unshift(profile);
      }
      this.saveAllProfiles(all);
    } catch (err) {
      console.error('Failed to save profile to localStorage:', err);
    }
  },

  signInUser(profile: UserProfile): void {
    const active = { ...profile, isSignedIn: true, lastLoginAt: new Date().toISOString() };
    this.saveUserProfile(active);
  },

  signOutUser(): void {
    const current = this.getUserProfile();
    current.isSignedIn = false;
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(current));
    const all = this.getAllProfiles();
    const idx = all.findIndex((p) => p.id === current.id);
    if (idx >= 0) {
      all[idx].isSignedIn = false;
      this.saveAllProfiles(all);
    }
  },

  updatePassportData(passport: PassportData): void {
    const profile = this.getUserProfile();
    profile.passportData = passport;
    this.saveUserProfile(profile);
  },

  // Chat History
  getChatMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(KEYS.CHAT_MESSAGES);
      if (!data) {
        const welcomeChat: ChatMessage[] = [
          {
            id: 'msg-welcome-0',
            sender: 'ai',
            text: 'Hello Amaka! Welcome to VisaTrack AI. I am your specialized visa preparation assistant for international travel.\n\nWhether you are preparing a **UK Standard Visitor Visa**, a **Canada TRV**, or a **Schengen Visa**, I can help you verify documentation rules, explain bank statement standards, and ensure your checklist is solid.\n\nHow can I assist your visa journey today?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isDemo: false,
          },
        ];
        localStorage.setItem(KEYS.CHAT_MESSAGES, JSON.stringify(welcomeChat));
        return welcomeChat;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveChatMessages(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(KEYS.CHAT_MESSAGES, JSON.stringify(messages));
    } catch (err) {
      console.error('Failed to save chat messages:', err);
    }
  },

  // View Mode ('mobile_frame' | 'responsive')
  getViewMode(): 'mobile_frame' | 'responsive' {
    try {
      return (localStorage.getItem(KEYS.VIEW_MODE) as any) || 'mobile_frame';
    } catch {
      return 'mobile_frame';
    }
  },

  setViewMode(mode: 'mobile_frame' | 'responsive'): void {
    try {
      localStorage.setItem(KEYS.VIEW_MODE, mode);
    } catch (err) {
      console.error(err);
    }
  },

  // Reset to initial prototype state
  resetAllData(): void {
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
    localStorage.removeItem(KEYS.CHAT_MESSAGES);
  },
};
