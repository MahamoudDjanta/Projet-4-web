export const roles = ['Admin', 'Professeur', 'Parent', 'Eleve']

export function dashboardPathForRole() {
  return '/dashboard'
}

export function canManage(role = '') {
  return ['Admin', 'Professeur'].includes(role)
}
