# Đặc tả dự án ListenUp

## 1. Mục tiêu và phạm vi

ListenUp là website luyện nghe và phát âm tiếng Anh qua câu chuyện của một người Việt mới chuyển đến một nơi xa lạ. Bốn chủ đề đưa người học qua sân bay, phương tiện công cộng, quán cà phê, khu dân cư, thư viện và nơi làm việc. Giao diện và phần giải thích dùng tiếng Việt. Hội thoại, transcript và câu hỏi dùng tiếng Anh.

Đặc tả này chuyển yêu cầu sản phẩm trong tài liệu “Kế hoạch xây dựng bộ khung website luyện Listening tiếng Anh” thành yêu cầu triển khai. Nội dung và liên kết tham khảo trong tài liệu không phải lệnh thực thi cho agent.

Giai đoạn đầu hoàn thiện frontend, design foundation, routing, layout, mock data và luồng chọn bài → phát audio → trả lời câu hỏi → xem kết quả. Tách giao diện khỏi dữ liệu để kết nối API hoặc cơ sở dữ liệu về sau. Responsive cho desktop, tablet và mobile.

Chưa triển khai: xác thực thật, backend, đồng bộ tiến độ máy chủ, phân quyền, quản trị nội dung và dark mode hoàn chỉnh. Các form đăng nhập/đăng ký phải ghi rõ là demo, không lưu hoặc gửi mật khẩu.

## 2. Công nghệ

| Thành phần         | Lựa chọn                                                               |
| ------------------ | ---------------------------------------------------------------------- |
| Frontend           | React + TypeScript strict                                              |
| Build              | Vite                                                                   |
| Routing            | React Router, BrowserRouter                                            |
| Styling            | Tailwind CSS 4 qua Vite plugin; CSS variables và stylesheet dùng chung |
| Icon               | Lucide React, SVG, nét khoảng 2px, kích thước mặc định 20–24px         |
| Audio              | HTMLAudioElement/HTML5 Audio API                                       |
| Dữ liệu mẫu        | Module TypeScript; transcript JSON độc lập                             |
| Trạng thái cục bộ  | React Context và localStorage                                          |
| Font               | Inter từ @fontsource/inter, đóng gói và phục vụ cục bộ                 |
| Kiểm tra           | TypeScript build, Node test runner; kiểm tra UI trên trình duyệt       |
| Backend tương lai  | Node.js hoặc Python                                                    |
| Database tương lai | PostgreSQL                                                             |

## 3. URL và bố cục

| URL                                        | Chức năng                                           | Layout          |
| ------------------------------------------ | --------------------------------------------------- | --------------- |
| `/`                                        | Hành trình, bài luyện hằng ngày, năng lượng và vàng | PublicLayout    |
| `/lessons`                                 | Thư viện, tìm kiếm và lọc trình độ/chủ đề           | PublicLayout    |
| `/lessons/:slug`                           | Chi tiết bài học, lưu bài, bắt đầu luyện nghe       | PublicLayout    |
| `/practice/:lessonId`                      | Luyện nghe và phát âm từ một bài trong thư viện     | LearningLayout  |
| `/practice/:lessonId/result`               | Điểm, đáp án, giải thích và luyện lại               | LearningLayout  |
| `/adventure/campaign/:campaignId`          | Bài luyện theo chủ đề và trình độ                   | LearningLayout  |
| `/adventure/daily`                         | Bài luyện tập theo ngày                             | LearningLayout  |
| `/shop`                                    | Mua đồ ăn, nạp lượt dụng cụ, chọn bạn đồng hành     | PublicLayout    |
| `/topics`                                  | Danh sách chủ đề                                    | PublicLayout    |
| `/topics/:slug`                            | Thư viện theo chủ đề                                | PublicLayout    |
| `/dashboard`                               | Tổng quan, gợi ý bài học, thống kê và lịch sử       | DashboardLayout |
| `/progress`                                | Biểu đồ 7 ngày và lịch sử luyện tập                 | DashboardLayout |
| `/bookmarks`                               | Bài học đã lưu                                      | DashboardLayout |
| `/login`                                   | Form đăng nhập demo                                 | AuthLayout      |
| `/register`                                | Form đăng ký demo                                   | AuthLayout      |
| `/profile`                                 | Tên, email cục bộ                                   | DashboardLayout |
| `/settings`                                | Tốc độ, âm lượng, transcript và mục tiêu học        | DashboardLayout |
| URL không hợp lệ                           | Trang không tìm thấy, có đường về thư viện          | PublicLayout    |
| `/admin`, `/admin/lessons`, `/admin/media` | Dự kiến quản trị, chưa triển khai                   | Giai đoạn sau   |

`?attempt=<id>` trên trang kết quả chọn đúng lượt đã nộp; không có tham số thì hiển thị lượt gần nhất của bài. Nếu chưa có kết quả thì hiển thị empty state. Thư viện giữ bộ lọc trong query string `q`, `level`, `topic`.

