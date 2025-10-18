<template>
  <div class="home-container">
    <!-- 左侧分类 -->
    <aside class="sidebar">
      <h2 class="sidebar-title">蛋糕分类</h2>
      <CategoryTabs v-model="currentCategory" :vertical="true" />
    </aside>

    <!-- 右侧内容 -->
    <main class="main-content">
      <h1 class="page-title">蛋糕商城</h1>
      <CakeList :category-id="currentCategory" />

      <div class="admin-link">
        <router-link to="/admin">管理后台</router-link>
      </div>
    </main>
  </div>
</template>

<script>
import CategoryTabs from '@/components/CategoryTabs.vue'
import CakeList from '@/components/CakeList.vue'

export default {
  name: 'HomeView',
  components: {
    CategoryTabs,
    CakeList
  },
  data() {
    return {
      currentCategory: null
    }
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
}

.sidebar {
  width: 200px;
  background: white;
  padding: 20px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-title {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
}

.admin-link {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.admin-link a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  transition: all 0.3s;
}

.admin-link a:hover {
  background: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
}

@media (max-width: 768px) {
  .home-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
}
</style>
