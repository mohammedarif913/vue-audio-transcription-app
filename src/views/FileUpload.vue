<template>
  <app-layout>
    <div class="file-upload">
      <h2 class="page-title">Gestion des fichiers</h2>
      
      <div class="upload-zone" 
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
          :class="{ 'active-dropzone': isDragging }">
        
        <div class="upload-content">
          <div class="folder-icon">📁</div>
          <p>Glissez-déposez vos fichiers ici ou</p>
          <input type="file" id="file-upload" multiple @change="onFileSelected" class="hidden-input" />
          <button @click="triggerFileInput" class="upload-btn">Parcourir</button>
        </div>
      </div>
      
      <div class="file-types">
        <p>Types de fichiers acceptés: .mp3, .wav, .txt, .docx, .pdf</p>
      </div>
      
      <div class="file-list" v-if="fileService.state.files.length > 0">
        <h3>Fichiers récents</h3>
        
        <div class="file-list-header">
          <div class="file-name">Nom</div>
          <div class="file-type">Type</div>
          <div class="file-size">Taille</div>
          <div class="file-status">Statut</div>
          <div class="file-date">Date</div>
        </div>
        
        <div class="file-item" v-for="file in fileService.state.files" :key="file.id">
          <div class="file-name">
            <span class="file-icon">{{ getFileIcon(file.type) }}</span>
            {{ file.name }}
          </div>
          <div class="file-type">{{ file.type.charAt(0).toUpperCase() + file.type.slice(1) }}</div>
          <div class="file-size">{{ file.size }}</div>
          <div class="file-status" :class="'status-' + file.status.replace(' ', '-')">
            {{ file.status.charAt(0).toUpperCase() + file.status.slice(1) }}
          </div>
          <div class="file-date">{{ file.date }}</div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from '@/components/layout/AppLayout.vue'
import fileService from '@/services/fileService'

export default {
  name: 'FileUploadView',
  components: {
    AppLayout
  },
  data() {
    return {
      isDragging: false,
      fileService // référence au service de fichiers
    }
  },
  methods: {
    triggerFileInput() {
      document.getElementById('file-upload').click();
    },
    onDragOver() {
      this.isDragging = true;
    },
    onDragLeave() {
      this.isDragging = false;
    },
    onDrop(e) {
      this.isDragging = false;
      const files = e.dataTransfer.files;
      if (files.length) {
        this.uploadFiles(files);
      }
    },
    onFileSelected(e) {
      const files = e.target.files;
      if (files.length) {
        this.uploadFiles(files);
      }
    },
    uploadFiles(files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Vérifier le type de fichier
        const validTypes = ['.mp3', '.wav', '.txt', '.docx', '.pdf'];
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validTypes.includes(extension)) {
          alert(`Le fichier "${file.name}" n'est pas dans un format accepté.`);
          continue;
        }
        
        // Ajouter le fichier via le service
        fileService.addFile(file);
      }
      
      // Réinitialiser l'input de fichier
      document.getElementById('file-upload').value = '';
      
      // Feedback utilisateur
      alert('Fichiers ajoutés avec succès et mis en file d\'attente pour traitement.');
    },
    getFileIcon(type) {
      switch (type) {
        case 'audio': return '🎵';
        case 'texte': return '📄';
        default: return '📁';
      }
    }
  }
}
</script>


<style scoped>
.file-upload {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 24px;
  font-size: 28px;
  color: #333;
}

.upload-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  background-color: #f9f9f9;
  transition: border-color 0.3s, background-color 0.3s;
  margin-bottom: 15px;
}

.active-dropzone {
  border-color: #C6246F;
  background-color: rgba(198, 36, 111, 0.05);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.folder-icon {
  font-size: 48px;
  color: #C6246F;
}

.hidden-input {
  display: none;
}

.upload-btn {
  background-color: #C6246F;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.file-types {
  text-align: center;
  margin-bottom: 30px;
  color: #666;
}

.file-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 20px;
  margin-top: 30px;
}

.file-list h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
}

.file-list-header {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1.5fr 1fr;
  padding: 10px 15px;
  background-color: #f5f5f7;
  border-radius: 6px 6px 0 0;
  font-weight: 500;
  color: #555;
}

.file-item {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1.5fr 1fr;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.file-name {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-icon {
  font-size: 18px;
}

.file-status {
  font-weight: 500;
}

.status-en-attente {
  color: #f2c037;
}

.status-en-traitement {
  color: #2196f3;
}

.status-traité {
  color: #4caf50;
}
</style>