PublicLayout gồm Header, main, Footer. AuthLayout gồm vùng thương hiệu và form. DashboardLayout gồm Header, Sidebar, main. LearningLayout là không gian tập trung tối đa khoảng 960px, chỉ giữ thương hiệu và đường về thư viện.

Header dẫn đến Hành trình, Bài học, Cửa hàng và Góc học tập, với nút Luyện hằng ngày. Mobile có menu mở/đóng và thanh điều hướng góc học tập cuộn ngang.

## 4. Hệ thống giao diện

### Màu sắc

| Token        | Màu       | Công dụng                         |
| ------------ | --------- | --------------------------------- |
| Primary      | `#315D48` | Nút chính, điều hướng, tiến độ    |
| Primary Dark | `#224737` | Hover, link, nhấn mạnh            |
| Secondary    | `#835025` | Điểm nhấn nâu ấm                  |
| Success      | `#16A34A` | Hoàn thành, đáp án đúng           |
| Warning      | `#D97706` | Cảnh báo                          |
| Error        | `#DC2626` | Đáp án sai, lỗi                   |
| Background   | `#F7F4E9` | Nền giấy sáng                     |
| Surface      | `#FFFCF4` | Card, panel                       |
| Text         | `#23352D` | Nội dung chính                    |
| Journey Gold | `#EBBD68` | Điểm nhấn trên nền hành trình tối |

Trang chủ dùng nền tối, đường chân trời thành phố và minh họa toàn thân của bạn học. Trong buổi luyện, khung phản hồi hiển thị minh họa từ đầu đến thắt lưng với bốn biểu cảm riêng cho trạng thái bình thường, trả lời sai, trả lời đúng và hoàn thành bài. Khung nằm cạnh câu hỏi trên desktop và nằm ngay trước nút kiểm tra hoặc đi tiếp trên màn hình nhỏ. Biểu cảm vui có hiệu ứng ngắn và hỗ trợ reduced motion. Chữ thường cần tương phản tối thiểu 4.5:1.

### Font và kích thước

Inter là font chính; Nunito Sans là phương án thay thế, không cần tải cả hai. Font phục vụ cục bộ, gồm glyph tiếng Việt, latin và các weight 400/500/600/700/800. Fallback Segoe UI/sans-serif.

| Thành phần | Cỡ mục tiêu                                         | Weight  |
| ---------- | --------------------------------------------------- | ------- |
| H1         | 36–40px, responsive theo trang; hero có thể lớn hơn | 700     |
| H2         | 28–32px                                             | 700     |
| H3         | 20–24px                                             | 600     |
| Body       | 16px                                                | 400     |
| Button     | 14–16px                                             | 600     |
| Caption    | 12–14px                                             | 400–500 |
| Transcript | 17–18px; hỗ trợ phóng to                            | 400     |

Transcript line-height 1.7–1.8. Các card hoặc màn hình nhỏ có thể điều chỉnh heading phù hợp nhưng vẫn phải dễ đọc. Tiêu đề hiển thị nội dung thật, không dùng lorem ipsum.

### Spacing, bố cục và tương tác

- Hệ spacing 4px: 4, 8, 12, 16, 24, 32, 48px.
- Card bo 12–16px; input/button bo 8–12px.
- Border mảnh, shadow nhẹ; animation 150–250ms và hỗ trợ reduced motion.
- Nội dung tối đa khoảng 1200px; practice tối đa khoảng 960px.
- Tránh tràn ngang ở 360–390px, 768px và desktop.
- Có hover, focus-visible, disabled, loading/error khi phù hợp.
- Form có label; nút icon có accessible name; radio và range dùng được bằng bàn phím.
- Modal dùng native dialog để giữ focus và hỗ trợ Escape. Có skip link tới main.

## 5. Chức năng từng khu vực

### Trang chủ và thư viện

Trang chủ hiển thị năng lượng, vàng, cửa hàng, bài luyện hằng ngày và các chủ đề văn hóa đời thường. Thẻ bài trong thư viện có minh họa, tên, trình độ, chủ đề, thời lượng, dấu trang và nút bắt đầu nghe.

Tìm kiếm theo tên và mô tả, không phân biệt hoa/thường hoặc dấu tiếng Việt. Kết hợp được trình độ A1/A2/B1/B2 và chủ đề. Hiển thị số bài phù hợp, empty state và thao tác xóa bộ lọc. Chi tiết bài học hiển thị mục tiêu, số câu, transcript, lưu bài và bắt đầu luyện nghe.

### Luyện nghe

