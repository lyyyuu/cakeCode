<template>
  <div class="tabs">
    <button
        class="tab"
        :class="{ active: modelValue === null }"
        @click="$emit('update:modelValue', null)"
    >
      全部
    </button>
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
import { AV } from '@/utils/leancloud'  // 改这里

export default {
  name: 'CategoryTabs',
  props: {
    modelValue: {
      type: String,  // 改为 String（LeanCloud 的 ID 是字符串）
      default: null
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
      // 修改为 LeanCloud 查询
      const query = new AV.Query('Category')
      query.ascending('sort')  // 按 sort 升序排列

      const results = await query.find()

      // 转换数据格式
      this.categories = results.map(item => ({
        id: item.id,  // LeanCloud 的 ID
        name: item.get('name'),
        sort: item.get('sort')
      }))
    }
  }
}
</script>

<style scoped>
/* 样式不变 */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.tab {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
  font-size: 14px;
}

.tab:hover {
  background: #f0f0f0;
}

.tab.active {
  background: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
}
</style>
