<template>
  <div class="cake-list">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="cakes.length === 0" class="empty">暂无商品</div>
    <div v-else class="cake-grid">
      <CakeCard
          v-for="cake in cakes"
          :key="cake.id"
          :cake="cake"
      />
    </div>
  </div>
</template>

<script>
import { AV } from '@/utils/leancloud'  // 改这里
import CakeCard from './CakeCard.vue'

export default {
  name: 'CakeList',
  components: {
    CakeCard
  },
  props: {
    categoryId: {
      type: String,  // 改为 String
      default: null
    }
  },
  data() {
    return {
      cakes: [],
      loading: true
    }
  },
  watch: {
    categoryId: {
      handler() {
        this.loadCakes()
      },
      immediate: true
    }
  },
  methods: {
    async loadCakes() {
      this.loading = true

      // 修改为 LeanCloud 查询
      const query = new AV.Query('Cake')
      query.equalTo('status', 1)  // 只查询上架的商品

      // 如果有分类筛选
      if (this.categoryId) {
        query.equalTo('categoryId', this.categoryId)
      }

      const results = await query.find()

      // 转换数据格式
      this.cakes = results.map(item => ({
        id: item.id,
        name: item.get('name'),
        cover: item.get('cover'),
        price: item.get('price'),
        description: item.get('description')
      }))

      this.loading = false
    }
  }
}
</script>

<style scoped>
/* 样式不变 */
.cake-list {
  min-height: 300px;
}

.cake-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.loading,
.empty {
  text-align: center;
  color: #999;
  padding: 60px 0;
  font-size: 16px;
}

@media (max-width: 768px) {
  .cake-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }
}
</style>
