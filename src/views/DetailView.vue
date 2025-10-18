<template>
  <div class="container">
    <router-link to="/" class="back-btn">返回</router-link>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="cake" class="detail">
      <img :src="cake.cover" :alt="cake.name" class="detail-img" />

      <div class="detail-info">
        <h2>{{ cake.name }}</h2>
        <p class="category">分类：{{ cake.categoryName || '未分类' }}</p>
        <p class="desc">{{ cake.description || '暂无描述' }}</p>

        <!-- 尺寸选择 -->
        <div class="size-selector">
          <h3>选择尺寸</h3>
          <div v-if="cake.sizes.length === 0" class="no-sizes">
            暂无尺寸选项
          </div>
          <div v-else class="size-options">
            <button
                v-for="size in cake.sizes"
                :key="size.inch"
                class="size-btn"
                :class="{ active: selectedSize === size.inch }"
                @click="selectedSize = size.inch"
            >
              <div class="size-name">{{ size.name }}</div>
              <div v-if="size.description" class="size-desc">
                {{ size.description }}
              </div>
              <div class="size-price">¥{{ size.price }}</div>
            </button>
          </div>
        </div>

        <div class="price-info">
          <span>选中：{{ selectedSizeName }}</span>
          <span class="final-price">¥{{ selectedSizePrice }}</span>
        </div>
      </div>
    </div>

    <div v-else class="error">商品不存在</div>
  </div>
</template>

<script>
import { AV } from '@/utils/leancloud'

export default {
  name: 'DetailView',
  data() {
    return {
      cake: null,
      loading: true,
      selectedSize: null
    }
  },
  computed: {
    selectedSizePrice() {
      if (!this.cake || !this.selectedSize) return 0
      const size = this.cake.sizes.find(s => s.inch === this.selectedSize)
      return size ? size.price : 0
    },
    selectedSizeName() {
      if (!this.cake || !this.selectedSize) return ''
      const size = this.cake.sizes.find(s => s.inch === this.selectedSize)
      return size ? size.name : ''
    }
  },
  mounted() {
    this.loadDetail()
  },
  methods: {
    async loadDetail() {
      try {
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

        const sizes = cakeObj.get('sizes') || []

        this.cake = {
          id: cakeObj.id,
          name: cakeObj.get('name'),
          cover: cakeObj.get('cover'),
          description: cakeObj.get('description'),
          categoryName: categoryName,
          sizes: sizes
        }

        // 默认选中第一个尺寸
        if (this.cake.sizes.length > 0) {
          this.selectedSize = this.cake.sizes[0].inch
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
.container {
  max-width: 600px;
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
  transition: color 0.3s;
}

.back-btn:hover {
  color: #ff6b6b;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-info h2 {
  font-size: 24px;
  margin: 0;
  color: #333;
}

.category {
  color: #999;
  margin: 0;
  font-size: 14px;
}

.desc {
  line-height: 1.8;
  color: #666;
  margin: 0;
}

/* 尺寸选择 */
.size-selector {
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.size-selector h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #333;
}

.no-sizes {
  text-align: center;
  color: #999;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.size-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.size-btn {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  padding: 12px 16px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
}

.size-btn:hover {
  border-color: #ff6b6b;
  background: #fff0f0;
}

.size-btn.active {
  border-color: #ff6b6b;
  background: #ff6b6b;
  color: white;
}

.size-name {
  font-weight: 600;
  font-size: 16px;
}

.size-desc {
  font-size: 12px;
  opacity: 0.8;
}

.size-price {
  font-weight: bold;
  font-size: 16px;
  margin-top: 4px;
}

.price-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #fff0f0;
  border-radius: 8px;
  border-top: 1px solid #eee;
  margin-top: 10px;
  font-size: 14px;
}

.final-price {
  font-size: 24px;
  color: #ff6b6b;
  font-weight: bold;
}

.loading,
.error {
  text-align: center;
  padding: 60px 0;
  color: #999;
}
</style>
