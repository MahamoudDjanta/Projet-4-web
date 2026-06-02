const now = new Date()

const initialState = {
  eleves: [
    { id: 1, nom: 'Aminata Diallo', email: 'aminata@example.com', classe_id: '6A', classe: '6eme A', matricule: 'ELV-001' },
    { id: 2, nom: 'Yann Kouassi', email: 'yann@example.com', classe_id: '6A', classe: '6eme A', matricule: 'ELV-002' },
    { id: 3, nom: 'Sarah Mensah', email: 'sarah@example.com', classe_id: '5B', classe: '5eme B', matricule: 'ELV-003' },
    { id: 4, nom: 'Noah Traore', email: 'noah@example.com', classe_id: '5B', classe: '5eme B', matricule: 'ELV-004' },
  ],
  cours: [
    { id: 1, nom: 'Mathematiques', classe_id: '6A', classe: '6eme A', professeur: 'M. Kone', heure: '08:00', statut: 'ouvert' },
    { id: 2, nom: 'Francais', classe_id: '6A', classe: '6eme A', professeur: 'Mme Toure', heure: '10:00', statut: 'ferme' },
    { id: 3, nom: 'Physique', classe_id: '5B', classe: '5eme B', professeur: 'M. Mensah', heure: '14:00', statut: 'ouvert' },
  ],
  notifications: [
    { id: 1, eleve: 'Noah Traore', cours: 'Physique', date: '2026-06-01', statut: 'envoye' },
    { id: 2, eleve: 'Sarah Mensah', cours: 'Mathematiques', date: '2026-05-31', statut: 'echec' },
  ],
  requetes: [
    { id: 1, eleve: 'Aminata Diallo', date: '2026-05-30', motif: 'Certificat medical fourni', statut: 'pending' },
    { id: 2, eleve: 'Yann Kouassi', date: '2026-05-29', motif: 'Erreur de scan QR', statut: 'approved' },
  ],
  permissions: [
    { id: 1, eleve: 'Sarah Mensah', eleve_id: 3, date_debut: '2026-06-03', date_fin: '2026-06-04', motif: 'Rendez-vous familial', statut: 'pending' },
  ],
  sessions: [],
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function getState() {
  if (typeof localStorage === 'undefined') return clone(initialState)
  const saved = localStorage.getItem('mock_presence_state')
  if (!saved) {
    localStorage.setItem('mock_presence_state', JSON.stringify(initialState))
    return clone(initialState)
  }
  return JSON.parse(saved)
}

function saveState(state) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('mock_presence_state', JSON.stringify(state))
  }
}

function response(data) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data }), 250)
  })
}

function nextId(items) {
  return Math.max(0, ...items.map((item) => Number(item.id) || 0)) + 1
}

export function shouldUseMock(error) {
  return !error.response || error.code === 'ERR_NETWORK'
}

export function withMock(request, fallback) {
  return request().catch((error) => {
    if (shouldUseMock(error)) return fallback()
    throw error
  })
}