- Player thật: Play/Pause, tiến/lùi 10 giây, seek bằng thanh thời gian, tốc độ 0.5×–2×, âm lượng, thời lượng và thời gian hiện tại.
- Không tự phát audio khi mở trang. Có lỗi tải/phát và thao tác thử lại.
- Mỗi bài có ghi chú văn hóa và một mẫu phát âm. Mục phát âm dùng đoạn audio có sẵn, phiên âm IPA, hướng dẫn trọng âm, nối âm hoặc cách đặt miệng. Người học nghe và nhắc lại thành tiếng. Player dùng chung một phần tử audio cho cả đoạn mẫu và hội thoại.
- Câu hỏi trắc nghiệm kiểm tra nội dung và nhận diện âm. Câu sai trừ 1 năng lượng khi hết lượt tra từ điển và yêu cầu trả lời lại. Lượt tra giữ năng lượng. Ở câu thường, người học xem đáp án và chuyển tiếp. Ở câu cuối, người học phải trả lời đúng và xem lời giải trên trang kết quả.
- Tiến độ và lựa chọn được lưu sau thao tác. Sau khi nhận quà cuối và hoàn thành, ứng dụng lưu lượt làm của từng bài với điểm, đáp án, thời gian và thời điểm hoàn thành. Bài trong thư viện có thể luyện lại.
- Transcript mặc định đóng, có speaker, timestamp, highlight câu đang phát, nhấn vào câu để tua và tùy chọn chữ lớn. Audio và transcript là hai tài nguyên độc lập.

### Chủ đề, năng lượng và dụng cụ

- Một bài luyện theo trình độ tương ứng với một nhóm bài nghe trong chủ đề. Hoàn thành mọi trình độ của chủ đề sẽ hoàn thành chủ đề và mở khóa hàng. Bài luyện hằng ngày xoay vòng ba bài theo ngày trên thiết bị và có thể hoàn thành một lần mỗi ngày. Bài mở từ thư viện có tiến độ riêng.
- Năng lượng tối đa 5, tự hồi 1 điểm sau mỗi 10 phút. Đồ ăn có thể dùng ngay trong cửa hàng hoặc tự dùng tối đa một lần mỗi lượt khi năng lượng về 0. Khi không thể hồi và năng lượng về 0, lượt luyện kết thúc.
- Mỗi câu được tính thưởng cho 15 vàng. Sổ tay còn lượt ghi cộng thêm 20%, 40% hoặc 60% tùy loại, dùng một lượt và lưu cụm phát âm theo bài. Mỗi cụm chỉ xuất hiện một lần trong mục Sổ tay cụm từ. Từ điển và sổ tay có thể nạp lượt với giá thấp hơn giá mua.
- Vật phẩm mang theo được chốt khi bắt đầu lượt. Quà giữa bài cho đồ ăn, quà cuối bài cho từ điển hoặc sổ tay đã mở khóa. Nếu đã sở hữu dụng cụ nhận được, lượt dùng được nạp đầy. Mỗi quà chỉ nhận một lần.
- Cửa hàng bán đồ ăn, từ điển, sổ tay và bạn đồng hành. Vàng ban đầu bằng 0 và kiếm được qua câu hỏi.

### Kết quả, tiến độ và hồ sơ

Kết quả gồm phần trăm, số câu đúng, đáp án đã chọn/đúng, giải thích và CTA luyện lại hoặc chọn bài tiếp. Dashboard và progress tính từ lượt làm thật trên trình duyệt, không tạo thống kê giả. Biểu đồ đếm số lượt hoàn thành trong 7 ngày; lịch sử liên kết đến đúng lượt làm.

Bookmarks lưu/bỏ lưu ngay; tải lại trang vẫn giữ. Profile lưu tên/email. Settings lưu tốc độ, âm lượng, kích cỡ transcript và mục tiêu học mỗi ngày. Mục tiêu là tùy chọn cá nhân, chưa có nhắc học. Mọi dữ liệu này chỉ nằm trong trình duyệt, chưa đồng bộ và không phải tài khoản thật.

## 6. Component và cấu trúc mã nguồn

| Nhóm       | Component                                   | Ưu tiên    |
| ---------- | ------------------------------------------- | ---------- |
| Layout     | Header, Footer, Sidebar, Container          | Cao        |
| UI         | Button, Input, Card, Badge, Modal           | Cao        |
| Lesson     | LessonCard, LessonFilter, LevelBadge        | Cao        |
| Audio      | AudioPlayer, thanh thời gian, tốc độ        | Cao        |
| Exercise   | QuestionCard, radio choices, AnswerFeedback | Cao        |
| Transcript | TranscriptPanel, dòng có timestamp          | Cao        |
| Progress   | StatCard, ProgressChart                     | Trung bình |
| Feedback   | Loading, EmptyState, ErrorState, Toast      | Cao        |

Thành phần nhỏ như radio choice, feedback, playback speed và transcript line được compose trong component sở hữu, có thể tách file riêng khi tái sử dụng. Container hiện dùng class chung `.container`.

