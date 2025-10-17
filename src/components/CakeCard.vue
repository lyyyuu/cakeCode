<template>
  <div class="cake-card" @click="goToDetail">
    <img :src="cake.cover" :alt="cake.name" />
    <h3>{{ cake.name }}</h3>
    <p class="price">¥{{ cake.price }}</p>
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
  methods: {
    goToDetail() {
      this.$router.push(`/detail/${this.cake.id}`)
    }
  }
}
</script>

<style scoped>
.cake-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  background: white;
}

.cake-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cake-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.cake-card h3 {
  padding: 10px;
  font-size: 16px;
  color: #333;
  margin: 0;
}

.cake-card .price {
  padding: 0 10px 10px;
  color: #ff6b6b;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}
</style>
