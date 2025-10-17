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
import { supabase } from '@/utils/supabase'
import CakeCard from './CakeCard.vue'

export default {
  name: 'CakeList',
  components: {
    CakeCard
  },
  props: {
    categoryId: {
      type: Number,
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

      let query = supabase
          .from('cake')
          .select('*')
          .eq('status', 1)

      if (this.categoryId) {
        query = query.eq('category_id', this.categoryId)
      }

      const { data } = await query
      this.cakes = data || []
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
