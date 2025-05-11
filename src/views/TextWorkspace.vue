<template>
  <app-layout>
    <div class="text-workspace">
      <h2 class="page-title">Espace texte</h2>
      
      <div class="text-actions">
        <div class="file-selector">
          <label for="text-file">Fichier texte:</label>
          <select id="text-file" v-model="selectedFile">
            <option value="">Sélectionnez un fichier</option>
            <option v-for="file in textFiles" :key="file.id" :value="file.id">
              {{ file.name }}
            </option>
          </select>
        </div>
        
        <div class="action-buttons">
          <button class="action-btn" @click="createNewFile">
            <span class="btn-icon">📄</span> Nouveau
          </button>
          <button class="action-btn" :disabled="!selectedFile" @click="saveFile">
            <span class="btn-icon">💾</span> Sauvegarder
          </button>
          <button class="action-btn" :disabled="!selectedFile" @click="exportFile">
            <span class="btn-icon">📤</span> Exporter
          </button>
        </div>
      </div>
      
      <div class="editor-container" v-if="selectedFile">
        <div class="editor-toolbar">
          <button class="tool-btn" title="Gras"><span class="btn-icon">B</span></button>
          <button class="tool-btn" title="Italique"><span class="btn-icon">I</span></button>
          <button class="tool-btn" title="Souligné"><span class="btn-icon">U</span></button>
          <span class="separator"></span>
          <button class="tool-btn" title="Titre"><span class="btn-icon">H</span></button>
          <button class="tool-btn" title="Liste à puces"><span class="btn-icon">•</span></button>
          <button class="tool-btn" title="Liste numérotée"><span class="btn-icon">1.</span></button>
        </div>
        
        <div class="editor-content">
          <textarea class="text-editor" v-model="fileContent" placeholder="Commencez à éditer votre texte ici..."></textarea>
        </div>
      </div>
      
      <div class="empty-state" v-else>
        <div class="empty-icon">📝</div>
        <p>Sélectionnez un fichier texte pour commencer à éditer</p>
        <button class="primary-btn" @click="createNewFile">Créer un nouveau fichier</button>
      </div>
      
      <!-- Modal pour créer un nouveau fichier -->
      <div class="modal" v-if="showNewFileModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Créer un nouveau fichier</h3>
            <button class="close-btn" @click="showNewFileModal = false">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="new-file-name">Nom du fichier:</label>
              <input type="text" id="new-file-name" v-model="newFileName" placeholder="Entrez un nom de fichier" />
            </div>
            <div class="form-group">
              <label for="new-file-type">Type de fichier:</label>
              <select id="new-file-type" v-model="newFileType">
                <option value="txt">Document texte (.txt)</option>
                <option value="md">Markdown (.md)</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="secondary-btn" @click="showNewFileModal = false">Annuler</button>
            <button class="primary-btn" @click="confirmNewFile" :disabled="!isNewFileNameValid">Créer</button>
          </div>
        </div>
      </div>
      
      <!-- Overlay pour le modal -->
      <div class="modal-overlay" v-if="showNewFileModal" @click="showNewFileModal = false"></div>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from '@/components/layout/AppLayout.vue'

export default {
  name: 'TextWorkspaceView',
  components: {
    AppLayout
  },
  data() {
    return {
      selectedFile: '',
      fileContent: '',
      textFiles: [
        { id: 1, name: 'transcription.txt', content: 'Contenu de la transcription...' },
        { id: 2, name: 'dataset_questions.txt', content: 'Liste des questions du dataset...' },
        { id: 3, name: 'notes_reunion.txt', content: 'Notes de la réunion du 15 mai...' }
      ],
      showNewFileModal: false,
      newFileName: '',
      newFileType: 'txt'
    }
  },
  computed: {
    isNewFileNameValid() {
      return this.newFileName.trim().length > 0;
    }
  },
  watch: {
    selectedFile(newVal) {
      if (newVal) {
        // Charger le contenu du fichier sélectionné
        const file = this.textFiles.find(f => f.id === newVal);
        if (file) {
          this.fileContent = file.content;
        }
      } else {
        this.fileContent = '';
      }
    }
  },
  methods: {
    createNewFile() {
      // Réinitialiser les valeurs et afficher le modal
      this.newFileName = '';
      this.newFileType = 'txt';
      this.showNewFileModal = true;
    },
    confirmNewFile() {
      if (!this.isNewFileNameValid) return;
      
      // Ajouter l'extension si elle n'est pas déjà présente
      let fileName = this.newFileName;
      if (!fileName.endsWith('.' + this.newFileType)) {
        fileName += '.' + this.newFileType;
      }
      
      // Créer un nouvel ID (incrément simple pour la démo)
      const newId = Math.max(...this.textFiles.map(f => f.id), 0) + 1;
      
      // Ajouter le nouveau fichier
      this.textFiles.push({
        id: newId,
        name: fileName,
        content: ''
      });
      
      // Sélectionner le nouveau fichier
      this.selectedFile = newId;
      
      // Fermer le modal
      this.showNewFileModal = false;
      
      // Feedback utilisateur
      alert(`Le fichier "${fileName}" a été créé avec succès.`);
    },
    saveFile() {
      if (!this.selectedFile) return;
      
      // Mettre à jour le contenu du fichier sélectionné
      const fileIndex = this.textFiles.findIndex(f => f.id === this.selectedFile);
      if (fileIndex !== -1) {
        this.textFiles[fileIndex].content = this.fileContent;
        
        // Feedback utilisateur
        alert(`Le fichier "${this.textFiles[fileIndex].name}" a été sauvegardé.`);
      }
    },
    exportFile() {
      if (!this.selectedFile) return;
      
      const file = this.textFiles.find(f => f.id === this.selectedFile);
      if (!file) return;
      
      // Créer un blob avec le contenu du fichier
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Créer un lien de téléchargement et le déclencher
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      // Feedback utilisateur
      alert(`Le fichier "${file.name}" a été exporté.`);
    }
  }
}
</script>

<style scoped>
.text-workspace {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}

.page-title {
  margin-bottom: 24px;
  font-size: 28px;
  color: #333;
}

.text-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.file-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-selector select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  min-width: 200px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #f5f5f7;
  cursor: pointer;
}

.action-btn:hover:not(:disabled) {
  background-color: #e5e5e7;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 16px;
}

.editor-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px;
  background-color: #f5f5f7;
  border-bottom: 1px solid #eee;
}

.tool-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}

.tool-btn:hover {
  background-color: #e5e5e7;
}

.separator {
  width: 1px;
  height: 20px;
  background-color: #ddd;
  margin: 0 5px;
}

.editor-content {
  padding: 15px;
}

.text-editor {
  width: 100%;
  min-height: 400px;
  border: none;
  resize: vertical;
  outline: none;
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
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

.secondary-btn {
  background-color: #f5f5f7;
  color: #333;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Styles pour le modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
  width: 100%;
  max-width: 450px;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
}
</style>