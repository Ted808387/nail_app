## 專案概述 (README_AI.md)

**專案名稱:** Sidep App (實際為預約/服務管理系統)

**專案性質:**
*   基於 **Vite + Vue** 的 Web 應用程式。
*   **非 Electron 應用程式**，`README.md` 中關於側邊欄的描述可能已過時或不適用於當前程式碼庫。

**核心功能 (已確認):**
*   預約/服務管理系統。
*   包含公共頁面 (如登陸頁、服務列表) 和管理員後台。

**目前進度與重要修改:**

1.  **登入/註冊導航:**
    *   在 `src/views/public/LandingPage.vue` 中添加了導向 `/account/signin` (登入) 和 `/account/signup` (註冊) 的按鈕/連結，方便使用者導航。
    *   **已移除 `LandingPage.vue` 中的局部導航，改為使用全局 Navbar。**
2.  **管理員登入:**
    *   確認管理員登入頁面為 `src/views/public/SignIn.vue` (路由 `/account/signin`)。
    *   測試管理員帳號: `admin@example.com` / `admin123`。
    *   管理員註冊驗證碼: `BEAUTY2025`。
    *   管理員登入後導向 `/admin` (儀表板)。
3.  **預約管理行事曆 (`src/views/admin/BookingCalendar.vue`):**
    *   **點擊日期新增預約:** 實現了點擊日曆中的日期即可彈出新增預約模態框，並自動帶入點擊的日期。
    *   **日期顯示錯誤修正:** 修正了因時區問題導致日期少一天的錯誤，確保日期正確顯示。
    *   **日視圖 UI 優化:**
        *   單日視圖下，日期單元格會放大並佔滿日曆區域。
        *   顯示更詳細的日期資訊和「本日無預約」提示。
    *   **週視圖 UI 優化:**
        *   增加了日期單元格的最小高度 (`min-h-32`)。
        *   優化了預約項目的顯示，增加了垂直間距 (`space-y-1`)。
        *   為預約項目列表添加了溢出滾動 (`overflow-y-auto max-h-24`)。
    *   **數據持久化:** 使用 `localStorage` 實現預約數據的儲存和載入，確保數據在重新整理後不會丟失。
    *   **預約操作優化:** 在儲存和刪除預約時，增加了載入狀態和更友好的提示（模擬後端整合）。
4.  **全局導航欄 (Navbar):**
    *   創建了 `src/components/Navbar.vue` 組件，包含「首頁」、「服務項目」、「立即預約」、「登入」、「註冊」和「管理員儀表板」連結。
    *   在 `src/App.vue` 中引入並使用了 `Navbar`，使其在所有頁面顯示。
    *   **已優化: Navbar 的響應式優化 (小螢幕下的漢堡菜單，並添加了浮動列表動畫，漢堡圖示應靠右顯示)。**
5.  **響應式設計優化 (所有頁面):**
    *   **`LandingPage.vue` (登陸頁面):** 調整了主視覺區塊高度、文字大小、按鈕組排列，確保在不同螢幕尺寸下良好呈現。
    *   **`SignIn.vue` (登入頁面):** 調整了容器內邊距、表單元素間距、字體大小和按鈕樣式，使其在小螢幕上更友好。
    *   **`SignUp.vue` (註冊頁面):** 類似於登入頁面，對表單佈局、輸入框大小、按鈕樣式和「同意條款」區塊進行了優化，確保在不同螢幕尺寸下都能良好呈現。
    *   **`ServiceList.vue` (服務項目列表):** 優化了篩選/排序區塊、服務項目卡片佈局和文字大小，使其在手機上更易於瀏覽。
    *   **`BookingFlow.vue` (預約流程):** 對多步驟流程的各個環節（步驟指示器、服務選擇、日期時間選擇、確認資訊、成功頁面）的佈局、字體大小、間距和按鈕進行了全面響應式優化。
    *   **`MyBookings.vue` (我的預約紀錄):** 優化了預約卡片佈局、文字大小和按鈕樣式，使其在不同螢幕尺寸下更具可讀性。
    *   **`Dashboard.vue` (管理員儀表板):** 優化了關鍵數據概覽卡片、快捷操作按鈕、數據可視化區塊和待處理預約列表的佈局和字體大小，**並已更新為從 `dataService.js` 載入數據。**
    *   **`ServiceManagement.vue` (服務項目管理):** 優化了頂部操作區塊、服務列表表格和新增/編輯服務模態框的佈局、字體大小、間距和按鈕樣式，使其在不同螢幕尺寸下都能良好呈現。
    *   **`ClientManagement.vue` (客戶名單管理):** 優化了搜尋輸入框和客戶列表表格的佈局、字體大小、間距和按鈕樣式，並為「查看詳情」操作添加了載入狀態和提示。
    *   **`BusinessSettings.vue` (營業設定):** 優化了營業時間和特別公休日設定區塊的佈局、字體大小、間距和按鈕樣式，使其在不同螢幕尺寸下都能良好呈現。
    *   **`AdminSetup.vue` (首次管理員設定):** 優化了表單佈局、字體大小、間距和按鈕樣式，使其在不同螢幕尺寸下都能良好呈現。

