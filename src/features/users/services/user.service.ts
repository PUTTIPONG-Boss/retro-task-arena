import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { UserProfile } from '../types';
import { useUserStore } from '../store/userStore';

export const useGetProfile = (enabled: boolean = true) => {
  const setUser = useUserStore((state) => state.setUser);

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.get('/user/me');
      const userData = response.data;

      const mappedUser: UserProfile = {
        ...userData,
        id: userData.userId || userData.id,
        username: userData.username,
        email: userData.email,
        points: userData.points || 0,
        role: userData.role || 'adventurer',
        questsCompleted: userData.questsCompleted || 0,
        rating: userData.rating || 5.0,
        totalRatings: userData.totalRatings || 0,

        skills: Array.isArray(userData.skills)
          ? userData.skills
          : userData.skills
          ? userData.skills.split(',')
          : [],
        title: userData.titleEn || userData.title || 'Novice',
        level: userData.level || 1,
        github: userData.github || '',
        linkin: userData.linkin || '',
        joinedDate: userData.joinedDate || new Date().toISOString(),

        tel: userData.tel || userData.phone || userData.tel_no,
        accountId: userData.accountId || userData.account_id,
        oneId: userData.oneId || userData.one_id,
        emailOneId: userData.emailOneId || userData.email_one_id,
        titleTh: userData.titleTh || userData.title_th,
        firstNameTh: userData.firstNameTh || userData.first_name_th,
        lastNameTh: userData.lastNameTh || userData.last_name_th,
        nameTh: userData.nameTh || userData.name_th,
        titleEn: userData.titleEn || userData.title_en,
        firstNameEn: userData.firstNameEn || userData.first_name_en,
        lastNameEn: userData.lastNameEn || userData.last_name_en,
        nameEn: userData.nameEn || userData.name_en,
        nickName: userData.nickName || userData.nick_name,
        employeeId: userData.employeeId || userData.employee_id,
        positionId: userData.positionId || userData.position_id,
        positionName: userData.positionName || userData.position_name,
        positionLevel: userData.positionLevel || userData.position_level,
        taxId: userData.taxId || userData.tax_id,
        companyId: userData.companyId || userData.company_id,
        companyFullNameTh: userData.companyFullNameTh || userData.company_full_name_th,
        companyFullNameEng: userData.companyFullNameEng || userData.company_full_name_eng,
        companyShortNameTh: userData.companyShortNameTh || userData.company_short_name_th,
        companyShortNameEng: userData.companyShortNameEng || userData.company_short_name_eng,
        station: userData.station,
        contractType: userData.contractType || userData.contract_type,
        type: userData.type,
      };

      setUser(mappedUser);
      return mappedUser;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Pick<UserProfile, 'id' | 'github' | 'linkin' | 'skills'>) => {
      const { id, github, linkin, skills } = payload;
      const currentUser = useUserStore.getState().user;

      const backendPayload = {
        username: currentUser?.username,
        email: currentUser?.email,
        github,
        linkin,
        skills: Array.isArray(skills) ? skills.join(',') : skills,
      };

      try {
        console.log('Sending Profile Update Payload:', backendPayload);
        const response = await apiClient.patch(`/user/${id}`, backendPayload);
        return response.data;
      } catch (error: any) {
        console.error('Profile Update Error Details:', error.response?.data || error.message);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};