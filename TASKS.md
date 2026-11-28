# Công việc và tiến độ ListenUp

Cập nhật 28/11/2026. Phạm vi hiện tại là frontend luyện tiếng Anh chạy cục bộ. Đặc tả đầy đủ nằm trong PROJECT_SPEC.md. Quy tắc phát triển nằm trong AGENTS.md.

## Hành trình

### Đã triển khai

- Lưu theme phiêu lưu vào nhánh cục bộ `backup/adventure-theme` tại `0531a5b`.
- Chuyển danh mục chính sang 4 chủ đề văn hóa đời thường, 6 bài, 18 câu hỏi. Mỗi bài có hội thoại en-US, transcript và mẫu nghe riêng với IPA, hướng dẫn nhắc lại.
- Dùng lộ trình dọc có đường cong để chọn chủ đề ở trang chủ và `/topics`. Bạn học và pet đã trang bị di chuyển tới điểm được chọn. Pet có sprite đi bộ và bạn học giữ tư thế đứng.
- Mỗi điểm dừng là một bài. Mở lần lượt theo lượt làm đã hoàn thành, áp dụng chung cho lộ trình và thư viện. Khi có bài mới, màn hình hoàn thành đưa nhân vật và pet tới điểm vừa mở.
- Toàn bộ thẻ đã mở trên lộ trình là liên kết vào bài. Khi chọn điểm dừng khác, màn hình giữ lộ trình đến khi nhân vật tới nơi rồi mới chuyển trang.
- Bạn học dùng hình toàn thân ở trang chủ. Khung phản hồi ghép bốn biểu cảm vào hai tư thế thân từ bộ vector cho trạng thái bình thường, trả lời sai, trả lời đúng và hoàn thành. Thiết bị nhỏ có khung phản hồi sát nút đi tiếp.
- Pet đã trang bị theo vị trí phát trên thanh audio, đi khi phát và đứng lại khi tạm dừng. Thanh hiển thị phần audio đã nghe và cập nhật khi tua.
- Phóng sprite pet trên thanh audio gấp đôi và đặt ở lớp riêng phía trên thanh tua.
- Bỏ tên riêng trong giao diện, câu hỏi, hội thoại và transcript. Tạo lại audio demo và mốc phát âm để khớp hội thoại.
- Dùng nhãn chủ đề và hành trình không gắn với một quốc gia. Audio và nội dung luyện phát âm tiếp tục dùng bộ mẫu hiện có.
- Đổi sinh mệnh thành năng lượng, dùng đồ ăn để hồi. Từ điển dùng lượt khi sai. Sổ tay cộng vàng theo hệ số cũ và lưu cụm phát âm. Giữ dữ liệu cục bộ đã có.

### Đã kiểm chứng

- `npm test` đạt 23/23, gồm WAV/transcript và mốc phát âm mới, chấm điểm, hồi năng lượng, lượt từ điển, thưởng và lưu cụm từ không trùng.
- `npm run build` thành công.
- Chrome kiểm tra thư viện → bài luyện → kết quả, dấu trang và phản hồi qua tải lại, phát/tạm dừng, tua transcript, phát riêng đoạn mẫu, hoàn thành chủ đề, ăn để hồi năng lượng, dùng lượt từ điển khi sai và ghi sổ tay. Kiểm tra trang chủ và bài luyện không tràn ngang tại 360, 768 và 1280px.
- Sau khi thay minh họa, Chrome xác nhận tư thế toàn thân trên trang chủ, tư thế luyện và tư thế phản hồi. Đã chạy lại các kiểm tra trên.
- Chrome xác nhận bốn biểu cảm hiển thị đúng trạng thái, kể cả câu sai có dùng từ điển. Đã kiểm tra transcript dùng danh xưng chung và audio phát được sau khi tạo lại.
- Sau khi ghép thân, Chrome xác nhận cả bốn ảnh phản hồi tương ứng với trạng thái. Đã xem bố cục trả lời đúng và hoàn thành ở 360px, đồng thời chạy lại kiểm thử và build.
- Chrome xác nhận pet theo vị trí audio khi phát, tạm dừng, tua bằng bàn phím, nút ±10 giây và transcript. Kiểm tra ở 360px gồm hai đầu thanh tua và chế độ giảm chuyển động.
- Sau khi phóng to, Chrome xác nhận toàn bộ sprite nằm trên lớp thanh tua, trong khung audio ở hai đầu thanh và vẫn cho tua bằng bàn phím. Kiểm tra ở 360 và 1280px.
- Chrome xác nhận lộ trình cong ở trang chủ và trang chủ đề, nhân vật và pet tới đúng điểm dừng, có thể chọn bằng bàn phím, và chế độ giảm chuyển động hoạt động. Kiểm tra ở 360, 768 và 1280px, gồm đường vào bài luyện và thư viện theo chủ đề.
- Chrome xác nhận chỉ bài đầu mở khi chưa có tiến độ, đường dẫn trực tiếp tới bài khóa bị chặn, hai lượt trên lộ trình và một lượt từ thư viện mở đúng bài kế tiếp. Kiểm tra chuyển động khi mở khóa, giữ bộ bài hằng ngày qua thay đổi tiến độ, và hiển thị ở 360, 768, 1280px.
- Chrome xác nhận bấm góc trống của thẻ hoặc nhấn Enter đều vào bài sau khi nhân vật đến nơi. Thẻ khóa không điều hướng và chế độ giảm chuyển động vào bài ngay.