6.  **管理員功能完善:**
    *   **`ClientDetail.vue` (客戶詳情頁面):** 新增了客戶詳情頁面，用於顯示單個客戶的詳細資訊和編輯功能，並模擬了數據載入和更新操作，添加了載入狀態和通知提示。
    *   **`ClientManagement.vue` (客戶名單管理):** 將「查看詳情」按鈕改為彈出視窗，直接在當前頁面顯示和編輯客戶詳細資訊，無需跳轉頁面。原 `ClientDetail.vue` 已整合並移除。
    *   **`Dashboard.vue` (管理員儀表板):** 「近期待處理訂單」中的「查看詳情」按鈕現在以彈出視窗方式顯示預約詳情，並整合了編輯功能，原 `BookingDetail.vue` 已整合並移除。
    *   **`Dashboard.vue` (管理員儀表板):** 「近期待處理訂單」中的「查看詳情」按鈕現在以彈出視窗方式顯示預約詳情，並整合了編輯功能，原 `BookingDetail.vue` 已整合並移除。

7.  **全局通知組件:**
    *   **已創建全局通知組件 (`Notification.vue`) 和組合式函數 (`useNotification.js`)，並將所有 `alert()` 調用替換為 `useNotification` 提供的通知。**

8.  **數據服務層:**
    *   **已創建 `src/services/dataService.js`，用於集中管理所有 `localStorage` 相關的數據操作。**
    *   **所有使用 `localStorage` 的組件都已更新為使用 `dataService.js` 進行數據持久化。**

9.  **用戶認證狀態管理:**
    *   **已修改 `src/composables/useAuth.js`，使其透過 `src/api/index.js` 呼叫後端 API 進行實際的 `login` 和 `register` 操作。**
    *   **`useAuth.js` 現在提供 `isLoggedIn`、`isAdmin`、`login`、`register`、`logout` 和 `checkAuthStatus` 方法。**
    *   **`Navbar.vue` 已更新為根據登入狀態顯示不同按鈕，並實現登出功能。**
    *   **`SignIn.vue` 和 `SignUp.vue` 已更新為使用 `useAuth.js` 的 `login` 和 `register` 方法來處理用戶認證。**
    *   **`AccountSettings.vue` 已更新為使用 `useAuth.js` 提供的認證狀態。**
    *   **`Dashboard.vue` 已更新為從 `dataService.js` 載入數據 (此處應為從 API 載入，但此處僅記錄 `useAuth` 相關)。**
    *   `src/router/index.js`：已更新路由守衛，限制已登入用戶訪問登入/註冊頁面。✅

10. **模擬 API 層:**
    *   **已創建 `src/api/index.js`，用於提供模擬的 API 請求函數。**
    *   **`BookingCalendar.vue` 已更新為使用 `src/api/index.js` 進行數據操作。**
    *   **`ServiceManagement.vue` 已更新為使用 `src/api/index.js` 進行數據操作。**
    *   **`ClientManagement.vue` 已更新為使用 `src/api/index.js` 進行數據操作。**
    *   **`ClientDetail.vue` 已更新為使用 `src/api/index.js` 進行數據操作。**
    *   **`ServiceList.vue` 已更新為使用 `src/api/index.js` 進行數據操作。**
    *   **`BookingFlow.vue` 已更新為使用 `src/api/index.js` 進行數據操作。**
    *   **`MyBookings.vue` 已更新為使用 `src/api/index.js` 進行數據操作。**
    *   **`AccountSettings.vue` 已更新為使用 `src/api/index.js` 進行數據操作。**
    *   **`SignIn.vue` 和 `SignUp.vue` 已更新為使用 `src/api/index.js` 進行數據操作。**
    *   **已解決 `ServiceManagement.vue` 中 `saveService` 重複宣告的錯誤 (將本地函數重新命名為 `handleSaveService`)。

