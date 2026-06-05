# Diagrammes UML du projet

## Diagramme de cas d'utilisation

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontFamily':'Inter, sans-serif' }}}%%
usecaseDiagram
  actor Admin as A
  actor Professeur as P
  actor Parent as T
  actor Eleve as E

  A --> (Se connecter)
  P --> (Se connecter)
  T --> (Se connecter)
  E --> (Se connecter)

  A --> (Voir tableau de bord)
  P --> (Voir tableau de bord)

  A --> (Gérer utilisateurs)
  A --> (Gérer classes)
  A --> (Gérer cours)
  A --> (Gérer élèves)

  A --> (Ouvrir séance de présence)
  A --> (Clôturer séance)
  A --> (Marquer présences)
  A --> (Vider les présences)

  P --> (Gérer cours)
  P --> (Gérer élèves)
  P --> (Ouvrir séance de présence)
  P --> (Clôturer séance)
  P --> (Marquer présences)

  A --> (Valider requêtes d'absence)
  A --> (Valider permissions d'absence)
  P --> (Valider requêtes d'absence)

  A --> (Consulter notifications)
  P --> (Consulter notifications)
  T --> (Consulter notifications)
  E --> (Consulter notifications)

  T --> (Soumettre requête d'absence)
  T --> (Soumettre permission d'absence)
  E --> (Soumettre requête d'absence)

  E --> (Scanner QR pour présence)
  A --> (Générer rapports)
  P --> (Générer rapports)
```

## Diagramme de classes

```mermaid
classDiagram
    class User {
      int id
      string name
      string email
      string password
      string role
    }
    class Classe {
      int id
      string nom
      string niveau
    }
    class Eleve {
      int id
      int user_id
      int classe_id
      string matricule
    }
    class Cours {
      int id
      string nom
      int classe_id
      int professeur_id
      string jour
      string heure_debut
      string heure_fin
    }
    class SessionPresence {
      int id
      int cours_id
      date date
      string qr_token
      string statut
      timestamp ouverte_le
      timestamp cloturee_le
    }
    class Presence {
      int id
      int session_id
      int eleve_id
      string statut
      string methode
      timestamp marque_le
    }
    class NotificationPresence {
      int id
      int eleve_id
      int session_id
      string destinataire_email
      string type
      string statut
    }
    class RequetePresence {
      int id
      int eleve_id
      int session_id
      int demandeur_id
      text motif
      string statut
      text commentaire_admin
    }
    class PermissionAbsence {
      int id
      int eleve_id
      int demandeur_id
      date date_debut
      date date_fin
      text motif
      string piece_jointe
      string statut
    }

    User "1" --> "0..1" Eleve : a
    User "1" --> "*" Cours : enseigne
    User "1" --> "*" RequetePresence : demandeur
    User "1" --> "*" PermissionAbsence : demandeur
    User "*" --> "*" Eleve : parents\n(parents_eleves)

    Classe "1" --> "*" Eleve : contient
    Classe "1" --> "*" Cours : contient

    Eleve "1" --> "*" Presence : possede
    Eleve "1" --> "*" RequetePresence : fait
    Eleve "1" --> "*" PermissionAbsence : demande

    Cours "1" --> "*" SessionPresence : sessions
    SessionPresence "1" --> "*" Presence : enregistre
    SessionPresence "1" --> "*" NotificationPresence : notifie
    SessionPresence "0..1" --> "*" RequetePresence : peut concerner

    Presence "*" --> "1" Eleve : concerne
    Presence "*" --> "1" SessionPresence : session
    NotificationPresence "*" --> "1" Eleve : eleve
    NotificationPresence "*" --> "1" SessionPresence : session
    RequetePresence "*" --> "1" Eleve : eleve
    RequetePresence "*" --> "1" User : demandeur
    PermissionAbsence "*" --> "1" Eleve : eleve
    PermissionAbsence "*" --> "1" User : demandeur
```

## Notes
- Le projet combine un backend Laravel REST et un frontend React/Vite.
- Les rôles principaux sont `admin`, `professeur`, `parent` et `eleve`.
- Les principaux flux métier sont : gestion des présences, gestion des classes/cours/élèves, requêtes et permissions d’absence, ainsi que notifications et rapports.
