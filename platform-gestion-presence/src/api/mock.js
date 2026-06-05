const now = new Date()

const initialState = {
  users: [
    { id: 1, email: 'admin@test.com', password: 'password', name: 'Admin Démo', role: 'admin' },
    { id: 2, email: 'prof@test.com', password: 'password', name: 'Professeur Démo', role: 'professeur' },
    { id: 3, email: 'parent@test.com', password: 'password', name: 'Parent Démo', role: 'parent' },
    { id: 4, email: 'eleve@test.com', password: 'password', name: 'Élève Démo', role: 'eleve' },
  ],
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
  presences: [],
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
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return fallback()
  return request()
}

export const mockApi = {
  login(credentials) {
    const state = getState()
    const account = state.users.find((user) => user.email === credentials.email && user.password === credentials.password)

    if (!account) {
      return Promise.reject({ response: { status: 401 }, message: 'Identifiants invalides' })
    }

    const user = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
    }
    return response({ token: 'mock-jwt-token', user })
  },

  register(credentials) {
    const state = getState()
    const existing = state.users.find((user) => user.email === credentials.email)

    if (existing) {
      return Promise.reject({ response: { status: 422 }, message: 'Cet email est déjà utilisé' })
    }

    const user = {
      id: nextId(state.users),
      email: credentials.email,
      password: credentials.password,
      name: `${credentials.prenom} ${credentials.nom}`.trim(),
      role: credentials.role,
    }

    state.users.push(user)
    saveState(state)

    return response({ token: 'mock-jwt-token', user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    } })
  },
  logout() {
    return response({ ok: true })
  },
  me() {
    const user = JSON.parse(localStorage.getItem('user') || '{"name":"Admin Démo","role":"Admin"}')
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
        status: 'Présent',
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
    const session = { id: nextId(state.sessions), ...payload, cours: course || { nom: 'Cours démo' }, qr_token: `presence-${Date.now()}`, statut: 'ouvert', created_at: now.toISOString() }
    state.sessions.push(session)

    const students = state.eleves.filter((eleve) => eleve.classe_id === course?.classe_id)
    students.forEach((eleve) => {
      state.presences.push({
        id: nextId(state.presences),
        session_id: session.id,
        eleve_id: eleve.id,
        statut: 'absent',
        methode: 'manuel',
        marque_le: null,
        eleve,
      })
    })

    saveState(state)
    return response(session)
  },
  closePresenceSession(id) {
    const state = getState()
    state.sessions = state.sessions.map((item) => Number(item.id) === Number(id) ? { ...item, statut: 'ferme' } : item)
    saveState(state)
    return response({ ok: true })
  },
  getSessions() {
    const state = getState()
    return response(state.sessions)
  },
  getSession(id) {
    const state = getState()
    const session = state.sessions.find((item) => Number(item.id) === Number(id))
    if (!session) {
      return Promise.reject({ response: { status: 404 }, message: 'Session introuvable' })
    }
    const presences = state.presences
      .filter((item) => Number(item.session_id) === Number(id))
      .map((presence) => ({
        ...presence,
        eleve: state.eleves.find((eleve) => Number(eleve.id) === Number(presence.eleve_id)) || presence.eleve,
      }))
    return response({ ...session, presences })
  },
  getPresences(params = {}) {
    const state = getState()
    const records = state.presences
      .filter((presence) => !params.session_id || Number(presence.session_id) === Number(params.session_id))
      .map((presence) => ({
        ...presence,
        eleve: state.eleves.find((eleve) => Number(eleve.id) === Number(presence.eleve_id)) || presence.eleve,
        session: state.sessions.find((session) => Number(session.id) === Number(presence.session_id)) || null,
      }))
    return response(records)
  },
  clearPresences() {
    const state = getState()
    state.presences = []
    saveState(state)
    return response({ ok: true })
  },
  getSessionQrToken(id) {
    const state = getState()
    const session = state.sessions.find((item) => Number(item.id) === Number(id))
    if (!session) {
      return Promise.reject({ response: { status: 404 }, message: 'Session introuvable' })
    }
    return response({ qr_token: session.qr_token, expires_at: null, cours: session.cours?.nom || 'Cours démo', classe: session.cours?.classe || 'Classe inconnue' })
  },
  markManualPresence(id, payload) {
    const state = getState()
    payload.presences.forEach((presenceUpdate) => {
      state.presences = state.presences.map((presence) =>
        Number(presence.session_id) === Number(id) && Number(presence.eleve_id) === Number(presenceUpdate.eleve_id)
          ? { ...presence, statut: presenceUpdate.statut, marque_le: new Date().toISOString() }
          : presence
      )
    })
    saveState(state)
    return response({ ok: true })
  },
  scanQrPresence(payload) {
    const state = getState()
    const session = state.sessions.find((item) => item.qr_token === payload.qr_token && item.statut === 'ouvert')
    if (!session) {
      return Promise.reject({ response: { status: 404 }, message: 'Session introuvable ou fermee' })
    }
    state.presences = state.presences.map((presence) =>
      Number(presence.session_id) === Number(session.id) && Number(presence.eleve_id) === Number(payload.eleve_id)
        ? { ...presence, statut: 'present', methode: 'qr', marque_le: new Date().toISOString() }
        : presence
    )
    saveState(state)
    return response({ ok: true, status: 'present' })
  },
  getNotifications() {
    return response(getState().notifications)
  },
  getPresenceRequests() {
    return response(getState().requetes)
  },
  createPresenceRequest(payload) {
    const state = getState()
    const request = {
      id: nextId(state.requetes),
      eleve: payload.eleve_id || 'Élève démo',
      date: new Date().toISOString().slice(0, 10),
      motif: payload.motif,
      statut: 'pending',
    }
    state.requetes.push(request)
    saveState(state)
    return response(request)
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
    return response({ ecole: 'École Démo', classe: params.classe_id || 'Toutes les classes', periode: `${params.date_debut || 'début'} - ${params.date_fin || 'fin'}`, eleves: rows })
  },
}
