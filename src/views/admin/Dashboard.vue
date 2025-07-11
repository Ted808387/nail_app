<template>
  <div class="admin-dashboard">
    <h1>儀表板</h1>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>今日預約數</h3>
        <p>5</p>
      </div>
      <div class="stat-card">
        <h3>本週預估收入</h3>
        <p>NT$ 25,000</p>
      </div>
      <div class="stat-card">
        <h3>近期新客戶</h3>
        <p>12</p>
      </div>
    </div>
    <!-- 這裡可以放更多圖表元件 -->
  </div>
</template>

<script setup>
// 這裡可以加入獲取儀表板數據的邏輯
</script>

<style scoped>
.admin-dashboard { padding: 20px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
.stat-card { background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: .25rem; padding: 20px; text-align: center; }
.stat-card h3 { margin-top: 0; }
.stat-card p { font-size: 2em; font-weight: bold; margin-bottom: 0; }
</style>
