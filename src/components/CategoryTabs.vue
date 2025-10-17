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
import { supabase } from '@/utils/supabase'

export default {
  name: 'CategoryTabs',
  props: {
    modelValue: {
      type: Number,
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
      const { data } = await supabase
          .from('category')
          .select('*')
          .order('sort', { ascending: true })

      this.categories = data || []
    }
  }
}
</script>

<style scoped>
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
