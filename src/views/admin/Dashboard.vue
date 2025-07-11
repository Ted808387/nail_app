<template>
  <div class="min-h-screen bg-soft-blue-50 p-8">
    <h1 class="text-4xl font-bold text-soft-blue-800 text-center mb-10">儀表板</h1>

    <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="stat-card bg-white rounded-2xl shadow-lg p-8 text-center border border-soft-blue-200">
        <h3 class="text-2xl font-semibold text-soft-blue-700 mb-4">今日預約數</h3>
        <p class="text-5xl font-bold text-soft-blue-900">5</p>
      </div>
      <div class="stat-card bg-white rounded-2xl shadow-lg p-8 text-center border border-soft-blue-200">
        <h3 class="text-2xl font-semibold text-soft-blue-700 mb-4">本週預估收入</h3>
        <p class="text-5xl font-bold text-soft-blue-900">NT$ 25,000</p>
      </div>
      <div class="stat-card bg-white rounded-2xl shadow-lg p-8 text-center border border-soft-blue-200">
        <h3 class="text-2xl font-semibold text-soft-blue-700 mb-4">近期新客戶</h3>
        <p class="text-5xl font-bold text-soft-blue-900">12</p>
      </div>
    </div>

    <!-- 這裡可以放更多圖表元件 -->
    <div class="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8 border border-soft-blue-200">
      <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6">近期預約概覽</h2>
      <p class="text-soft-blue-600">這裡將顯示近期預約的圖表或列表。</p>
    </div>
  </div>
</template>

<script setup>
// 這裡可以加入獲取儀表板數據的邏輯
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>