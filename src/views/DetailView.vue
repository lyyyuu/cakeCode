<template>
  <div class="container">
    <router-link to="/" class="back-btn">← 返回</router-link>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="cake" class="detail">
      <img :src="cake.cover" :alt="cake.name" class="detail-img" />
      <h2>{{ cake.name }}</h2>
      <p class="category">分类：{{ cake.category?.name || '未分类' }}</p>
      <p class="price">¥{{ cake.price }}</p>
      <p class="desc">{{ cake.description || '暂无描述' }}</p>
    </div>

    <div v-else class="error">商品不存在</div>
  </div>
</template>

<script>
import { supabase } from '@/utils/supabase'

export default {
  name: 'DetailView',
  data() {
    return {
      cake: null,
      loading: true
    }
  },
  mounted() {
    this.loadDetail()
  },
  methods: {
    async loadDetail() {
      const { data, error } = await supabase
          .from('cake')
          .select('*, category(name)')
          .eq('id', this.$route.params.id)
          .single()

      if (!error && data) {
        this.cake = data
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-btn {
  display: inline-block;
  margin-bottom: 20px;
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.back-btn:hover {
  color: #ff6b6b;
}

.detail-img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}

.detail h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.category {
  color: #999;
  margin: 10px 0;
}

.price {
  color: #ff6b6b;
  font-size: 28px;
  font-weight: bold;
  margin: 15px 0;
}

.desc {
  line-height: 1.8;
  color: #666;
  margin-top: 20px;
}

.loading,
.error {
  text-align: center;
  padding: 60px 0;
  color: #999;
}
</style>
