<template>
  <app-layout>
    <div class="audio-workspace">
      <h2 class="page-title">Espace audio</h2>
      
      <div class="audio-selector">
        <label for="audio-file">Fichier audio:</label>
        <select id="audio-file" v-model="selectedFile" @change="loadAudioFile">
          <option value="">Sélectionnez un fichier</option>
          <option v-for="file in audioFiles" :key="file.id" :value="file.id">
            {{ file.name }}
          </option>
        </select>
      </div>
      
      <div class="audio-player" v-if="selectedFile">
        <div class="player-container">
          <!-- Visualisation simple de l'audio -->
          <div class="waveform-placeholder" :class="{ 'playing': isPlaying }"></div>
          
          <!-- Contrôles audio simples -->
          <div class="player-controls">
            <button class="control-btn" @click="togglePlay">
              {{ isPlaying ? '⏸️ Pause' : '▶️ Lecture' }}
            </button>
            <div class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</div>
            <div class="volume-control">
              <span>🔊</span>
              <input type="range" min="0" max="100" v-model="volume" class="volume-slider">
            </div>
          </div>
        </div>
        
        <div class="transcription-container">
          <h3>Transcription</h3>
          <div class="transcription-text">
            <p class="transcript-line" v-for="(line, index) in transcriptLines" :key="index">
              <span class="timestamp">{{ line.time }}</span>
              <span class="text">{{ line.text }}</span>
            </p>
          </div>
          <div class="transcription-actions">
            <button class="action-btn" @click="copyTranscription">
              Copier le texte
            </button>
          </div>
        </div>
      </div>
      
      <div class="empty-state" v-else>
        <div class="empty-icon">🎵</div>
        <p>Sélectionnez un fichier audio pour commencer</p>
        <input 
          type="file" 
          ref="audioInput" 
          accept="audio/*" 
          style="display: none" 
          @change="handleFileUpload"
        />
        <button @click="uploadAudio" class="primary-btn">Importer un fichier audio</button>
      </div>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from '@/components/layout/AppLayout.vue'
import fileService from '@/services/fileService'

export default {
  name: 'AudioWorkspaceView',
  components: {
    AppLayout
  },
  data() {
    return {
      selectedFile: '',
      isPlaying: false,
      volume: 80,
      currentTime: 0,
      duration: 225, // 3:45 en secondes
      playTimer: null,
      transcriptLines: [
        { time: '00:05', text: 'Bonjour et merci de nous accorder cet entretien.' },
        { time: '00:08', text: 'Pouvez-vous nous parler de votre expérience avec notre produit?' },
        { time: '00:15', text: "Oui, bien sûr. J'utilise votre solution depuis environ trois mois." },
        { time: '00:20', text: "J'apprécie particulièrement la facilité d'utilisation et l'interface intuitive." },
        { time: '00:28', text: "Par contre, j'ai rencontré quelques difficultés avec les fonctionnalités avancées." },
        { time: '00:35', text: "Pourriez-vous préciser quelles fonctionnalités vous ont posé problème?" },
        { time: '00:40', text: "Principalement l'export des données et la génération de rapports personnalisés." }
      ],
      audioFiles: []
    }
  },
  created() {
    // Filtrer uniquement les fichiers audio
    this.audioFiles = fileService.state.files.filter(file => file.type === 'audio');
  },
  methods: {
    // Charger le fichier audio sélectionné
    loadAudioFile() {
      this.stopPlayback();
      this.currentTime = 0;
    },
    
    // Lancer ou mettre en pause la lecture
    togglePlay() {
      this.isPlaying = !this.isPlaying;
      
      if (this.isPlaying) {
        // Simuler la lecture
        this.playTimer = setInterval(() => {
          if (this.currentTime < this.duration) {
            this.currentTime++;
          } else {
            this.stopPlayback();
          }
        }, 1000);
      } else {
        this.stopPlayback();
      }
    },
    
    // Arrêter la lecture
    stopPlayback() {
      this.isPlaying = false;
      if (this.playTimer) {
        clearInterval(this.playTimer);
        this.playTimer = null;
      }
    },
    
    // Formater le temps en MM:SS
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    // Copier la transcription
    copyTranscription() {
      let content = '';
      this.transcriptLines.forEach(line => {
        content += `${line.text}\n`;
      });
      
      // Créer un élément textarea temporaire
      const textArea = document.createElement('textarea');
      textArea.value = content;
      
      // Rendre l'élément invisible
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        // Exécuter la commande de copie
        const successful = document.execCommand('copy');
        if (successful) {
          alert('Transcription copiée dans le presse-papier');
        } else {
          alert('Impossible de copier la transcription');
        }
      } catch (err) {
        console.error('Erreur lors de la copie:', err);
        alert('Erreur lors de la copie de la transcription');
      }
      
      // Nettoyer
      document.body.removeChild(textArea);
    },
    
    // Ouvrir le dialogue de sélection de fichier
    uploadAudio() {
      this.$refs.audioInput.click();
    },
    
    // Gérer le fichier téléchargé
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Vérifier que c'est bien un fichier audio
      if (!file.type.match('audio.*')) {
        alert('Veuillez sélectionner un fichier audio valide (.mp3, .wav, etc.)');
        return;
      }
      
      // Ajouter le fichier via le service
      const newFile = fileService.addFile(file);
      
      // Mettre à jour la liste des fichiers audio
      this.audioFiles = fileService.state.files.filter(file => file.type === 'audio');
      
      // Sélectionner automatiquement le nouveau fichier
      this.selectedFile = newFile.id;
      
      // Réinitialiser l'input
      this.$refs.audioInput.value = '';
    }
  },
  beforeUnmount() {
    this.stopPlayback();
  }
}
</script>

<style scoped>
.audio-workspace {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 24px;
  font-size: 28px;
  color: #333;
}

.audio-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.audio-selector label {
  font-weight: 500;
}

.audio-selector select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  min-width: 200px;
}

.audio-player {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.player-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 20px;
}

.waveform-placeholder {
  height: 100px;
  background: linear-gradient(90deg, 
    #C6246F 10%, #d13d82 12%, #C6246F 15%, 
    #d13d82 20%, #C6246F 25%, #d13d82 30%, 
    #C6246F 35%, #d13d82 40%, #C6246F 45%, 
    #d13d82 50%, #C6246F 55%, #d13d82 60%, 
    #C6246F 65%, #d13d82 70%, #C6246F 75%, 
    #d13d82 80%, #C6246F 85%, #d13d82 90%, 
    #C6246F 95%
  );
  opacity: 0.5;
  border-radius: 4px;
  margin-bottom: 20px;
  transition: opacity 0.3s;
}

.waveform-placeholder.playing {
  opacity: 0.8;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.control-btn {
  background-color: #C6246F;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
}

.time-display {
  margin-left: 10px;
  font-size: 14px;
  color: #666;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.volume-slider {
  width: 80px;
}

.transcription-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 20px;
}

.transcription-container h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
}

.transcription-text {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.transcript-line {
  display: flex;
  margin-bottom: 8px;
}

.timestamp {
  min-width: 50px;
  color: #666;
  font-size: 14px;
  margin-right: 10px;
}

.transcription-actions {
  display: flex;
  justify-content: flex-end;
}

.action-btn {
  background-color: #f5f5f7;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.action-btn:hover {
  background-color: #e5e5e7;
}

.empty-state {
  padding: 50px 20px;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
  color: #C6246F;
}

.empty-state p {
  margin-bottom: 20px;
  color: #666;
}

.primary-btn {
  background-color: #C6246F;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}
</style>
