<template>
  <div class="admin-container">
    <h1>管理后台</h1>
    <router-link to="/" class="link">返回前台</router-link>

    <!-- Tab 切换 -->
    <div class="tabs-header">
      <button
          class="tab-btn"
          :class="{ active: activeTab === 'category' }"
          @click="activeTab = 'category'"
      >
        分类管理
      </button>
      <button
          class="tab-btn"
          :class="{ active: activeTab === 'cake' }"
          @click="activeTab = 'cake'"
      >
        蛋糕管理
      </button>
    </div>

    <!-- 分类管理 -->
    <div v-if="activeTab === 'category'" class="admin-section">
      <h2>添加分类</h2>
      <form @submit.prevent="handleAddCategory">
        <div class="form-group">
          <label>分类名称</label>
          <input v-model="categoryForm.name" type="text" required />
        </div>

        <div class="form-group">
          <label>排序</label>
          <input v-model.number="categoryForm.sort" type="number" required />
        </div>

        <button type="submit" class="btn" :disabled="submitting">
          {{ submitting ? '添加中...' : '添加分类' }}
        </button>
      </form>

      <div v-if="categoryMessage" :class="['message', categoryMessage.type]">
        {{ categoryMessage.text }}
      </div>
    </div>

    <!-- 蛋糕管理 -->
    <div v-if="activeTab === 'cake'" class="admin-section">
      <h2>{{ editingCake ? '编辑蛋糕' : '添加蛋糕' }}</h2>
      <form @submit.prevent="handleAddCake">
        <div class="form-group">
          <label>分类</label>
          <select v-model="cakeForm.categoryId" required>
            <option value="">请选择分类</option>
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
          <input v-model="cakeForm.name" type="text" required />
        </div>

        <div class="form-group">
          <label>封面图片</label>
          <div class="upload-area">
            <input
                type="file"
                ref="fileInput"
                accept="image/*"
                @change="handleFileSelect"
                style="display: none"
            />
            <button
                type="button"
                class="upload-btn"
                @click="$refs.fileInput.click()"
            >
              {{ uploadStatus || '选择图片' }}
            </button>

            <div v-if="imagePreview" class="preview">
              <img :src="imagePreview" alt="预览" />
              <button type="button" @click="clearImage" class="clear-btn">
                ✕
              </button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>描述</label>
          <textarea v-model="cakeForm.description" rows="4"></textarea>
        </div>

        <!-- 尺寸管理 -->
        <div class="form-group">
          <label>蛋糕尺寸</label>
          <div class="sizes-manager">
            <div v-if="cakeForm.sizes.length === 0" class="no-sizes-tip">
              暂无尺寸，请添加
            </div>

            <div v-for="(size, index) in cakeForm.sizes" :key="index" class="size-item">
              <input
                  v-model="size.inch"
                  type="text"
                  placeholder="英寸数（如：4、6、8）"
                  class="size-input small"
                  required
              />
              <input
                  v-model="size.name"
                  type="text"
                  placeholder="显示名称（如：4英寸）"
                  class="size-input"
                  required
              />
              <input
                  v-model.number="size.price"
                  type="number"
                  step="0.01"
                  placeholder="价格"
                  class="size-input medium"
                  required
              />
              <input
                  v-model="size.description"
                  type="text"
                  placeholder="描述（如：2-3人，可选）"
                  class="size-input"
              />
              <button
                  type="button"
                  @click="removeCakeSize(index)"
                  class="btn-remove"
              >
                删除
              </button>
            </div>

            <button
                type="button"
                @click="addCakeSize"
                class="btn btn-secondary btn-add-size"
            >
              添加尺寸
            </button>
          </div>
        </div>

        <button type="submit" class="btn" :disabled="submitting">
          {{ submitting ? '提交中...' : (editingCake ? '更新蛋糕' : '添加蛋糕') }}
        </button>

        <button
            v-if="editingCake"
            type="button"
            class="btn btn-cancel"
            @click="cancelEdit"
        >
          取消编辑
        </button>
      </form>

      <div v-if="cakeMessage" :class="['message', cakeMessage.type]">
        {{ cakeMessage.text }}
      </div>

      <!-- 蛋糕列表 -->
      <div class="cake-list">
        <h3>蛋糕列表</h3>
        <div v-if="cakes.length === 0" class="empty">暂无蛋糕</div>
        <div v-else class="list-items">
          <div v-for="cake in cakes" :key="cake.id" class="list-item">
            <img :src="cake.cover" :alt="cake.name" class="item-img" />
            <div class="item-info">
              <h4>{{ cake.name }}</h4>
              <p class="sizes-preview">
                {{ cake.sizes.map(s => s.name).join(' / ') }}
              </p>
            </div>
            <div class="item-actions">
              <button @click="startEdit(cake)" class="action-btn edit">编辑</button>
              <button @click="deleteCake(cake.id)" class="action-btn delete">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { AV } from '@/utils/leancloud'

