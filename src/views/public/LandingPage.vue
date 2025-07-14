<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-soft-blue-50">
    <!-- 品牌形象區 - 輪播/影片 Placeholder -->
    <section class="relative w-full h-96 bg-soft-blue-300 flex items-center justify-center text-white text-center overflow-hidden shadow-lg">
      <img src="https://via.placeholder.com/1920x1080?text=Your+Beautiful+Studio" alt="Studio Image" class="absolute inset-0 w-full h-full object-cover opacity-75">
      <div class="relative z-10 p-4">
        <h1 class="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">歡迎來到我們的美麗殿堂</h1>
        <p class="text-xl md:text-2xl mb-8 drop-shadow-md">在這裡，找到專屬於您的美麗與放鬆時刻。</p>
        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <router-link to="/services" class="px-8 py-3 bg-soft-blue-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-soft-blue-700 transition duration-300 transform hover:scale-105">查看服務項目</router-link>
          <router-link to="/booking" class="px-8 py-3 bg-white text-soft-blue-600 text-lg font-semibold rounded-full shadow-lg border border-soft-blue-600 hover:bg-soft-blue-50 transition duration-300 transform hover:scale-105">立即預約</router-link>
        </div>
      </div>
    </section>

    <!-- 主打服務 / 作品集 -->
    <section class="py-16 px-4 w-full max-w-6xl">
      <h2 class="text-4xl font-bold text-soft-blue-800 text-center mb-12">我們的精選服務</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 服務卡片 1 -->
        <div class="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center transform hover:scale-105 transition duration-300 border border-soft-blue-100">
          <img src="https://via.placeholder.com/300x200?text=Hand+Care" alt="手部光療" class="w-full h-48 object-cover rounded-lg mb-6 shadow-md">
          <h3 class="text-2xl font-semibold text-soft-blue-700 mb-3">手部光療</h3>
          <p class="text-soft-blue-600 mb-4">專業細緻的手部光療服務，包含基礎保養與多樣款式選擇，讓您的指尖綻放光彩。</p>
          <router-link to="/services" class="text-soft-blue-500 hover:text-soft-blue-700 font-medium">了解更多 &rarr;</router-link>
        </div>
        <!-- 服務卡片 2 -->
        <div class="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center transform hover:scale-105 transition duration-300 border border-soft-blue-100">
          <img src="https://via.placeholder.com/300x200?text=Eyelash+Extension" alt="日式嫁接睫毛" class="w-full h-48 object-cover rounded-lg mb-6 shadow-md">
          <h3 class="text-2xl font-semibold text-soft-blue-700 mb-3">日式嫁接睫毛</h3>
          <p class="text-soft-blue-600 mb-4">自然濃密的日式睫毛嫁接，採用輕柔手法，讓雙眼更有神，告別睫毛膏。</p>
          <router-link to="/services" class="text-soft-blue-500 hover:text-soft-blue-700 font-medium">了解更多 &rarr;</router-link>
        </div>
        <!-- 服務卡片 3 -->
        <div class="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center transform hover:scale-105 transition duration-300 border border-soft-blue-100">
          <img src="https://via.placeholder.com/300x200?text=Scalp+Treatment" alt="頭皮護理" class="w-full h-48 object-cover rounded-lg mb-6 shadow-md">
          <h3 class="text-2xl font-semibold text-soft-blue-700 mb-3">頭皮護理</h3>
          <p class="text-soft-blue-600 mb-4">深層清潔與滋養頭皮，改善髮質問題，讓您的頭皮重獲健康活力。</p>
          <router-link to="/services" class="text-soft-blue-500 hover:text-soft-blue-700 font-medium">了解更多 &rarr;</router-link>
        </div>
      </div>
    </section>

    <!-- 品牌故事 / 關於我們 -->
    <section class="py-16 px-4 w-full bg-soft-blue-100">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-soft-blue-800 mb-8">我們的故事</h2>
        <p class="text-soft-blue-700 text-lg leading-relaxed mb-6">
          我們相信，美麗不僅是外在的呈現，更是內在自信的散發。
          自創立以來，我們致力於提供最專業、最貼心的美業服務，
          從手部護理到睫毛嫁接，從頭皮養護到身心放鬆，
          每一個細節都只為讓您感受到無微不至的呵護。
        </p>
        <p class="text-soft-blue-700 text-lg leading-relaxed">
          我們的團隊由經驗豐富的專業技師組成，不斷精進技術，
          只為給您帶來最前沿、最舒適的美麗體驗。
          期待與您一同開啟這趟美麗旅程。
        </p>
      </div>
    </section>

    <!-- 客戶好評 -->
    <section class="py-16 px-4 w-full max-w-6xl">
      <h2 class="text-4xl font-bold text-soft-blue-800 text-center mb-12">客戶怎麼說</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- 好評卡片 1 -->
        <div class="bg-white p-8 rounded-2xl shadow-xl text-center border border-soft-blue-200">
          <p class="text-soft-blue-700 text-lg italic mb-4">"環境很舒適，美甲師非常專業，每次來都非常放鬆！強烈推薦！"</p>
          <span class="text-soft-blue-600 font-semibold">- 陳小姐</span>
        </div>
        <!-- 好評卡片 2 -->
        <div class="bg-white p-8 rounded-2xl shadow-xl text-center border border-soft-blue-200">
          <p class="text-soft-blue-700 text-lg italic mb-4">"睫毛嫁接技術一流，非常自然，而且維持很久，以後只來這裡了！"</p>
          <span class="text-soft-blue-600 font-semibold">- 林女士</span>
        </div>
      </div>
    </section>

    <!-- 頁腳 (可選，未來可獨立為組件) -->
    <footer class="w-full bg-soft-blue-800 text-white py-8 text-center">
      <p>&copy; 2025 您的美麗工作室. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
// 這裡可以加入頁面的邏輯，例如從後端獲取資料
// 例如：
// import { ref, onMounted } from 'vue';
// const featuredServices = ref([]);
// onMounted(async () => {
//   // 假設有一個 API 來獲取精選服務
//   // const response = await fetch('/api/featured-services');
//   // featuredServices.value = await response.json();
// });
</script>

<style scoped>
/* 這裡可以放置 LandingPage 特有的樣式，但盡量使用 Tailwind CSS */
</style>