### Còn lại

- Giọng mẫu là giọng tổng hợp. Bài tập phát âm theo hình thức nghe rồi nhắc lại. Điểm phản ánh câu trả lời trắc nghiệm.
- Chưa kiểm tra Firefox, Safari, thiết bị thật hoặc thẩm định nội dung với người dạy phát âm. Ảnh tại `docs/screenshots` là ảnh lịch sử.

## Lịch sử giao diện và tiến trình RPG

### Đã triển khai

- Bản đồ chiến dịch theo cặp chủ đề/trình độ, ải một bài từ thư viện và ải hằng ngày luân phiên ba bài. Nhà thám hiểm và mèo đã trang bị di chuyển trên bản đồ.
- Mỗi chặng có một câu hỏi nghe, phản hồi đúng/sai, phần thưởng và tiến độ lưu cục bộ. Kết quả mới xuất hiện trong lịch sử cùng các lượt đã nộp trước đây.
- Hệ thống 5 sinh mệnh, hồi 1 mỗi 10 phút, vàng, thuốc hồi phục, khiên, kiếm, kho đồ, mua và bảo dưỡng trang bị, mở khóa và mua pet.
- Rương thuốc giữa ải và rương trang bị cuối ải. Rương trang bị có thể cấp món đã mở khóa hoặc sửa món đã sở hữu lên độ bền tối đa.
- Cửa hàng cho dùng thuốc trong túi. Trong ải, thuốc trang bị tự kích hoạt tối đa một lần khi sinh mệnh về 0. Nếu không còn lượt tự hồi, ải thất bại. Chặng cuối buộc trả lời đúng và chỉ hiển thị lời giải trong kết quả.
- Khiên đỡ đòn, giữ sinh mệnh và cho xem đáp án khi bỏ qua chặng thường. Ở chặng cuối, khiên chỉ giữ sinh mệnh. Khi không có khiên còn độ bền, người chơi phải trả lời lại sau khi mất 1 sinh mệnh.

### Đã kiểm chứng

- Trình duyệt Chromium tích hợp kiểm tra đường đi từ thư viện đến kết quả At the Coffee Shop, lưu bài qua tải lại, giữ lựa chọn đang làm, phát/tạm dừng audio và tua transcript đến 11,8 giây.
- Ở ải chiến dịch, đã nhận 18 vàng với kiếm cộng 20%, mở rương và hoàn thành chủ đề để mua, trang bị mèo. Ải hằng ngày hiển thị cả sprite nhân vật và mèo, với một phần tử audio.
- Trong bản cập nhật luật thuốc, Chromium xác nhận dùng thuốc trực tiếp, tự hồi đúng một lần, giữ trạng thái sau tải lại, thua ải ở lần hết sinh mệnh tiếp theo và bắt đầu lượt mới sau khi hồi tại cửa hàng. Chặng cuối giữ đủ lựa chọn và ẩn lời giải khi sai, chỉ cho hoàn thành sau khi chọn đúng.
- Kiểm tra bố cục bản đồ, ải, cửa hàng và thư viện tại 1280, 768 và 360px. Đã đo ải đang hoạt động không tràn ngang.
- Chromium xác nhận khiên ở chặng thường mở đường sang chặng tiếp theo và hiển thị đáp án qua tải lại. Ở chặng cuối, khiên giữ sinh mệnh và giữ đủ lựa chọn. Khiên cạn khiến câu sai tiêu hao sinh mệnh. Cả hai loại chặng yêu cầu trả lời lại khi không có khiên. Màn hình trả lời lại không tràn ngang ở 360, 768 và 1280px.
- `npm test` đạt 17/17 và `npm run build` thành công. Các bài kiểm tra bao phủ hao độ bền, bỏ qua chặng thường, chặng cuối bắt buộc đúng, thuốc tự hồi và phần thưởng của lượt lưu cũ.

### Còn lại

