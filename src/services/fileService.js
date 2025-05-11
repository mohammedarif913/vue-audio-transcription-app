// src/services/fileService.js
import { reactive } from 'vue'

// État réactif qui peut être partagé entre les composants
const state = reactive({
  files: [
    { id: 1, name: 'interview_client1.mp3', type: 'audio', size: '12.4 MB', status: 'traité', date: '2023-05-10' },
    { id: 2, name: 'transcription.txt', type: 'texte', size: '45 KB', status: 'traité', date: '2023-05-10' },
    { id: 3, name: 'conversation_support.wav', type: 'audio', size: '8.2 MB', status: 'en traitement', date: '2023-05-11' },
    { id: 4, name: 'dataset_questions.txt', type: 'texte', size: '128 KB', status: 'en attente', date: '2023-05-11' }
  ],
  processingCount: 1,
  pendingCount: 1
})

// Fonction pour ajouter un nouveau fichier
function addFile(file) {
  // Déterminer le type basé sur l'extension
  let type = 'autre';
  if (file.name.match(/\.(mp3|wav|ogg)$/i)) {
    type = 'audio';
  } else if (file.name.match(/\.(txt|docx|pdf|md)$/i)) {
    type = 'texte';
  }

  // Formater la taille
  const size = formatFileSize(file.size);
  
  // Définir un statut initial
  const status = 'en attente';
  
  // Obtenir la date actuelle
  const date = new Date().toISOString().split('T')[0];
  
  // Créer un nouvel ID
  const id = Math.max(...state.files.map(f => f.id), 0) + 1;
  
  // Créer l'objet fichier
  const newFile = {
    id,
    name: file.name,
    type,
    size,
    status,
    date
  };
  
  // Ajouter le fichier à la liste
  state.files.push(newFile);
  
  // Mettre à jour les compteurs
  updateCounts();
  
  // Simuler le traitement (pour la démo)
  setTimeout(() => {
    const fileIndex = state.files.findIndex(f => f.id === id);
    if (fileIndex !== -1) {
      state.files[fileIndex].status = 'en traitement';
      updateCounts();
      
      // Puis simuler la fin du traitement après quelques secondes
      setTimeout(() => {
        state.files[fileIndex].status = 'traité';
        updateCounts();
      }, 5000);
    }
  }, 2000);
  
  return newFile;
}

// Fonction pour mettre à jour les compteurs
function updateCounts() {
  state.processingCount = state.files.filter(f => f.status === 'en traitement').length;
  state.pendingCount = state.files.filter(f => f.status === 'en attente').length;
}

// Fonction utilitaire pour formater la taille des fichiers
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
  else return Math.round(bytes / 1048576 * 10) / 10 + ' MB';
}

// Mettre à jour les compteurs initiaux
updateCounts();

export default {
  state,
  addFile,
  updateCounts
}