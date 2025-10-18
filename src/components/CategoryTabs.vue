<template>
  <div :class="['tabs', { vertical: vertical }]">
    <button
        v-for="category in categories"
        :key="category.id"
        class="tab"
        :class="{ active: modelValue === category.id }"
        @click="$emit('update:modelValue', category.id)"
    >
      {{ category.name }}
    </button>
  </div>
</template>

<script>
import { AV } from '@/utils/leancloud'

export default {
  name: 'CategoryTabs',
  props: {
    modelValue: {
      type: String,
      default: null
    },
    vertical: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      categories: []
    }
  },
  mounted() {
    this.loadCategories()
  },
  methods: {
    async loadCategories() {
      const query = new AV.Query('Category')
      query.ascending('sort')

      const results = await query.find()

      this.categories = results.map(item => ({
        id: item.id,
        name: item.get('name'),
        sort: item.get('sort')
      }))

      // 默认选中第一个分类
      if (this.categories.length > 0 && !this.modelValue) {
        this.$emit('update:modelValue', this.categories[0].id)
      }
    }
  }
}
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.tabs.vertical {
  flex-direction: column;
  overflow-x: visible;
  padding-bottom: 0;
  gap: 8px;
}

.tab {
  padding: 10px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
  font-size: 14px;
}

.tabs.vertical .tab {
  width: 100%;
  text-align: left;
}

.tab:hover {
  background: #f0f0f0;
}

.tab.active {
  background: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
  font-weight: bold;
}
</style>
