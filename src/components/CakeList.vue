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
import { AV } from '@/utils/leancloud'
import CakeCard from './CakeCard.vue'

export default {
  name: 'CakeList',
  components: {
    CakeCard
  },
  props: {
    categoryId: {
      type: String,
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

      const query = new AV.Query('Cake')
      query.equalTo('status', 1)

      if (this.categoryId) {
        query.equalTo('categoryId', this.categoryId)
      }

      const results = await query.find()

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
.cake-list {
  min-height: 300px;
}

.cake-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
}

.loading,
.empty {
  text-align: center;
  color: #999;
  padding: 60px 0;
  font-size: 16px;
}
</style>
