<template>
  <div class="cake-card">
    <router-link :to="`/detail/${cake.id}`" class="card-link">
      <img :src="cake.cover" :alt="cake.name" class="cake-img" />
      <div class="cake-info">
        <h3>{{ cake.name }}</h3>
        <p class="description">{{ cake.description }}</p>
        <p class="price">¥{{ minPrice }} 起</p>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'CakeCard',
  props: {
    cake: {
      type: Object,
      required: true
    }
  },
  computed: {
    minPrice() {
      if (!this.cake.sizes || this.cake.sizes.length === 0) {
        return 0
      }
      return Math.min(...this.cake.sizes.map(s => s.price))
    }
  }
}
</script>

<style scoped>
.cake-card {
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.cake-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.card-link {
  display: flex;
  gap: 15px;
  text-decoration: none;
  color: inherit;
  padding: 15px;
}

.cake-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.cake-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cake-info h3 {
  font-size: 18px;
  margin: 0 0 8px 0;
  color: #333;
}

.description {
  font-size: 13px;
  color: #999;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.price {
  font-size: 18px;
  color: #ff6b6b;
  font-weight: bold;
  margin: 8px 0 0 0;
}
</style>
