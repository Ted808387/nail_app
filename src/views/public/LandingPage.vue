<template>
  <div class="landing-page">
    <header class="hero-section">
      <h1>歡迎來到我們的美麗工作室</h1>
      <p>在這裡，找到專屬於您的美麗與放鬆時刻。</p>
      <div class="cta-buttons">
        <router-link to="/services" class="btn btn-primary">查看服務項目</router-link>
        <router-link to="/booking" class="btn btn-secondary">立即預約</router-link>
      </div>
    </header>

    <section class="featured-services">
      <h2>熱門服務</h2>
      <!-- 這裡可以放一些精選服務的卡片 -->
      <div class="service-cards">
        <div class="card">手部光療</div>
        <div class="card">日式嫁接睫毛</div>
        <div class="card">頭皮護理</div>
      </div>
    </section>

    <section class="testimonials">
      <h2>客戶好評</h2>
      <div class="testimonial">
        <p>"環境很舒適，美甲師非常專業！"</p>
        <span>- 陳小姐</span>
      </div>
    </section>
  </div>
</template>

<script setup>
// 這裡可以加入頁面的邏輯，例如從後端獲取資料
</script>

<style scoped>
.landing-page {
  text-align: center;
}
.hero-section {
  padding: 50px 20px;
  background-color: #f5f5f5;
}
.cta-buttons .btn {
  margin: 0 10px;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
}
.btn-primary {
  background-color: #007bff;
  color: white;
}
.btn-secondary {
  background-color: #6c757d;
  color: white;
}
.featured-services, .testimonials {
  padding: 40px 20px;
}
.service-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}
.card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
