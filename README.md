Plateforme de Transcription Audio
Une application web moderne développée avec Vue.js pour la gestion, la lecture et la transcription de fichiers audio, offrant une interface utilisateur intuitive et élégante.

Fonctionnalités

Gestion de fichiers audio

Importation et organisation de fichiers audio (.mp3, .wav)
Visualisation des fichiers avec leurs métadonnées
Suivi de l'état de traitement des fichiers


Lecteur audio intégré

Interface de lecture simple et intuitive
Visualisation des formes d'onde audio
Contrôles essentiels (lecture/pause, volume)


Affichage des transcriptions

Visualisation synchronisée des transcriptions
Navigation par horodatage
Copie facile du texte de transcription


Tableau de bord

Vue d'ensemble des statistiques sur les fichiers
Accès rapide aux fichiers récents
Suivi des fichiers en traitement



🚀 Installation
bash# Cloner le dépôt
git clone https://github.com/mohammedarif913/vue-audio-transcription-app.git
cd vue-audio-transcription-app

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run serve

# Compiler pour la production
npm run build
🛠️ Technologies utilisées

Vue.js - Framework JavaScript progressif
Vuex - Gestion de l'état de l'application
Vue Router - Navigation entre les différentes vues
JavaScript ES6+ - Fonctionnalités modernes de JavaScript
CSS3 - Styles avancés et design responsive

📁 Structure du projet
src/
├── assets/          # Ressources statiques (images, styles)
├── components/      # Composants Vue réutilisables
│   └── layout/      # Composants de mise en page
├── services/        # Services partagés (gestion des fichiers)
├── views/           # Pages principales de l'application
│   ├── DashboardView.vue      # Tableau de bord
│   ├── FileUploadView.vue     # Gestion des fichiers
│   ├── AudioWorkspaceView.vue # Espace audio
│   └── TextWorkspaceView.vue  # Espace texte
├── App.vue          # Composant racine
├── main.js          # Point d'entrée de l'application
└── router.js        # Configuration des routes


# vue-audio-transcription-app


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
