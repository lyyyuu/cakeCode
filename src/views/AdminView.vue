<template>
  <div class="container">
    <h1>🛠️ 管理后台</h1>
    <router-link to="/" class="link">查看前台</router-link>

    <div class="admin-form">
      <h2>添加蛋糕</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>分类</label>
          <select v-model="form.category_id" required>
            <option
                v-for="cat in categories"
                :key="cat.id"
                :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>名称</label>
          <input v-model="form.name" type="text" required />
        </div>

        <div class="form-group">
          <label>封面图片URL</label>
          <input v-model="form.cover" type="url" required />
        </div>

        <div class="form-group">
          <label>价格</label>
          <input v-model.number="form.price" type="number" step="0.01" required />
        </div>

        <div class="form-group">
          <label>描述</label>
          <textarea v-model="form.description" rows="4"></textarea>
        </div>

        <button type="submit" class="btn" :disabled="submitting">
          {{ submitting ? '添加中...' : '添加蛋糕' }}
        </button>
      </form>

      <div v-if="message" :class="['message', message.type]">
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/utils/supabase'

export default {
  name: 'AdminView',
  data() {
    return {
      categories: [],
      submitting: false,
      message: null,
      form: {
        category_id: '',
        name: '',
        cover: '',
        price: 0,
        description: ''
      }
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
          .order('sort')

      this.categories = data || []
      if (data && data.length > 0) {
        this.form.category_id = data[0].id
      }
    },
    async handleSubmit() {
      this.submitting = true
      this.message = null

      const { error } = await supabase
          .from('cake')
          .insert([this.form])

      this.submitting = false

      if (error) {
        this.message = {
          type: 'error',
          text: '添加失败：' + error.message
        }
      } else {
        this.message = {
          type: 'success',
          text: '添加成功！'
        }

        // 重置表单
        this.form.name = ''
        this.form.cover = ''
        this.form.price = 0
        this.form.description = ''

        // 3秒后清除消息
        setTimeout(() => {
          this.message = null
        }, 3000)
      }
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

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.link {
  display: block;
  text-align: center;
  color: #666;
  text-decoration: none;
  margin-bottom: 30px;
}

.link:hover {
  color: #ff6b6b;
}

.admin-form {
  max-width: 600px;
  margin: 0 auto;
}

.admin-form h2 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff6b6b;
}

.btn {
  width: 100%;
  background: #ff6b6b;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.btn:hover:not(:disabled) {
  background: #ff5252;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  margin-top: 15px;
  padding: 12px;
  border-radius: 4px;
  text-align: center;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
