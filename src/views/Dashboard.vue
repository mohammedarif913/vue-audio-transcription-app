<template>
  <app-layout>
    <h2 class="page-title">Dashboard</h2>
    
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-title">Total des fichiers</div>
        <div class="stat-value blue">{{ fileService.state.files.length }}</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-title">Fichiers audio</div>
        <div class="stat-value purple">{{ audioFilesCount }}</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-title">Fichiers texte</div>
        <div class="stat-value purple">{{ textFilesCount }}</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-title">En traitement</div>
        <div class="stat-value red">{{ fileService.state.processingCount }}</div>
      </div>
    </div>
    
    <div class="action-buttons">
      <router-link to="/upload" class="btn primary">Ajouter des fichiers</router-link>
      <button class="btn secondary" @click="startProcessing" :disabled="fileService.state.pendingCount === 0">
        Lancer le traitement ({{ fileService.state.pendingCount }})
      </button>
    </div>
    
    <div class="recent-files">
      <h3>Fichiers récents</h3>
      <table class="files-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Taille</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in recentFiles" :key="file.id" :class="{'file-processing': file.status === 'en traitement'}">
            <td>{{ file.name }}</td>
            <td>{{ file.type.charAt(0).toUpperCase() + file.type.slice(1) }}</td>
            <td>{{ file.size }}</td>
            <td :class="'status-' + file.status.replace(' ', '-')">
              {{ file.status.charAt(0).toUpperCase() + file.status.slice(1) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from '@/components/layout/AppLayout.vue'
import fileService from '@/services/fileService'

export default {
  name: 'DashboardView',
  components: {
    AppLayout
  },
  data() {
    return {
      fileService
    }
  },
  computed: {
    audioFilesCount() {
      return this.fileService.state.files.filter(file => file.type === 'audio').length;
    },
    textFilesCount() {
      return this.fileService.state.files.filter(file => file.type === 'texte').length;
    },
    recentFiles() {
      // Trier par date (du plus récent au plus ancien) et prendre les 5 premiers
      return [...this.fileService.state.files]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    }
  },
  methods: {
    startProcessing() {
      // Simuler le démarrage du traitement pour tous les fichiers en attente
      this.fileService.state.files.forEach((file, index) => {
        if (file.status === 'en attente') {
          setTimeout(() => {
            const fileIndex = this.fileService.state.files.findIndex(f => f.id === file.id);
            if (fileIndex !== -1) {
              this.fileService.state.files[fileIndex].status = 'en traitement';
              this.fileService.updateCounts();
              
              // Puis simuler la fin du traitement après quelques secondes
              setTimeout(() => {
                this.fileService.state.files[fileIndex].status = 'traité';
                this.fileService.updateCounts();
              }, 5000);
            }
          }, 1000 * index); // Décaler le traitement de chaque fichier pour l'effet visuel
        }
      });
      
      // Feedback utilisateur
      alert('Traitement démarré pour tous les fichiers en attente.');
    }
  }
}
</script>

<style scoped>
.page-title {
  margin-bottom: 24px;
  font-size: 28px;
  color: #333;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.stat-title {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
}

.stat-value.blue { color: #4285F4; }
.stat-value.purple { color: #A142F4; }
.stat-value.red { color: #EA4335; }

.action-buttons {
  margin-bottom: 30px;
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn.primary {
  background-color: #C6246F;
  color: white;
}

.btn.secondary {
  background-color: #f5f5f7;
  color: #333;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.recent-files h3 {
  margin-bottom: 16px;
  font-size: 20px;
  color: #333;
}

.files-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.files-table th, .files-table td {
  padding: 12px 16px;
  text-align: left;
}

.files-table th {
  background-color: #f5f5f7;
  font-weight: 500;
  color: #555;
}

.files-table tr:not(:last-child) {
  border-bottom: 1px solid #eee;
}

.file-processing {
  background-color: rgba(33, 150, 243, 0.05);
}

.status-en-attente {
  color: #f2c037;
  font-weight: 500;
}

.status-en-traitement {
  color: #2196f3;
  font-weight: 500;
}

.status-traité {
  color: #4caf50;
  font-weight: 500;
}
</style>