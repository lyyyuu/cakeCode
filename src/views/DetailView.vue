<template>
  <div class="container">
    <router-link to="/" class="back-btn">← 返回</router-link>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="cake" class="detail">
      <img :src="cake.cover" :alt="cake.name" class="detail-img" />
      <h2>{{ cake.name }}</h2>
      <p class="category">分类：{{ cake.categoryName || '未分类' }}</p>
      <p class="price">¥{{ cake.price }}</p>
      <p class="desc">{{ cake.description || '暂无描述' }}</p>
    </div>

    <div v-else class="error">商品不存在</div>
  </div>
</template>

<script>
import { AV } from '@/utils/leancloud'  // 改这里

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
      try {
        // 查询蛋糕信息
        const query = new AV.Query('Cake')
        const cakeObj = await query.get(this.$route.params.id)

        // 获取分类信息
        const categoryId = cakeObj.get('categoryId')
        let categoryName = '未分类'

        if (categoryId) {
          const categoryQuery = new AV.Query('Category')
          const category = await categoryQuery.get(categoryId)
          categoryName = category.get('name')
        }

        // 组装数据
        this.cake = {
          id: cakeObj.id,
          name: cakeObj.get('name'),
          cover: cakeObj.get('cover'),
          price: cakeObj.get('price'),
          description: cakeObj.get('description'),
          categoryName: categoryName
        }
      } catch (error) {
        console.error('加载失败', error)
      }

      this.loading = false
    }
  }
}
</script>

<style scoped>
/* 样式不变 */
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
