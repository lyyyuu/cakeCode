<template>
  <div class="container">
    <h1>🎂 蛋糕商城</h1>

    <CategoryTabs v-model="currentCategory" />

    <CakeList :category-id="currentCategory" />

    <div class="admin-link">
      <router-link to="/admin">管理后台</router-link>
    </div>
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
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  margin-bottom: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.admin-link {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.admin-link a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.admin-link a:hover {
  color: #ff6b6b;
}
</style>
