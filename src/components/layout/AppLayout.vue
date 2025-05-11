<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="app-title">Airudit</h1>
      <div class="user-controls">
        <button class="user-btn">👤</button>
        <button class="settings-btn">⚙️</button>
      </div>
    </header>
    
    <div class="app-content">
      <aside class="app-sidebar">
        <nav class="nav-menu">
          <router-link to="/" class="nav-item">
            <span class="nav-icon">📊</span> Dashboard
          </router-link>
          <router-link to="/upload" class="nav-item">
            <span class="nav-icon">📁</span> Gestion des fichiers
          </router-link>
          <router-link to="/text" class="nav-item">
            <span class="nav-icon">📝</span> Espace texte
          </router-link>
          <router-link to="/audio" class="nav-item">
            <span class="nav-icon">🎵</span> Espace audio
          </router-link>
        </nav>
      </aside>
      
      <main class="main-content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppLayout'
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: white;
  padding: 0.8rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;
}

.app-title {
  color: #C6246F;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.user-controls {
  display: flex;
  gap: 0.8rem;
}

.user-btn, .settings-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-btn:hover, .settings-btn:hover {
  background-color: #f5f5f7;
}

.app-content {
  display: flex;
  flex: 1;
}

.app-sidebar {
  width: 240px;
  background-color: #f9f9f9;
  padding: 1.5rem 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background-color: #f0f0f0;
}

.nav-item.router-link-active {
  background-color: #f0f0f0;
  color: #C6246F;
  border-left: 3px solid #C6246F;
}

.nav-icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f5f5f7;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .app-content {
    flex-direction: column;
  }
  
  .app-sidebar {
    width: 100%;
    padding: 0.5rem 0;
  }
  
  .nav-menu {
    flex-direction: row;
    overflow-x: auto;
    padding: 0 1rem;
  }
  
  .nav-item {
    white-space: nowrap;
    padding: 0.5rem 1rem;
  }
  
  .nav-item.router-link-active {
    border-left: none;
    border-bottom: 3px solid #C6246F;
  }
  
  .main-content {
    padding: 1rem;
  }
}
</style>