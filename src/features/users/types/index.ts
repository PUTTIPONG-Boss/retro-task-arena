export interface UserProfile {
  id: string;
  username: string;
  password?: string;
  email?: string;
  title: string;
  level: number;
  totalExp: number;
  points: number;
  questsInProgress?: number;
  questsInReview?: number;
  questsCompleted: number;
  rating: number;
  totalRatings: number;
  github: string;
  joinedDate: string;
  role: string;
  skills: string[];
  linkin: string;
  gitlabUsername?: string;
  gitInetUsername?: string;

  // Additional Fields
  accountId?: string;
  oneId?: string;
  emailOneId?: string;
  titleTh?: string;
  firstNameTh?: string;
  lastNameTh?: string;
  nameTh?: string;
  titleEn?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  nameEn?: string;
  nickName?: string;
  tel?: string;
  employeeId?: string;
  positionId?: string;
  positionName?: string;
  positionLevel?: string;
  taxId?: string;
  companyId?: string;
  companyFullNameTh?: string;
  companyFullNameEng?: string;
  companyShortNameTh?: string;
  companyShortNameEng?: string;
  station?: string;
  contractType?: string;
  type?: string;

  // Admin
  openTasksCount?: number;
  inProgressTasksCount?: number;
  finishedTasksCount?: number;
  reviewCount?: number;
  postedTasks?: any[];
  
}