- Bổ sung các kiểu tương tác ngoài trắc nghiệm khi có yêu cầu nội dung.
- Chưa kiểm tra Safari, Firefox, thiết bị thật hoặc chạy kiểm định hỗ trợ tiếp cận đầy đủ. Các ảnh tại `docs/screenshots` thuộc giao diện trước RPG.

## Tổng quan bộ khung trước RPG

Checklist bộ khung trong kế hoạch: **10/10 hạng mục đã triển khai**, đã kiểm tra build, luồng sử dụng chính và responsive cơ bản. Đây không phải tuyên bố đã hoàn tất kiểm định production hoặc WCAG trên mọi trình duyệt.

| Giai đoạn               | Trạng thái                 | Kết quả                                                                                                  |
| ----------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1. Design Foundation    | Hoàn thành                 | Tokens, Inter cục bộ, typography, màu, spacing, border, UI dùng chung                                    |
| 2. Routing & Layout     | Hoàn thành                 | 14 URL chính, 4 layout, Header/Footer/Sidebar, navigation mobile, fallback                               |
| 3. Các trang chính      | Hoàn thành                 | Home, thư viện/filter, chủ đề, chi tiết bài, dashboard, progress, bookmarks, auth demo, profile/settings |
| 4. Listening Components | Hoàn thành                 | Player thật, transcript theo thời gian, câu hỏi, chấm điểm và lưu lượt làm                               |
| 5. Kiểm tra bộ khung    | Hoàn thành kiểm tra cơ bản | 8 test tự động đạt, build đạt, luồng trình duyệt và các kích thước đại diện                              |

## Checklist gốc

- [x] Chốt cấu trúc URL và sơ đồ điều hướng.
- [x] Thiết lập React, TypeScript, Vite và router.
- [x] Tạo design tokens cho màu sắc, font và spacing.
- [x] Tổ chức thư mục và asset.
- [x] Xây dựng Button, Input, Card và Badge.
- [x] Tạo Header, Footer, Sidebar và bốn layout.
- [x] Xây dựng Home và danh sách Lessons.
- [x] Xây dựng trang luyện Listening mẫu.
- [x] Tích hợp AudioPlayer và transcript hoạt động.
- [x] Kiểm tra responsive và khả năng truy cập cơ bản.

## Chức năng của bộ khung trước RPG

- [x] Tìm tên/mô tả không phân biệt dấu và hoa/thường; kết hợp lọc trình độ/chủ đề; query string giữ bộ lọc.
- [x] 6 bài nghe, 4 chủ đề, 20 câu hỏi có giải thích, nhãn A1–B2.
- [x] 6 WAV PCM sinh từ giọng tiếng Anh cục bộ; 6 transcript JSON khớp thời gian.
- [x] Audio Play/Pause, seek, tiến/lùi 10 giây, tốc độ, âm lượng và thời lượng thật.
- [x] Transcript mặc định đóng, highlight theo audio, nhấn câu để tua, phóng to chữ.
- [x] Chọn đáp án bằng radio, chuyển/nhảy câu, feedback đúng/sai có icon và chữ.
- [x] Khóa đáp án đã kiểm tra; yêu cầu trả lời đủ câu trước nộp; modal xác nhận.
- [x] Kết quả lưu theo attempt ID, xem lại lời giải, luyện lại và lịch sử.
- [x] LocalStorage: bookmark, profile, preferences, draft và attempts.
- [x] Dashboard/progress tính từ lượt làm thật; biểu đồ 7 ngày, empty state khi chưa học.
- [x] Form login/register demo có thông báo rõ phạm vi, không lưu/gửi mật khẩu.
- [x] Settings tốc độ/âm lượng/chữ transcript/mục tiêu; profile tên/email.
- [x] Loading/error/retry cho tài nguyên; trang 404 và slug/ID không tìm thấy.
- [x] Focus-visible, skip link, form label, radio/range bàn phím, dialog có tên và Escape, reduced motion.
- [x] PROJECT_SPEC.md, AGENTS.md, TASKS.md và README.md.
- [x] Prettier cho mã nguồn; npm run format để tiếp tục giữ định dạng.

## Bằng chứng kiểm tra bộ khung trước RPG

### Tự động

- `npm test`: **8/8 đạt**. Kiểm tra grading có index 0, câu chưa trả lời và tất cả đúng; chuẩn hóa tìm kiếm tiếng Việt; cấu trúc WAV và mốc transcript của từng bài.
- `npm run build`: **đạt**, TypeScript strict và Vite production bundle.
- Audio đã được kiểm tra header RIFF/WAVE, thời lượng hợp lệ và timestamp cuối khớp độ dài PCM.

### Trình duyệt trong phiên triển khai