export default {
  name: 'AdminView',
  data() {
    return {
      activeTab: 'category',
      categories: [],
      cakes: [],
      submitting: false,
      uploadStatus: null,
      imagePreview: null,
      editingCake: null,

      categoryForm: {
        name: '',
        sort: 1
      },
      categoryMessage: null,

      cakeForm: {
        categoryId: '',
        name: '',
        cover: '',
        description: '',
        sizes: []
      },
      cakeMessage: null
    }
  },
  mounted() {
    this.loadCategories()
    this.loadCakes()
  },
  methods: {
    async loadCategories() {
      const query = new AV.Query('Category')
      query.ascending('sort')

      const results = await query.find()

      this.categories = results.map(item => ({
        id: item.id,
        name: item.get('name')
      }))
    },

    async loadCakes() {
      const query = new AV.Query('Cake')
      query.descending('createdAt')

      const results = await query.find()

      this.cakes = results.map(item => ({
        id: item.id,
        name: item.get('name'),
        cover: item.get('cover'),
        description: item.get('description'),
        categoryId: item.get('categoryId'),
        sizes: item.get('sizes') || []
      }))
    },

    // ===== 分类管理 =====
    async handleAddCategory() {
      this.submitting = true
      this.categoryMessage = null

      try {
        const Category = AV.Object.extend('Category')
        const category = new Category()

        category.set('name', this.categoryForm.name)
        category.set('sort', this.categoryForm.sort)

        await category.save()

        this.categoryMessage = {
          type: 'success',
          text: '分类添加成功！'
        }

        this.categoryForm.name = ''
        this.categoryForm.sort = 1
        await this.loadCategories()

        setTimeout(() => {
          this.categoryMessage = null
        }, 3000)

      } catch (error) {
        this.categoryMessage = {
          type: 'error',
          text: '添加失败：' + error.message
        }
      }

      this.submitting = false
    },

    // ===== 蛋糕管理 =====
    async handleFileSelect(event) {
      const file = event.target.files[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        this.imagePreview = e.target.result
      }
      reader.readAsDataURL(file)

      this.uploadStatus = '上传中...'

      try {
        const avFile = new AV.File(file.name, file)
        await avFile.save()

        this.cakeForm.cover = avFile.url()
        this.uploadStatus = '上传成功'

        setTimeout(() => {
          this.uploadStatus = null
        }, 2000)

      } catch (error) {
        this.uploadStatus = '上传失败'
        alert('图片上传失败：' + error.message)
      }
    },

    clearImage() {
      this.imagePreview = null
      this.cakeForm.cover = ''
      this.uploadStatus = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },

    addCakeSize() {
      this.cakeForm.sizes.push({
        inch: '',
        name: '',
        price: 0,
        description: ''
      })
    },

    removeCakeSize(index) {
      this.cakeForm.sizes.splice(index, 1)
    },

    async handleAddCake() {
      // 验证尺寸
      if (this.cakeForm.sizes.length === 0) {
        alert('请至少添加一个尺寸')
        return
      }

      for (let i = 0; i < this.cakeForm.sizes.length; i++) {
        const size = this.cakeForm.sizes[i]
        if (!size.inch || !size.name || size.price <= 0) {
          alert(`第 ${i + 1} 个尺寸信息不完整`)
          return
        }
      }

      this.submitting = true
      this.cakeMessage = null

      try {
        let cake
        if (this.editingCake) {
          const query = new AV.Query('Cake')
          cake = await query.get(this.editingCake.id)
        } else {
          const Cake = AV.Object.extend('Cake')
          cake = new Cake()
        }

        cake.set('categoryId', this.cakeForm.categoryId)
        cake.set('name', this.cakeForm.name)
        cake.set('cover', this.cakeForm.cover)
        cake.set('description', this.cakeForm.description)
        cake.set('sizes', this.cakeForm.sizes)
        cake.set('status', 1)

        await cake.save()

        this.cakeMessage = {
          type: 'success',
          text: this.editingCake ? '蛋糕更新成功！' : '蛋糕添加成功！'
        }

        this.resetCakeForm()
        await this.loadCakes()

        setTimeout(() => {
          this.cakeMessage = null
        }, 3000)

      } catch (error) {
        this.cakeMessage = {
          type: 'error',
          text: '操作失败：' + error.message
        }
      }

      this.submitting = false
    },

    startEdit(cake) {
      this.editingCake = cake
      this.cakeForm = {
        categoryId: cake.categoryId,
        name: cake.name,
        cover: cake.cover,
        description: cake.description,
        sizes: JSON.parse(JSON.stringify(cake.sizes)) // 深拷贝
      }
      this.imagePreview = cake.cover

      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    cancelEdit() {
      this.editingCake = null
      this.resetCakeForm()
    },

    resetCakeForm() {
      this.editingCake = null
      this.cakeForm = {
        categoryId: '',
        name: '',
        cover: '',
        description: '',
        sizes: []
      }
      this.clearImage()
    },

    async deleteCake(id) {
      if (!confirm('确定要删除这个蛋糕吗？')) return

      try {
        const query = new AV.Query('Cake')
        const cake = await query.get(id)
        await cake.destroy()

        alert('删除成功')
        await this.loadCakes()
      } catch (error) {
        alert('删除失败：' + error.message)
      }
    }
  }
}
</script>
<style scoped>
.admin-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
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

.tabs-header {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
}

.tab-btn {
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 15px;
  color: #666;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: #ff6b6b;
}

.tab-btn.active {
  color: #ff6b6b;
  border-bottom-color: #ff6b6b;
  font-weight: bold;
}

.admin-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.admin-section h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff6b6b;
}