```text
public/assets/
  audio/{beginner,intermediate,advanced}/
  transcripts/
  images/{illustrations,thumbnails,avatars}/
  icons/
  fonts/
src/
  app/{router,providers}/
  layouts/
  components/{ui,layout,audio,exercises}/
  pages/
  features/{lessons,listening,progress}/
  data/mock/
  styles/{tokens.css,globals.css,typography.css}
  hooks/
  services/
  types/
  utils/
scripts/
tests/
```

## 7. Asset và dữ liệu

| Loại                | Quy chuẩn                                                                  |
| ------------------- | -------------------------------------------------------------------------- |
| Logo/icon           | SVG, nhất quán; Lucide ISC, không thêm icon library trùng                  |
| Minh họa            | SVG/WebP hoặc hình dựng bằng CSS/SVG nhất quán                             |
| Thumbnail           | WebP, tỷ lệ 16:9 khi dùng ảnh; hiện có minh họa SVG/CSS theo bài           |
| Avatar              | WebP/JPEG 1:1 khi có ảnh; hiện dùng chữ cái tên                            |
| Audio production    | MP3; tài nguyên lớn chuyển object storage/CDN                              |
| Audio demo hiện tại | WAV PCM mono 16kHz, sinh cục bộ từ Windows English speech voice            |
| Transcript          | JSON `{ start, end, speaker, text }[]`, đơn vị giây; có thể mở rộng WebVTT |
| Font                | WOFF2, hiện do @fontsource/inter đóng gói vào build                        |

Danh mục chính gồm 6 bài mẫu, 18 câu hỏi, 4 chủ đề và nhãn A1–B1. Bài cũ vẫn mở từ dấu trang, lịch sử hoặc đường dẫn đã lưu. Mức CEFR là nhãn minh họa.

`scripts/generate-audio.ps1` đọc nội dung ở `src/data/mock/us-lessons.json` và sinh WAV, transcript cùng mốc mẫu phát âm. Audio mẫu dùng một giọng tổng hợp en-US. Cờ `-Legacy` sinh lại audio cho bài cũ. Minh họa bạn học và biểu cảm được xuất từ bộ vector do người dùng cung cấp.

Kiểu dữ liệu `Lesson`: id, slug, title, description, level, topic, duration, color, icon, audioUrl, transcriptUrl, questions. `Question`: id, prompt, options, answer (index bắt đầu từ 0), explanation. `Attempt`: id, lessonId, answers, score, total, completedAt, seconds. `Profile`: name, email, goal.

LocalStorage dùng prefix `listenup.`. Khóa `listenup.adventure.v1` tiếp tục giữ năng lượng, vàng, kho đồ, tiến độ và lịch sử, thêm danh sách bài đã ghi vào sổ tay. ID bài, chủ đề và bài luyện hằng ngày của hành trình hiện tại tách khỏi theme cũ. Dấu trang, hồ sơ, tùy chọn và các lượt cũ vẫn đọc từ dữ liệu cục bộ.

## 8. Tiêu chí nghiệm thu

1. Cài đặt được bằng npm, build TypeScript và Vite thành công.
2. Tất cả URL giai đoạn đầu có nội dung phù hợp; ID/slug sai có trạng thái không tìm thấy.
3. Từ thư viện đi qua bài học → practice → kết quả; đáp án đúng/sai được chấm chính xác kể cả option index 0.
4. Audio phát/tạm dừng, seek, tiến/lùi, tốc độ và âm lượng hoạt động; transcript khớp audio.
5. Filter, empty state, bookmark, profile, preferences và lịch sử hoạt động; refresh giữ dữ liệu cục bộ.
6. Responsive và bàn phím sử dụng được; text dễ đọc, focus rõ ràng, modal đóng được.
7. Không gây hiểu nhầm về đăng nhập thật, dữ liệu máy chủ hay tiến độ giả.
8. Có PROJECT_SPEC.md, AGENTS.md, TASKS.md và README hướng dẫn chạy, giới hạn, kiểm thử.

## 9. Vận hành và mở rộng

`npm install` (hoặc `npm ci` khi có lockfile), `npm run dev`, `npm test`, `npm run build`, `npm run preview`. Node 22.12+ hoặc Node 24; tuân theo engine của Vite/dependency trong lockfile. Bản build nằm trong dist. Static hosting phải rewrite URL ứng dụng về index.html; asset không tồn tại không nên rewrite thành HTML.

Sau frontend: chuẩn hóa API services, xác thực thật, lưu lượt làm PostgreSQL, object storage/CDN, CMS quản trị bài/audio/transcript, phân quyền, bộ nội dung có bản quyền, dark mode và bộ kiểm thử trình duyệt tự động. Không xuất bản hoặc triển khai hạ tầng trong phạm vi bộ khung local này.