11. **API 串接與功能完善:**
    *   **使用者個人資料管理:**
        *   後端已新增 `GET /users/me`、`PUT /users/me` 和 `POST /users/me/change-password` API。
        *   前端 `src/api/index.js` 中的 `fetchUserById`、`updateUserProfile` 和 `changeUserPassword` 函數已完成串接。
    *   **服務狀態快速切換:**
        *   後端已新增 `PATCH /services/{service_id}/status` API。
        *   前端 `src/api/index.js` 中的 `updateServiceStatus` 函數已完成串接。
    *   **服務批次操作:**
        *   後端已新增 `POST /services/bulk-action` API。
        *   前端 `src/api/index.js` 中的 `bulkServiceAction` 函數已完成串接。

        *   前端 `src/api/index.js` 中的 `bulkServiceAction` 函數已完成串接。
    *   **營業設定統一管理:**
        *   後端已新增 `PUT /admin/settings/` API。
        *   前端 `src/api/index.js` 中的 `saveBusinessSettings` 函數已完成串接。

        *   前端 `src/api/index.js` 中的 `saveBusinessSettings` 函數已完成串接。
    *   **可預約時間段管理:**
        *   後端已新增 `POST /admin/settings/time-slots` 和 `DELETE /admin/settings/time-slots/{time_slot_id}` API。
        *   前端 `src/api/index.js` 中的 `addTimeSlotApi` 和 `removeTimeSlotApi` 函數已完成串接。

11. **功能增強與優化:**
    *   **服務時長範圍化:** 在 `ServiceManagement.vue` 中，將服務的「所需時間時長」從單一數字改為「最短時長」和「最長時長」的範圍輸入。相應地更新了 `src/api/index.js` 和 `src/services/dataService.js` 以支援新的數據結構。
    *   **預約流程服務時長顯示修正:** 修正了 `BookingFlow.vue` 中服務時長顯示為 `NaN` 的問題，現在會正確顯示服務時長範圍。
    *   **營業設定新增不可預約日期與時間段落:** 在 `BusinessSettings.vue` 中新增了管理員設定不可預約日期和可預約時間段落的 UI 介面。相應地更新了 `src/api/index.js` 和 `src/services/dataService.js` 以支援新的數據結構和 API 函數。
    *   **營業設定頁面功能修正:** 修正了 `BusinessSettings.vue` 中新增按鈕無作用的問題，並確保在沒有設定可預約時間段時，預約流程頁面預設為全天可預約。
    *   **營業設定數據持久化修正:** 修正了 `src/services/dataService.js` 中營業設定（公休日、不可預約日期、可預約時間段落）的載入邏輯，確保預設數據只在 `localStorage` 中沒有資料時才寫入，解決了移除後預設數據仍保留的問題。
    *   **預約流程時間段預設邏輯優化:** 優化了 `BookingFlow.vue` 中可預約時間段的生成邏輯，當管理員未設定特定時間段時，將預設顯示營業時間內的所有時間段。
    *   **管理行事曆營業設定整合確認:** 確認 `BookingCalendar.vue` 已正確整合營業設定中的公休日、不可預約日期和營業時間，以標記日曆中的不可預約日期。可預約時間段落主要用於客戶端預約流程，管理員手動預約時可靈活輸入。
    *   **客戶端預約日期選擇器優化:** 將 `BookingFlow.vue` 中的日期輸入框替換為自定義的 `CustomerCalendar.vue` 組件，提供更直觀的日曆選擇體驗，並顯示已被預約的日期。
    *   **客戶端日曆組件錯誤修正:** 修正了 `CustomerCalendar.vue` 和 `BookingFlow.vue` 中因數據載入時序和 `ref` 變數存取方式導致的 `TypeError`。
    *   **預約流程步驟二錯誤修正:** 修正了 `BookingFlow.vue` 中選擇服務後點擊「下一步」時的錯誤，確保 `filteredAvailableTimes` 和 `isDateBookable` 在營業設定數據載入完成後才進行計算。
    *   **預約編號生成優化:** 將預約編號的生成方式調整為 `BOOK` 前綴加上 6 位隨機英數字串，以提高唯一性和可讀性。
    *   **預約時間選擇精細化:**
        *   在 `BookingFlow.vue` 的步驟二中，時間選擇列表現在會顯示所有符合管理員設定的可預約時間段。
        *   已被預約的時間段會被禁用並標示為「(已預約)」。
        *   `CustomerCalendar.vue` 中的日曆顯示邏輯已優化，只有當某個日期的所有可預約時間段都被預約滿時，該日期才會顯示為「已預約」。
    *   **客戶端日曆「已預約」狀態邏輯優化:**
        *   修正了舊預約紀錄缺少 `totalDuration` 時，導致日曆可用性判斷錯誤的 bug (現在會預設為 30 分鐘)。
        *   日曆現在會根據使用者選擇的服務總時長 (`bookingDuration`)，動態檢查當天是否有足夠的**連續空閒時段**。
        *   如果找不到足夠長的連續時段，該日期將被正確標示為「已預約」，防止使用者選擇無法完成服務的日期。
    *   **服務項目圖片上傳:**
        *   在 `ServiceManagement.vue` 的新增/編輯服務視窗中，新增了圖片上傳及預覽功能。
        *   管理者可以上傳本地圖片，系統會將其轉換為 Base64 格式儲存，並顯示在服務列表及客戶端頁面。
        *   修正了 `ServiceList.vue` 中服務時長顯示不正確的問題。
    *   **服務項目管理列表篩選:**
        *   在 `ServiceManagement.vue` 頁面新增了依「類別」和「狀態」（上架中/已下架）篩選服務的功能，方便管理者快速查找特定服務。
    *   **我的預約紀錄體驗優化:**
        *   在 `MyBookings.vue` 頁面，使用者現在可以點擊任何一筆預約紀錄，來開啟一個顯示完整預約詳情的彈出視窗。
        *   彈出視窗內整合了「取消預約」功能（僅適用於即將到來的預約），提供更流暢的操作體驗。
        *   在預約詳情彈窗中，客戶可以編輯預約的「備註」欄位，並提供「儲存」和「取消」功能。