/* 图片上传 */
.upload-area {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.upload-btn {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
  align-self: flex-start;
}

.upload-btn:hover {
  background: #45a049;
}

.preview {
  position: relative;
  width: 200px;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.clear-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.clear-btn:hover {
  background: rgba(255, 0, 0, 1);
}

/* 尺寸管理 */
.sizes-manager {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: #fafafa;
}

.no-sizes-tip {
  text-align: center;
  color: #999;
  padding: 20px;
}

.size-item {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  align-items: flex-end;
}

.size-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  flex: 1;
}

.size-input.small {
  max-width: 100px;
}

.size-input.medium {
  max-width: 120px;
}

.size-input:focus {
  outline: none;
  border-color: #ff6b6b;
}

.btn-remove {
  padding: 8px 14px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.3s;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-remove:hover {
  background: #da190b;
}

.btn-add-size {
  width: 100%;
  margin-top: 10px;
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
  margin-top: 10px;
}

.btn:hover:not(:disabled) {
  background: #ff5252;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #666;
}

.btn-secondary:hover:not(:disabled) {
  background: #555;
}

.btn-cancel {
  background: #999;
  margin-top: 10px;
}

.btn-cancel:hover {
  background: #888;
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

/* 蛋糕列表 */
.cake-list {
  margin-top: 40px;
  border-top: 2px solid #eee;
  padding-top: 30px;
}

.cake-list h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.list-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  transition: all 0.3s;
}

.list-item:hover {
  background: #f0f0f0;
}

.item-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
}

.sizes-preview {
  margin: 0;
  color: #999;
  font-size: 13px;
}

.item-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.action-btn.edit {
  background: #4CAF50;
  color: white;
}

.action-btn.edit:hover {
  background: #45a049;
}

.action-btn.delete {
  background: #f44336;
  color: white;
}

.action-btn.delete:hover {
  background: #da190b;
}

.empty {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .size-item {
    flex-wrap: wrap;
  }

  .size-input {
    min-width: 100%;
  }

  .size-input.small,
  .size-input.medium {
    max-width: 100%;
  }

  .btn-remove {
    width: 100%;
  }
}
</style>
