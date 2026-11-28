# Asset ListenUp

- `audio/beginner`, `audio/intermediate`, `audio/advanced`: WAV demo có sẵn. Production ưu tiên MP3 và CDN/object storage.
- `transcripts`: JSON độc lập gồm start/end theo giây, speaker và text. Phải khớp audio cùng ID.
- `icons`: logo SVG; icon UI dùng Lucide React.
- `images/illustrations`, `images/thumbnails`, `images/avatars`: chỗ cho asset chính thức; hiện dùng minh họa CSS/SVG và avatar chữ cái.
- `fonts`: chỗ cho font custom về sau. Inter hiện do @fontsource/inter tự đóng gói vào dist/assets.
- `character/pose-*.png`: tư thế nền trong suốt xuất từ `3540280.ai` trong gói Character poses with cool outfit do người dùng cung cấp. `pose-standing.png` dùng trên trang chủ.
- `character/face-*.png`: bốn khuôn mặt rời xuất từ bộ vector. Tệp `7081821_3540278.eps` trùng với EPS trong gói. Ảnh được xuất qua bản Illustrator đi kèm.
- `character/reaction-*.png`: bốn ảnh từ đầu đến thắt lưng, ghép nét mắt, lông mày và miệng từ bốn biểu cảm vào hai tư thế thân có sẵn. Khung phản hồi dùng các ảnh này cho trạng thái bình thường, trả lời sai, trả lời đúng và hoàn thành.
- `adventure/hero-*.png`: khung đứng và đi của Male Hero Free, cắt từ sprite sheet do người dùng cung cấp. Tác giả Ozzbit Games. Giấy phép bản Free cho phép sửa đổi và dùng cá nhân, phi thương mại, yêu cầu ghi công và cấm bán lại dưới dạng asset hoặc NFT.
- `adventure/cat-*.png`: khung đứng và đi của sáu mẫu trong Pet Cats Pack do người dùng cung cấp. Gói dùng giấy phép CC0.

Không thêm asset thiếu quyền sử dụng. Khi đổi audio, cập nhật transcript và duration trong dữ liệu bài rồi chạy npm test.