---

### Tips for Gemini CLI Agent

*   **每次有中大型的更新，請務必更新此 `README_AI.md` 檔案，記錄下專案的最新進度、重要修改和待辦事項。**
*   這將有助於您在每次啟動時快速了解專案上下文，提高工作效率。
*   請保持內容簡潔明瞭，重點突出。

---

## 前端開發進度

### 階段一：前端 `dataService` 替換為真實 API 呼叫

1.  **安裝 Axios：**
    *   在 `sidep_app` 專案中安裝了 `axios` HTTP 客戶端函式庫。

2.  **配置 Axios 實例與 JWT 攔截器：**
    *   修改了 `src/api/index.js`，引入 `axios` 並配置 `apiClient` 實例。
    *   設定後端 API 的基礎 URL (`http://127.0.0.1:8000`)。
    *   添加請求攔截器，用於自動在每個受保護的請求中添加 JWT Token 到 `Authorization` 頭部。
    *   添加響應攔截器，用於處理全局錯誤（例如 401 Unauthorized，自動跳轉到登入頁）。

3.  **替換認證相關的 API 呼叫：**
    *   修改了 `src/api/index.js` 中的 `registerUser` 和 `loginUser` 函數，使其呼叫後端 `/auth/register` 和 `/auth/login` 端點。
    *   在 `loginUser` 成功後，將返回的 JWT Token 儲存到 `localStorage` 中。

4.  **替換預約相關的 API 呼叫：**
    *   修改了 `src/api/index.js` 中的 `fetchBookings`、`saveBooking` 和 `deleteBooking` 函數，使其呼叫後端 `/bookings` 端點。

5.  **替換服務相關的 API 呼叫：**
    *   修改了 `src/api/index.js` 中的 `fetchServices`、`saveService`、`updateServiceStatus`、`deleteServiceApi` 和 `bulkServiceAction` 函數，使其呼叫後端 `/services` 端點。

6.  **替換客戶相關的 API 呼叫：**
    *   修改了 `src/api/index.js` 中的 `fetchClients`、`fetchClientById` 和 `updateClient` 函數，使其呼叫後端 `/admin/clients` 端點。

