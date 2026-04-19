## Chi tiết

Hiện tại cần hiển thị vùng phủ sóng (sector / circle) theo bán kính địa lý (mét) trên bản đồ.

## Vấn đề với gradient

Thư viện bản đồ không hỗ trợ gradient cho polygon
MapLibre/Mapbox chỉ hỗ trợ: `fill-color` `fill-opacity`
Không có gradient fill (linear / radial / conic)

## Giải pháp 1: Cách workaround (chia slice) không đạt yêu cầu

Để giả lập gradient, phải: chia hình thành nhiều polygon nhỏ (slice), mỗi slice một màu

Nhược điểm:

- Không tạo được gradient mượt → bị banding (nhìn thấy từng khối màu)
- Khi zoom sẽ thấy rõ lỗi hơn
- Tăng số slice để mượt hơn → tốn tài nguyên (CPU + render)

## Giải pháp 2: Dùng Canvas để vẽ gradient

Có thể dùng: `createConicGradient()` (gradient theo góc)
Nhưng lại phát sinh vấn đề:

- Bản đồ dùng hệ tọa độ địa lý (lat/lng)
- Canvas dùng pixel: phải convert: `mét → pixel` (theo zoom)

Nhược điểm:

- Không đảm bảo chính xác 100% bán kính địa lý
- Phải recalculation mỗi lần zoom/move
- Khó maintain, dễ lệch so với dữ liệu thật

## Với yêu cầu hiện tại:

Không thể vừa chính xác theo bán kính địa lý vừa có gradient mượt vừa tối ưu hiệu năng
Nếu fake bằng nhiều lớp thì sẽ bị vỡ gradient và rất nặng.
Nếu dùng canvas thì lại không đảm bảo chính xác theo bán kính địa lý và phải xử lý lại mỗi lần zoom.
Nên nếu giữ yêu cầu chính xác theo map thì em đề xuất dùng màu solid thay vì gradient.
