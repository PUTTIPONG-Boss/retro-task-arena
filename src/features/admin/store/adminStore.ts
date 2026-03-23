import { create } from 'zustand';
import { AdminProfile } from '../types';

interface AdminState {
  admin: AdminProfile | null;
  setAdmin: (admin: AdminProfile) => void;
  clearAdmin: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  admin: null,
  
  // เรียกใช้ตอน Admin Login สำเร็จ
  setAdmin: (admin) => set({ admin }),
  
  // เรียกใช้ตอน Admin Logout
  clearAdmin: () => set({ admin: null })
}));