7.  **替換營業設定相關的 API 呼叫：**
    *   修改了 `src/api/index.js` 中的 `fetchBusinessSettings`、`saveBusinessSettings`、`addHoliday`、`removeHoliday`、`addUnavailableDateApi` 和 `removeUnavailableDateApi` 函數，使其呼叫後端 `/admin/settings` 端點。

---

### **前端 API 連接與測試狀態**

**目標：** 將前端 UI 與後端 API 連接，並驗證其功能。

**測試原則：**
*   開發完成一個功能模組後，立即進行前後端整合測試。
*   測試完成後，在此處更新狀態，以追蹤專案進度。

---

#### **階段一：認證與使用者資料**

1.  **`src/views/public/SignUp.vue` (註冊頁面)**
    *   **API 函數：** `registerUser`
    *   **連接點：** 註冊表單提交。
    *   **開發狀態：** 已完成。
    *   **測試狀態：** **已完成**。✅

2.  **`src/views/public/SignIn.vue` (登入頁面)**
    *   **API 函數：** `loginUser`
    *   **連接點：** 登入表單提交。
    *   **開發狀態：** 已完成。
    *   **測試狀態：** **已完成**。✅

3.  **`src/components/Navbar.vue` (全局導航欄)**
    *   **API 函數：** `useAuth().logout`
    *   **連接點：** 「登出」按鈕點擊。
    *   **開發狀態：** 已完成。
    *   **測試狀態：** **已完成**。✅

4.  **`src/views/customer/AccountSettings.vue` (帳戶設定頁面)**
    *   **API 函數：** `fetchUserById`, `updateUserProfile`, `changeUserPassword`
    *   **連接點：** 頁面載入、更新個人資料、修改密碼。
    *   **開發狀態：** 已完成。
    *   **測試狀態：** 待測試。

---

#### **階段二：服務管理 (管理員)**

1.  **`src/views/admin/ServiceManagement.vue` (服務項目管理頁面)**
    *   **API 函數：** `fetchServices`, `saveService`, `updateServiceStatus`, `bulkServiceAction`
    *   **連接點：** 頁面載入、新增/編輯服務、刪除服務、切換狀態、批次操作。
    *   **開發狀態：** 已完成。
    *   **測試狀態：** **已完成** (新增/編輯服務)。其餘待測試。

2.  **`src/views/public/ServiceList.vue` (服務項目列表頁面)**
    *   **API 函數：** `fetchServices`
    *   **連接點：** 頁面載入。
    *   **開發狀態：** 已完成。
    *   **測試狀態：** **已完成**。✅

---

#### **階段三：預約管理**

1.  **`src/views/customer/BookingFlow.vue` (預約流程頁面)**
    *   **API 函數：** `fetchServices`, `saveBooking`
    *   **連接點：** 服務選擇、提交預約。
    *   **開發狀態：** 已完成。
    *   **測試狀態：** 待測試。

2.  **`src/views/customer/MyBookings.vue` (我的預約紀錄頁面)**
    *   **API 函數：** `fetchBookings`
    *   **連接點：** 頁面載入、取消預約。
    *   **開發狀態：** 已完成。
    *   **測試狀態：** 待測試。

3.  **`src/views/admin/BookingCalendar.vue` (管理員預約行事曆頁面)**
    *   **API 函數：** `fetchBookings`, `saveBooking`, `updateBookingStatus`, `deleteBooking`
    *   **連接點：** 頁面載入、新增/更新/刪除預約。
    *   **開發狀態：** 已完成。
    *   **測試狀態：** 待測試。

4.  **`src/views/admin/Dashboard.vue` (管理員儀表板頁面)**
    *   **API 函數：** `fetchBookings`
    *   **連接點：** 頁面載入。
    *   **開發狀態：** 已完成。
    *   **測試狀態：** 待測試。

---

#### **階段四：客戶管理 (管理員)**

1.  **`src/views/admin/ClientManagement.vue` (客戶名單管理頁面)**
    *   **API 函數：** `fetchClients`, `fetchClientById`, `updateClient`
    *   **連接點：** 頁面載入、查看/更新客戶資料。
    *   **開發狀態：** 已完成。
    *   **測試狀態：** 待測試。

---

#### **階段五：營業設定 (管理員)**

