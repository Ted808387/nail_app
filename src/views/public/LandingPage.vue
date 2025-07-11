<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-soft-blue-50">
    <header class="text-center py-16 px-4 bg-soft-blue-200 w-full rounded-b-3xl shadow-lg">
      <h1 class="text-5xl font-bold text-soft-blue-800 mb-4">歡迎來到我們的美麗工作室</h1>
      <p class="text-xl text-soft-blue-700 mb-8">在這裡，找到專屬於您的美麗與放鬆時刻。</p>
      <div class="flex justify-center space-x-4">
        <router-link to="/services" class="px-8 py-3 bg-soft-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">查看服務項目</router-link>
        <router-link to="/booking" class="px-8 py-3 bg-white text-soft-blue-600 text-lg font-semibold rounded-full shadow-md border border-soft-blue-600 hover:bg-soft-blue-50 transition duration-300">立即預約</router-link>
      </div>
    </header>

    <section class="py-16 px-4 w-full max-w-4xl">
      <h2 class="text-4xl font-bold text-soft-blue-800 text-center mb-12">熱門服務</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center transform hover:scale-105 transition duration-300 border border-soft-blue-100">
          <h3 class="text-2xl font-semibold text-soft-blue-700 mb-4">手部光療</h3>
          <p class="text-soft-blue-600">專業細緻的手部光療服務，包含基礎保養。</p>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center transform hover:scale-105 transition duration-300 border border-soft-blue-100">
          <h3 class="text-2xl font-semibold text-soft-blue-700 mb-4">日式嫁接睫毛</h3>
          <p class="text-soft-blue-600">自然濃密的日式睫毛嫁接，讓雙眼更有神。</p>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center transform hover:scale-105 transition duration-300 border border-soft-blue-100">
          <h3 class="text-2xl font-semibold text-soft-blue-700 mb-4">頭皮護理</h3>
          <p class="text-soft-blue-600">深層清潔與滋養，改善頭皮健康。</p>
        </div>
      </div>
    </section>

    <section class="py-16 px-4 w-full bg-soft-blue-100 rounded-t-3xl shadow-lg">
      <h2 class="text-4xl font-bold text-soft-blue-800 text-center mb-12">客戶好評</h2>
      <div class="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center border border-soft-blue-200">
        <p class="text-soft-blue-700 text-lg italic mb-4">"環境很舒適，美甲師非常專業，每次來都非常放鬆！"</p>
        <span class="text-soft-blue-600 font-semibold">- 陳小姐</span>
      </div>
    </section>
  </div>
</template>

<script setup>
// 這裡可以加入頁面的邏輯，例如從後端獲取資料
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>