<template>
  <div class="error-page">
    <div class="error-container">
      <h1>{{ error.statusCode }}</h1>
      <h2>{{ error.statusMessage }}</h2>
      <p v-if="error.statusCode === 500">
        Server error occurred. Please try again later.
      </p>
      <p v-else>
        {{ error.message || 'An error occurred' }}
      </p>
      <button @click="handleError" class="retry-button">
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const handleError = async () => {
  await clearError({ redirect: '/' })
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Cairo', sans-serif;
}

.error-container {
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
}

h1 {
  font-size: 4rem;
  color: #e74c3c;
  margin: 0;
  font-weight: 700;
}

h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 1rem 0;
  font-weight: 600;
}

p {
  color: #7f8c8d;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 1.5rem 0;
}

.retry-button {
  background: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  font-family: 'Cairo', sans-serif;
}

.retry-button:hover {
  background: #2980b9;
}
</style>