1.  **`src/views/admin/BusinessSettings.vue` (營業設定頁面)**
    *   **API 函數：** `fetchBusinessSettings`, `saveBusinessSettings`, `addHoliday`, `removeHoliday`, `addUnavailableDateApi`, `removeUnavailableDateApi`, `addTimeSlotApi`, `removeTimeSlotApi`
    *   **連接點：** 頁面載入、保存設定、新增/刪除假日、不可預約日期、時間段。
    *   **開發狀態：** 已完成。
    *   **測試狀態：** **已完成** (設定營業時間)。其餘待測試。

---

**目前狀態：**

*   前端專案 `sidep_app` 中的 `src/api/index.js` 檔案已完成修改，所有模擬的 `dataService` 呼叫都已替換為對後端 FastAPI API 的實際 HTTP 請求。
*   `addTimeSlotApi` 和 `removeTimeSlotApi` 這些函數在前端仍有 `console.warn` 提示，因為後端目前沒有直接對應的 API 端點。

**下一步：**

1.  **啟動前端開發伺服器：** 在 `sidep_app` 資料夾中執行 `npm run dev`。
2.  **啟動後端 FastAPI 應用程式：** 在 `sidep_backend` 資料夾中執行 `uvicorn main:app --reload`。
3.  **測試前端應用程式：** 在瀏覽器中訪問前端應用程式，並測試其功能，例如註冊、登入、查看服務、預約等，看看它們是否能正確地與後端互動。

### **Pinia 狀態管理整合**

**目標：** 將核心狀態管理從 `localStorage` 和 `ref` 遷移到 Pinia，以提供更集中、可維護的狀態管理。

**進度：**

1.  **安裝 Pinia：** 已完成。✅
2.  **設定 Pinia：** 已完成 (`src/main.js`)。✅
3.  **創建 `auth` Store：** 已完成 (`src/stores/auth.js`)。✅
4.  **更新 `useAuth.js`：** 已完成，現在 `useAuth` 透過 `useAuthStore` 獲取和操作認證狀態。✅
5.  **更新相關組件：**
    *   `src/components/Navbar.vue`：已更新為使用 `storeToRefs` 確保 `isLoggedIn` 和 `isAdmin` 的響應性。✅
    *   `src/views/public/SignIn.vue`：已更新為使用 `storeToRefs` 確保 `isAdmin` 的響應性。✅
    *   `src/views/public/SignUp.vue`：已更新為透過 `useAuth().register` 處理註冊邏輯。✅
    *   `src/views/customer/AccountSettings.vue`：已更新為使用 `useUserProfileStore` 管理用戶個人資料。✅
    *   `src/views/customer/MyBookings.vue`：已更新為使用 `useBookingStore` 管理預約資料。✅
    *   `src/views/admin/BookingCalendar.vue`：已更新為使用 `useBookingStore`、`useServiceStore`、`useClientStore` 和 `useBusinessSettingsStore` 管理相關資料。✅
    *   `src/views/admin/Dashboard.vue`：已更新為使用 `useBookingStore`、`useClientStore` 和 `useServiceStore` 管理相關資料。✅
    *   `src/views/admin/ServiceManagement.vue`：已更新為使用 `useServiceStore` 管理服務資料。✅
    *   `src/views/public/ServiceList.vue`：已更新為使用 `useServiceStore` 管理服務資料。✅
    *   `src/views/admin/ClientManagement.vue`：已更新為使用 `useClientStore` 管理客戶資料。✅
    *   `src/views/admin/BusinessSettings.vue`：已更新為使用 `useBusinessSettingsStore` 管理營業設定資料。✅

**下一步：** 繼續測試各功能模組，確保 Pinia 整合後所有功能正常運作。

### **登出功能完善**

**目標：** 確保登出功能不僅清除前端狀態，還能通知後端使 JWT Token 失效。

**進度：**

1.  **後端 `sidep_backend/models.py`：** 已添加 `BlacklistedToken` 模型。✅
2.  **後端 `sidep_backend/schemas.py`：** 已添加 `BlacklistedToken` 的 Pydantic Schema。✅
3.  **後端 `sidep_backend/main.py`：**
    *   已新增 `/auth/logout` 端點，將 Token 加入黑名單。✅
    *   已修改 `get_current_user` 函數，檢查 Token 是否在黑名單中。✅
4.  **前端 `src/api/index.js`：** 已新增 `logoutUser` API 函數。✅
5.  **前端 `src/stores/auth.js`：** 已更新 `logout` action，呼叫 `logoutUser` API。✅

**下一步：** 測試登出功能，確認 Token 是否正確失效。
