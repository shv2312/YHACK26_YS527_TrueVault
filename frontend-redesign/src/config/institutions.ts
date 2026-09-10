export type Role = 'ADMIN' | 'OWNER' | 'OFFICIAL' | 'VERIFIER';

export interface Institution {
  id: string;
  name: string;
  description: string;
  allowedRoles: Role[];
  icon: string;
}

export const institutions: Institution[] = [
  {
    id: 'gov',
    name: 'Government Institution',
    description: 'Federal and local government authorities',
    allowedRoles: ['ADMIN', 'OFFICIAL', 'VERIFIER'],
    icon: 'Landmark',
  },
  {
    id: 'edu',
    name: 'Educational Institution',
    description: 'Universities and research centers',
    allowedRoles: ['ADMIN', 'OWNER', 'OFFICIAL', 'VERIFIER'],
    icon: 'GraduationCap',
  },
  {
    id: 'fin',
    name: 'Financial Institution',
    description: 'Banks and financial regulators',
    allowedRoles: ['ADMIN', 'OFFICIAL', 'VERIFIER'],
    icon: 'Landmark',
  },
  {
    id: 'corp',
    name: 'Corporate / Private Institution',
    description: 'Registered businesses and enterprises',
    allowedRoles: ['ADMIN', 'OWNER', 'OFFICIAL'],
    icon: 'Building2',
  },
  {
    id: 'legal',
    name: 'Legal / Verification Authority',
    description: 'Law firms and third-party auditors',
    allowedRoles: ['OFFICIAL', 'VERIFIER'],
    icon: 'Scale',
  },
];