- Hoàn thành At the Coffee Shop, chủ động chọn sai một câu: kết quả **80%, 4/5**, lời giải đúng cho câu sai.
- Audio phát/tạm dừng được; tốc độ đổi sang 0.75×; seek bằng transcript tới khoảng 16 giây; slider + tua tiến hiển thị 10.1 giây; âm lượng đổi từ 0.80 xuống 0.79 bằng bàn phím.
- Space và ArrowDown chọn đáp án; Escape đóng dialog làm lại và trả focus về nút mở.
- Reload giữ bản nháp câu đã chọn; xác nhận làm lại xóa draft.
- Tìm `hieu sach` cùng trình độ B1 chỉ trả về A Little Bookshop; tìm không khớp hiện empty state và xóa filter được.
- Lưu A Little Bookshop, reload vẫn có trạng thái đã lưu.
- Dashboard phản ánh đúng 1 bài đã hoàn thành và 4/5 câu đúng từ lượt thử; không có số liệu seed giả.
- Kiểm tra các trang chính và các ID/slug/route không tồn tại tại 768px, nội dung hiển thị và không tràn ngang.
- Kiểm tra Home, Lessons, Detail, Practice, Dashboard, Login, Settings ở 360px: scrollWidth bằng clientWidth.
- Kiểm tra Home/Practice và menu tại 390px, cùng giao diện desktop khoảng 1265px. Đã sửa phần orbit minh họa gây tràn ngang mobile.
- Ảnh tham chiếu lưu tại docs/screenshots/home-desktop.png, home-mobile.png, practice-mobile.png.

### Giới hạn kiểm tra

Chưa chạy bộ E2E lặp lại tự động, screen reader, audit WCAG đầy đủ, thử mạng chậm/lỗi trong browser, storage quota, Safari/iOS, Firefox, hoặc kiểm tra bằng thiết bị thật. Error/retry đã có trong code nhưng chưa mô phỏng toàn bộ lỗi mạng trên UI. Các mục này nằm trong công việc tiếp theo, không phải tính năng backend đã triển khai.

## Giai đoạn tiếp theo

### 6. Hoàn thiện trước production

- [ ] Thêm E2E cho luồng chọn bài → audio → submit → result; bookmark/draft qua refresh; URL trực tiếp.
- [ ] Kiểm tra audio trên Safari/iOS và Android thật; lỗi tải, mạng chậm, file thiếu và range request.
- [ ] Audit tương phản toàn bộ token/trạng thái; screen reader, keyboard-only và zoom 200%.
- [ ] Thẩm định nội dung/nhãn CEFR và rà soát câu hỏi bởi người có chuyên môn.
- [ ] Thay giọng tổng hợp bằng audio được cấp phép; chuẩn hóa MP3, loudness và transcript đã biên tập.
- [ ] Dùng ảnh WebP 16:9 khi có asset chính thức; tối ưu font subset và bundle theo nhu cầu.
- [ ] Thêm schema validation/migration cho dữ liệu localStorage trước khi mở rộng cấu trúc.
- [ ] Chuẩn hóa API client/repository, loading/error theo API; thêm pagination khi thư viện lớn.
- [ ] Cấu hình SPA fallback, caching và kiểm tra deep link tại môi trường hosting được chọn.

### 7. Backend và tài khoản thật

- [ ] Chọn Node.js hoặc Python, thiết kế API và PostgreSQL.
- [ ] Xác thực, phiên đăng nhập, đăng ký thật, khôi phục mật khẩu và phân quyền.
- [ ] Lưu và đồng bộ profile/bookmarks/attempts/progress theo người dùng.
- [ ] Không dựa vào frontend/localStorage để phân quyền hoặc bảo vệ đáp án.
- [ ] Object storage/CDN cho audio, ảnh và transcript; quản lý quyền truy cập nếu cần.
- [ ] Chốt retention dữ liệu, quyền riêng tư, export/xóa tài khoản và backup theo yêu cầu sản phẩm.

### 8. Quản trị và trải nghiệm mở rộng

- [ ] `/admin`, `/admin/lessons`, `/admin/media` có kiểm tra quyền phía máy chủ.
- [ ] CMS quản lý bài, câu hỏi, audio, hình ảnh và transcript.
- [ ] Dark mode hoàn chỉnh dựa trên token, kiểm tra tương phản riêng.
- [ ] Mục tiêu/ngày, streak và nhắc học nếu được yêu cầu; không tạo automation ngoài phạm vi người dùng.
- [ ] Mở rộng loại câu hỏi, từ vựng, ghi chú và thống kê học tập.

## Quy tắc cập nhật

Đánh dấu hoàn thành chỉ sau khi chức năng tồn tại và kiểm tra thích hợp đạt. Ghi rõ công việc mới, phạm vi thay đổi, giới hạn kiểm tra và blocker thực tế. Không đánh dấu backend, đăng nhập thật hoặc production audit là hoàn thành khi mới có mock UI.