export const mockApi = {
  login(credentials) {
    const user = {
      id: 1,
      name: credentials.email?.split('@')[0] || 'Admin Demo',
      email: credentials.email,
      role: credentials.role || 'Admin',
    }
    return response({ token: 'mock-jwt-token', user })
  },
  logout() {
    return response({ ok: true })
  },
  me() {
    const user = JSON.parse(localStorage.getItem('user') || '{"name":"Admin Demo","role":"Admin"}')
    return response(user)
  },
  dashboard() {
    const state = getState()
    return response({
      stats: { presents: 128, absences: 14, cours_en_cours: state.cours.filter((course) => course.statut === 'ouvert').length, taux_presence: 91 },
      weekly: [
        { jour: 'Lun', taux: 88 },
        { jour: 'Mar', taux: 93 },
        { jour: 'Mer', taux: 90 },
        { jour: 'Jeu', taux: 95 },
        { jour: 'Ven', taux: 91 },
      ],
      cours_du_jour: state.cours,
      alertes: [
        { id: 1, nom: 'Noah Traore', absences_consecutives: 3 },
        { id: 2, nom: 'Sarah Mensah', absences_consecutives: 4 },
      ],
      parent: {
        status: 'Present',
        absences: [
          { id: 1, date: '2026-05-20', cours: 'Francais', motif: 'Non justifiee' },
          { id: 2, date: '2026-05-11', cours: 'Physique', motif: 'Justifiee' },
        ],
      },
    })
  },
  getEleves(params = {}) {
    const state = getState()
    const data = params.classe_id ? state.eleves.filter((item) => item.classe_id === params.classe_id) : state.eleves
    return response(data)
  },
  createEleve(payload) {
    const state = getState()
    const id = nextId(state.eleves)
    const eleve = { id, classe: payload.classe_id, matricule: `ELV-${id.toString().padStart(3, '0')}`, ...payload }
    state.eleves.push(eleve)
    saveState(state)
    return response(eleve)
  },
  updateEleve(id, payload) {
    const state = getState()
    state.eleves = state.eleves.map((item) => Number(item.id) === Number(id) ? { ...item, ...payload } : item)
    saveState(state)
    return response(state.eleves.find((item) => Number(item.id) === Number(id)))
  },
  deleteEleve(id) {
    const state = getState()
    state.eleves = state.eleves.filter((item) => Number(item.id) !== Number(id))
    saveState(state)
    return response({ ok: true })
  },
  getCours(params = {}) {
    const state = getState()
    const data = params.classe_id ? state.cours.filter((item) => item.classe_id === params.classe_id) : state.cours
    return response(data)
  },
  createCours(payload) {
    const state = getState()
    const course = { id: nextId(state.cours), classe: payload.classe_id, heure: '08:00', statut: 'ferme', ...payload }
    state.cours.push(course)
    saveState(state)
    return response(course)
  },
  updateCours(id, payload) {
    const state = getState()
    state.cours = state.cours.map((item) => Number(item.id) === Number(id) ? { ...item, ...payload } : item)
    saveState(state)
    return response(state.cours.find((item) => Number(item.id) === Number(id)))
  },
  deleteCours(id) {
    const state = getState()
    state.cours = state.cours.filter((item) => Number(item.id) !== Number(id))
    saveState(state)
    return response({ ok: true })
  },
  programme(classeId) {
    const state = getState()
    const courses = state.cours.filter((course) => course.classe_id === classeId || course.classe === classeId)
    const rows = courses.flatMap((course, index) => [
      { id: `${course.id}-1`, jour: 'Lundi', heure_debut: course.heure || '08:00', heure_fin: '10:00', cours: course.nom, salle: `Salle ${index + 1}` },
      { id: `${course.id}-2`, jour: 'Mercredi', heure_debut: '10:00', heure_fin: '12:00', cours: course.nom, salle: `Salle ${index + 2}` },
    ])
    return response(rows)
  },
  createPresenceSession(payload) {
    const state = getState()
    const course = state.cours.find((item) => Number(item.id) === Number(payload.cours_id))
    const session = { id: nextId(state.sessions), ...payload, cours: course || { nom: 'Cours demo' }, qr_token: `presence-${Date.now()}`, statut: 'ouvert', created_at: now.toISOString() }
    state.sessions.push(session)
    saveState(state)
    return response(session)
  },
  closePresenceSession(id) {
    const state = getState()
    state.sessions = state.sessions.map((item) => Number(item.id) === Number(id) ? { ...item, statut: 'ferme' } : item)
    saveState(state)
    return response({ ok: true })
  },
  markManualPresence() {
    return response({ ok: true })
  },
  scanQrPresence() {
    return response({ ok: true, status: 'present' })
  },
  getNotifications() {
    return response(getState().notifications)
  },
  getPresenceRequests() {
    return response(getState().requetes)
  },
  updatePresenceRequest(id, payload) {
    const state = getState()
    state.requetes = state.requetes.map((item) => Number(item.id) === Number(id) ? { ...item, ...payload } : item)
    saveState(state)
    return response(state.requetes.find((item) => Number(item.id) === Number(id)))
  },
  getPermissions() {
    return response(getState().permissions)
  },
  createPermission(payload) {
    const state = getState()
    const permission = {
      id: nextId(state.permissions),
      eleve: payload.get?.('eleve_id') || payload.eleve_id,
      eleve_id: payload.get?.('eleve_id') || payload.eleve_id,
      date_debut: payload.get?.('date_debut') || payload.date_debut,
      date_fin: payload.get?.('date_fin') || payload.date_fin,
      motif: payload.get?.('motif') || payload.motif,
      statut: 'pending',
    }
    state.permissions.push(permission)
    saveState(state)
    return response(permission)
  },
  updatePermission(id, payload) {
    const state = getState()
    state.permissions = state.permissions.map((item) => Number(item.id) === Number(id) ? { ...item, ...payload } : item)
    saveState(state)
    return response(state.permissions.find((item) => Number(item.id) === Number(id)))
  },
  previewRapport(params) {
    const state = getState()
    const rows = state.eleves
      .filter((student) => !params.classe_id || student.classe_id === params.classe_id || student.classe === params.classe_id)
      .map((student, index) => ({ id: student.id, nom: student.nom, presents: 18 - index, absences: index + 1, taux: 95 - index * 4 }))
    return response({ ecole: 'Ecole Demo', classe: params.classe_id || 'Toutes les classes', periode: `${params.date_debut || 'debut'} - ${params.date_fin || 'fin'}`, eleves: rows })
  },
}
