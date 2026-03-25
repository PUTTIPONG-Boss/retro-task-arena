import { useQuery } from '@tanstack/react-query';
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
      
      // Map backend to frontend UserProfile
      const mappedUser: UserProfile = {
        id: userData.userId || userData.id,
        username: userData.username,
        email: userData.email,
        points: userData.points || 0,
        role: userData.role || 'adventurer',
        questsCompleted: userData.questsCompleted || 0,
        rating: userData.rating || 5.0,
        totalRatings: userData.totalRatings || 0,
        skills: userData.skills ? userData.skills.split(',') : [],
        title: userData.title || 'Novice',
        level: userData.level || 1,
        githubUrl: userData.githubUrl || '',
        joinedDate: userData.joinedDate || new Date().toISOString(),
      };

      setUser(mappedUser);
      return mappedUser;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
