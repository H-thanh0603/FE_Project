# AUTH — Ghi chú lỗi & kế hoạch fix (frontend-only)

> **Trạng thái:** tài liệu phân tích, chưa sửa code.
>
> **Phạm vi:** auth phía frontend, không backend / API / database.
>
> **Lưu trữ:** chỉ `localStorage` và `sessionStorage`.
>
> **Không xử lý:** dữ liệu sản phẩm, giỏ hàng, đơn hàng, wishlist, recently viewed.
>
> **Trong scope nhưng là mô phỏng:** đăng nhập Google/Facebook, đổi mật khẩu, quên/đặt lại mật khẩu.

---

## 0. Kết luận nhanh

Auth hiện tại **chưa phải authentication thật**, mà là kiểu **“chọn hồ sơ bằng email”**:

- `AuthContext.login()` chỉ nhận `email`, **không kiểm tra password**.
- `Register` có nhập password nhưng **không truyền password** vào `register()`.
- `accounts` trong localStorage **không có password hash/salt**.
- `shoe_store_user` lưu vĩnh viễn, **không có session/token/hạn dùng**.
- `remember` có UI nhưng **không được dùng**.
- Không có `ProtectedRoute`, không có `GuestRoute`.
- Google/Facebook chỉ hiện thông báo lỗi, chưa có luồng mô phỏng.
- Chưa có trang đổi mật khẩu, chưa có trang reset password thật.

Vì không có backend, **không thể làm auth bảo mật thật**. Mục tiêu của tài liệu này là làm một bản **auth demo chặt chẽ, nhất quán, có UX đầy đủ**, vẫn chỉ dùng localStorage.

---

## 1. Phạm vi

### 1.1. Trong scope

| Tính năng | Cách làm |
|---|---|
| Đăng ký | Lưu account + password hash/salt vào localStorage |
| Đăng nhập email/password | Verify hash, tạo session |
| Đăng xuất | Xóa session, cập nhật UI |
| Ghi nhớ đăng nhập | `localStorage` nếu tick, `sessionStorage` nếu không |
| Google/Facebook login | Mô phỏng: chọn/tạo account demo, không gọi OAuth thật |
| Đổi mật khẩu | Verify mật khẩu hiện tại, cập nhật hash/salt |
| Quên mật khẩu | Tạo reset token demo + trang đặt lại mật khẩu |
| Xác thực email | Mô phỏng bằng cờ `emailVerified`, không gửi mail thật |
| Protected route | Chặn `/profile`, `/addresses`, `/change-password`… |
| Guest route | Chặn user đã đăng nhập vào `/login`, `/register` |
| Session hết hạn | Lưu `expiresAt`, kiểm tra khi load |
| Đồng bộ tab | Lắng nghe `storage` event |
| Rate limit | Đếm số lần đăng nhập sai bằng localStorage, chỉ là UX |

### 1.2. Ngoài scope

| Không làm | Lý do |
|---|---|
| Backend/API/database | Không có server |
| JWT / refresh token / HttpOnly cookie | Cần backend |
| OAuth Google/Facebook thật | Cần provider, client secret, callback server |
| Gửi email reset/verify thật | Cần email service |
| SMS OTP / 2FA thật | Cần backend + secret |
| Multi-device session / logout all devices | Cần session store server |
| Phân quyền thật | Client-side luôn bypass được |
| Mã hóa localStorage | Không có key management an toàn |
| Dữ liệu sản phẩm/đơn hàng/giỏ hàng | Ngoài phạm vi auth |
| Thanh toán | Ngoài phạm vi |

> **Cảnh báo:** mọi thứ trong tài liệu này chỉ là **mô phỏng**. Không dùng cho production.

---

## 2. Hiện trạng code

| File | Vai trò hiện tại |
|---|---|
| `src/context/AuthContext.jsx` | `user`, `accounts`, `login`, `register`, `updateProfile`, `logout` |
| `src/pages/Login.jsx` | Form login, validate, giả lập delay 800ms, `login(email)` |
| `src/pages/Register.jsx` | Form đăng ký, validate, gọi `register({ name, email, phone })` |
| `src/pages/ForgotPassword.jsx` | Chỉ hiện thông báo “đã gửi” |
| `src/pages/Profile.jsx` | Sửa tên/email/phone |
| `src/components/layout/AuthLayout.jsx` | Layout 2 cột cho Login/Register/Forgot |
| `src/components/layout/Navbar/Navbar.jsx` | Hiện tên user, nút đăng xuất |
| `src/App.jsx` | Khai báo route, chưa có guard |
| `src/utils/constants.js` | Key localStorage: `shoe_store_user`, `shoe_store_accounts` |
| `src/hooks/useLocalStorage.js` | Đọc/ghi localStorage, không sync tab |

### 2.1. Luồng hiện tại

```text
Register
  validate form
  → register({ name, email, phone })     // password bị bỏ
  → lưu account vào localStorage
  → setUser(account)
  → navigate("/")

Login
  validate email + password >= 6
  → setTimeout 800ms
  → login(email)                          // không gửi password
  → nếu accounts rỗng: tạo user demo
  → nếu có accounts: tìm theo email
  → setUser(account)
  → navigate("/")

Logout
  → setUser(null)

ForgotPassword
  → validate email
  → setSent(true)                         // không có token/reset
```

---

## 3. Danh sách lỗi & thiếu

Mức độ:

- **P0:** phải sửa nếu muốn gọi là “đăng nhập”.
- **P1:** nên sửa để demo hoàn chỉnh.
- **P2:** cải thiện UX/code quality.

### 3.1. Credential & tài khoản

| ID | Mức | Vị trí | Hiện tại | Thiếu / hệ quả | Hướng fix |
|---|---|---|---|---|---|
| AUTH-01 | **P0** | `AuthContext.login` | Chỉ nhận `email`, không nhận `password` | Ai gõ đúng email + password ≥ 6 ký tự là vào được | Nhận `{ email, password }`, verify hash |
| AUTH-02 | **P0** | `Register.jsx` | Có password nhưng `register()` chỉ nhận `{ name, email, phone }` | Password bị bỏ ngay sau validate | Truyền password, hash + salt trước khi lưu |
| AUTH-03 | **P0** | `AuthContext` | `accounts` không có `passwordHash`, `salt` | Không có gì để verify | Thêm `passwordHash`, `salt`, `passwordUpdatedAt` |
| AUTH-04 | **P1** | Auth toàn cục | Không có đổi mật khẩu | User không thể tự đổi mật khẩu | Thêm trang `/change-password` |
| AUTH-05 | **P1** | `ForgotPassword.jsx` | Chỉ `setSent(true)` | Không có reset flow thật | Thêm reset token + `/reset-password` |
| AUTH-06 | **P1** | Auth toàn cục | Không có `emailVerified` | Không mô phỏng được xác thực email | Thêm cờ + banner “chưa xác thực” |
| AUTH-07 | **P1** | `Profile.jsx` / `updateProfile` | Đổi email không cần password hiện tại | Chiếm session là đổi được email | Yêu cầu password hiện tại hoặc re-auth |
| AUTH-08 | **P1** | `AuthContext.register` | `id = account-${email}` | Đổi email xong, người khác đăng ký email cũ → trùng ID | Dùng `crypto.randomUUID()` |
| AUTH-09 | **P1** | `AuthContext.login` | `accounts.length === 0` → demo mode; sau khi có account, demo user cũ không login lại được | Trạng thái không nhất quán | Bỏ demo mode hoặc tạo account demo rõ ràng |
| AUTH-10 | **P1** | `Register.jsx` | Password chỉ yêu cầu ≥ 6 ký tự | Policy yếu | Tối thiểu 8 ký tự, có chữ + số; không trùng email |
| AUTH-11 | **P2** | `AuthContext` | Validate chỉ nằm ở form | Gọi hàm trực tiếp có thể lưu dữ liệu sai | Validate lại trong service/context |
| AUTH-12 | **P2** | `AuthContext.updateProfile` | Không trim/max length đầy đủ | Dữ liệu bẩn | Chuẩn hóa + giới hạn độ dài |
| AUTH-13 | **P2** | Auth toàn cục | Không có `lastLoginAt` | Không hiển thị lần đăng nhập cuối | Cập nhật khi login thành công |
| AUTH-14 | **P2** | Auth toàn cục | Không có trạng thái `active/locked` | Không khóa được tài khoản | Thêm `status` (optional) |
| AUTH-15 | **P2** | Auth toàn cục | Không có role | Không phân quyền | Thêm `role` (optional) |

### 3.2. Session & trạng thái đăng nhập

| ID | Mức | Vị trí | Hiện tại | Thiếu / hệ quả | Hướng fix |
|---|---|---|---|---|---|
| AUTH-16 | **P0** | `AuthContext` | Chỉ lưu `user` object | Không có session/token | Thêm `shoe_store_session` |
| AUTH-17 | **P0** | `AuthContext` | User không hết hạn | Đăng nhập vĩnh viễn | Thêm `expiresAt`, kiểm tra khi load |
| AUTH-18 | **P1** | `Login.jsx` | `remember` có state nhưng không dùng | Tick hay không tick đều lưu localStorage | Tick → localStorage; không tick → sessionStorage |
| AUTH-19 | **P1** | `AuthContext` | Không có `status` | Không có trạng thái loading/guest/auth | Thêm `status: 'loading' \| 'authenticated' \| 'guest'` |
| AUTH-20 | **P1** | `useLocalStorage` | Không nghe `storage` event | Tab A logout, tab B vẫn logged in | Thêm listener `storage` |
| AUTH-21 | **P1** | `AuthContext.logout` | Chỉ `setUser(null)` | Không xóa session/token/reset state | Xóa session, clear timer, reset state |
| AUTH-22 | **P1** | Auth toàn cục | Không có session invalidation | Đổi password/email xong session cũ vẫn dùng | Rotate token hoặc force re-login |
| AUTH-23 | **P1** | `Login.jsx` | Luôn `navigate('/')` | Không quay lại trang trước | Lưu `state.from`, redirect về đó |
| AUTH-24 | **P2** | Auth toàn cục | Không có auto logout khi hết hạn | Session hết hạn vẫn hiện UI cũ | Kiểm tra định kỳ + khi route đổi |
| AUTH-25 | **P2** | Auth toàn cục | Không có “phiên bản session” | Không revoke được session cũ | Thêm `sessionVersion` (optional) |

### 3.3. Google / Facebook login (mô phỏng)

| ID | Mức | Vị trí | Hiện tại | Thiếu / hệ quả | Hướng fix |
|---|---|---|---|---|---|
| AUTH-26 | **P1** | `Login.jsx` | Nút Google/Facebook chỉ `setFormError('...mô phỏng...')` | Không có luồng đăng nhập nào | Thêm `loginWithProvider('google' \| 'facebook')` |
| AUTH-27 | **P1** | Auth toàn cục | Không có khái niệm provider | Không phân biệt account thường/OAuth | Thêm `provider`, `providerId` vào account |
| AUTH-28 | **P1** | Auth toàn cục | Không có UI chọn tài khoản demo | Không biết đăng nhập bằng email nào | Modal chọn/tạo account demo |
| AUTH-29 | **P1** | Auth toàn cục | OAuth account không có password | Không thể đổi mật khẩu nếu không xử lý | Cho phép “đặt mật khẩu” cho account OAuth |
| AUTH-30 | **P2** | `Login.jsx` | Không có loading/disable cho social button | Có thể click nhiều lần | Thêm `socialLoading` state |
| AUTH-31 | **P2** | Auth toàn cục | Không có `emailVerified` tự động cho OAuth | OAuth thường coi email đã verify | Set `emailVerified: true` cho provider account |

**Cách mô phỏng Google/Facebook trong scope:**

1. User bấm “Google” hoặc “Facebook”.
2. Hiện modal “Đăng nhập mô phỏng”:
   - chọn một email demo, hoặc
   - nhập email demo.
3. Giả lập loading 600–800ms.
4. Tìm account theo `{ provider, email }`:
   - có → dùng account đó;
   - chưa có → tạo account với `provider`, `emailVerified: true`, `passwordHash: null`.
5. Tạo session và redirect.
6. Không gọi mạng, không có token thật, không có client secret.
7. UI ghi rõ: **“Đăng nhập Google/Facebook mô phỏng — không kết nối dịch vụ thật.”**

### 3.4. Đổi mật khẩu & reset mật khẩu

| ID | Mức | Vị trí | Hiện tại | Thiếu / hệ quả | Hướng fix |
|---|---|---|---|---|---|
| AUTH-32 | **P0** | Auth toàn cục | Không có `changePassword` | Không đổi được mật khẩu | Thêm flow đầy đủ |
| AUTH-33 | **P1** | Auth toàn cục | Không kiểm tra mật khẩu hiện tại | Ai mở được profile là đổi được | Verify current password |
| AUTH-34 | **P1** | Auth toàn cục | Không có policy mật khẩu mới | Có thể đặt lại mật khẩu yếu | ≥ 8 ký tự, khác mật khẩu cũ |
| AUTH-35 | **P1** | Auth toàn cục | Không revoke session sau khi đổi | Session cũ vẫn hợp lệ | Rotate session/force login lại |
| AUTH-36 | **P1** | `ForgotPassword` | Không có reset token | Không thể đặt lại mật khẩu | Token + `expiresAt` + `used` |
| AUTH-37 | **P1** | Auth toàn cục | Không có `/reset-password` | Không có nơi nhập mật khẩu mới | Thêm page + route |
| AUTH-38 | **P2** | Auth toàn cục | Không có invalidate reset token | Token dùng lại được | Đánh dấu `usedAt` sau khi dùng |
| AUTH-39 | **P2** | Auth toàn cục | Không có thông báo lỗi token hết hạn/không hợp lệ | UX kém | Hiển thị lỗi rõ ràng |
| AUTH-40 | **P2** | Auth toàn cục | Không có “đặt mật khẩu” cho account OAuth | Account OAuth không có mật khẩu | Cho phép set password lần đầu |

**Flow đổi mật khẩu đề xuất:**

```text
/change-password (protected)
  → nhập currentPassword, newPassword, confirmPassword
  → verify currentPassword với hash đã lưu
  → kiểm tra newPassword >= 8, khác current, confirm khớp
  → tạo salt mới + hash mới
  → cập nhật account, passwordUpdatedAt
  → rotate session token
  → thông báo thành công
```

**Flow quên mật khẩu đề xuất:**

```text
/forgot-password
  → nhập email
  → luôn hiện thông báo chung (tránh dò email)
  → nếu account tồn tại: tạo token demo
      { token, email, expiresAt: now + 15 phút, usedAt: null }
  → vì không có email thật, hiện nút “Mở trang đặt lại (mô phỏng)”
  → /reset-password?token=...
      → kiểm tra token tồn tại, chưa dùng, chưa hết hạn
      → nhập mật khẩu mới + xác nhận
      → cập nhật hash/salt
      → đánh dấu token đã dùng
      → redirect /login
```

### 3.5. Route guard & UX

| ID | Mức | Vị trí | Hiện tại | Thiếu / hệ quả | Hướng fix |
|---|---|---|---|---|---|
| AUTH-41 | **P0** | `App.jsx` | Không có guard | `/orders` ai cũng vào; `/profile`, `/addresses` chỉ hiện lời nhắc | Thêm `ProtectedRoute` |
| AUTH-42 | **P1** | `App.jsx` | Không có guest guard | User đã login vẫn vào `/login`, `/register` | Thêm `GuestRoute` |
| AUTH-43 | **P1** | `Login.jsx` | Không redirect về trang cũ | Mất ngữ cảnh | `navigate(state.from ?? '/')` |
| AUTH-44 | **P1** | Auth toàn cục | Không có loading state | Dễ flash UI sai khi thay bằng async | `status = 'loading'` |
| AUTH-45 | **P2** | `Login/Register` | Không có thông báo thành công | UX thiếu phản hồi | Toast/banner sau khi xong |
| AUTH-46 | **P2** | `Navbar` | Logout không confirm/redirect | Có thể logout nhầm | Confirm + redirect |
| AUTH-47 | **P2** | Auth toàn cục | Không có error boundary cho auth | Lỗi render làm trắng trang | Thêm ErrorBoundary |
| AUTH-48 | **P2** | Auth toàn cục | Không có `aria-live` cho một số thông báo | Accessibility kém | Dùng `role="status"`/`aria-live` |
| AUTH-49 | **P2** | `Login/Register` | `setTimeout` không cleanup | Có thể setState sau unmount | Lưu timer + cleanup |
| AUTH-50 | **P2** | Auth toàn cục | Không có test | Dễ regression | Test các flow chính |

### 3.6. Security & localStorage

| ID | Mức | Vấn đề | Hệ quả | Ghi chú |
|---|---|---|---|---|
| AUTH-51 | **P0** | localStorage chứa PII plaintext | XSS đọc được tên/email/SĐT/địa chỉ | Không thể tránh hoàn toàn nếu không backend |
| AUTH-52 | **P0** | Auth client-side bị bypass | Sửa localStorage là qua guard | Chỉ là demo |
| AUTH-53 | **P1** | Không rate limit/lockout | Thử mật khẩu thoải mái | Có thể giả lập cooldown |
| AUTH-54 | **P1** | Email enumeration | Login/Register lộ email tồn tại | Dùng thông báo chung |
| AUTH-55 | **P2** | Không có CSP/security headers | Tăng rủi ro XSS | Cấu hình hosting |
| AUTH-56 | **P2** | Không có audit log | Không truy vết login fail | Cần backend nếu muốn thật |
| AUTH-57 | **P2** | Không có mã hóa localStorage | DevTools đọc được | Không có key an toàn ở FE |
| AUTH-58 | **P2** | Password hash vẫn ở client | Không chống được sửa/xóa | Chỉ tránh plaintext |

---

## 4. Thiết kế đề xuất (frontend-only)

### 4.1. Storage keys

Thêm vào `src/utils/constants.js`:

```js
export const AUTH_STORAGE_KEYS = {
  ACCOUNTS: 'shoe_store_accounts',
  SESSION: 'shoe_store_session',
  PASSWORD_RESETS: 'shoe_store_password_resets',
  LOGIN_ATTEMPTS: 'shoe_store_login_attempts',
  LEGACY_USER: 'shoe_store_user', // chỉ dùng để migrate
};
```

Giữ `STORAGE_KEYS.USER` cũ để đọc dữ liệu cũ, sau đó có thể bỏ.

### 4.2. Account record

```js
{
  id: "uuid",                     // crypto.randomUUID()
  name: "Nguyễn Văn A",
  email: "a@example.com",         // lowercase + trim
  phone: "0901234567",
  passwordHash: "...",            // PBKDF2, demo-only
  salt: "...",                    // random
  provider: "local",              // "local" | "google" | "facebook"
  providerId: null,               // id giả lập nếu cần
  emailVerified: false,
  status: "active",               // active | locked (optional)
  role: "customer",               // customer | admin (optional)
  createdAt: "2026-...",
  updatedAt: "2026-...",
  passwordUpdatedAt: "2026-...",
  lastLoginAt: "2026-..."
}
```

Quy tắc:

- Email unique, so sánh lowercase.
- ID không sinh từ email.
- Account OAuth có thể có `passwordHash: null`; cho phép set password sau.
- Không lưu plaintext password.

### 4.3. Session record

```js
{
  userId: "uuid",
  token: "uuid",                  // token giả lập
  createdAt: 1730000000000,
  expiresAt: 1730000000000,
  remember: true
}
```

Quy tắc:

- `remember === true` → `localStorage`.
- `remember === false` → `sessionStorage`.
- Khi load app: đọc session, kiểm tra `expiresAt`, tìm account theo `userId`.
- Hết hạn/không tìm thấy account → xóa session, coi như guest.
- Logout → xóa session ở cả hai storage.
- Đổi password → rotate `token`, cập nhật `expiresAt`.

Gợi ý TTL:

| Loại | TTL |
|---|---|
| Remember | 7 ngày |
| Không remember | 12 giờ hoặc đến khi đóng tab |

### 4.4. Hash password (demo)

Dùng Web Crypto `PBKDF2` + salt ngẫu nhiên:

```js
async function hashPassword(password, salt = crypto.randomUUID()) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  );

  const hash = btoa(String.fromCharCode(...new Uint8Array(bits)));
  return { hash, salt };
}
```

Lưu ý:

- `crypto.subtle` chỉ chạy trong secure context: `https` hoặc `localhost`.
- Đây **không phải bảo mật thật**: localStorage vẫn đọc/sửa được.
- Không dùng cách này cho production.
- Nếu muốn đơn giản hơn cho đồ án: có thể dùng SHA-256 + salt, nhưng PBKDF2 tốt hơn về mặt demo.

### 4.5. AuthContext API đề xuất

```js
{
  user,                 // account hiện tại hoặc null
  status,               // 'loading' | 'authenticated' | 'guest'
  isAuthenticated,      // Boolean(user)
  login,                // async ({ email, password, remember }) => { ok, error }
  loginWithProvider,    // async ({ provider, email }) => { ok, error }
  register,             // async ({ name, email, phone, password }) => { ok, error }
  logout,               // () => void
  updateProfile,        // async ({ name, email, phone, currentPassword }) => ...
  changePassword,       // async ({ currentPassword, newPassword }) => ...
  requestPasswordReset, // async ({ email }) => { ok, token? }
  resetPassword,        // async ({ token, newPassword }) => ...
  verifyEmail,          // () => void (demo)
}
```

Tất cả hàm trả `{ ok, error }` hoặc throw lỗi có mã để form map message.

### 4.6. Route guard đề xuất

```jsx
function ProtectedRoute({ children }) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <p>Đang kiểm tra đăng nhập...</p>;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
```

```jsx
function GuestRoute({ children }) {
  const { user, status } = useAuth();
  if (status === 'loading') return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}
```

Áp dụng:

| Route | Guard |
|---|---|
| `/profile` | `ProtectedRoute` |
| `/addresses` | `ProtectedRoute` |
| `/change-password` | `ProtectedRoute` |
| `/orders`, `/orders/:id` | `ProtectedRoute` (khuyến nghị) |
| `/login`, `/register` | `GuestRoute` |
| `/forgot-password` | Không cần guard |
| `/reset-password` | Không cần guard |

### 4.7. Login redirect về trang cũ

```js
const location = useLocation();
const navigate = useNavigate();

// sau khi login thành công
navigate(location.state?.from?.pathname ?? '/', { replace: true });
```

### 4.8. Remember me

```js
const storage = remember ? localStorage : sessionStorage;

storage.setItem(AUTH_STORAGE_KEYS.SESSION, JSON.stringify(session));
```

Khi logout, xóa ở cả hai:

```js
localStorage.removeItem(AUTH_STORAGE_KEYS.SESSION);
sessionStorage.removeItem(AUTH_STORAGE_KEYS.SESSION);
```

### 4.9. Đồng bộ tab

```js
useEffect(() => {
  const onStorage = (event) => {
    if (event.key === AUTH_STORAGE_KEYS.SESSION) {
      // đọc lại session, cập nhật user/status
    }
  };

  window.addEventListener('storage', onStorage);
  return () => window.removeEventListener('storage', onStorage);
}, []);
```

### 4.10. Migration dữ liệu cũ

Hiện tại có:

- `shoe_store_user`: user object.
- `shoe_store_accounts`: array account **không có passwordHash**.

Đề xuất migrate:

1. Đọc `shoe_store_accounts`.
2. Account nào thiếu `passwordHash` → đánh dấu `legacy: true`.
3. Khi user login account legacy:
   - chấp nhận password hiện tại (demo),
   - hash password và lưu vào account,
   - xóa cờ `legacy`.
4. Đọc `shoe_store_user` cũ:
   - nếu có session mới → bỏ qua.
   - nếu chưa có session → coi như guest, không tự tạo session.
5. Không xóa cart/orders/wishlist vì ngoài scope.

> Cách migrate “upgrade-on-login” giữ được trải nghiệm cũ, nhưng phải ghi rõ trong README là demo.

---

## 5. Acceptance criteria

| # | Case | Kết quả mong đợi |
|---|---|---|
| 1 | Đăng ký hợp lệ | Account có hash/salt, tự đăng nhập, redirect |
| 2 | Đăng ký email trùng | Báo lỗi, không tạo account |
| 3 | Đăng nhập đúng | Tạo session, user hiển thị trên Navbar |
| 4 | Đăng nhập sai mật khẩu | Báo lỗi, không tạo session, tăng attempt |
| 5 | Đăng nhập email không tồn tại | Báo lỗi chung, không lộ email tồn tại hay không |
| 6 | Remember = true | Reload/đóng mở browser vẫn đăng nhập |
| 7 | Remember = false | Đóng tab là mất session |
| 8 | Vào `/profile` khi chưa login | Redirect `/login`, sau login quay lại `/profile` |
| 9 | Vào `/login` khi đã login | Redirect về `/` |
| 10 | Logout | Session bị xóa, protected route redirect |
| 11 | Đổi mật khẩu sai current | Báo lỗi, không đổi |
| 12 | Đổi mật khẩu đúng | Mật khẩu cũ fail, mật khẩu mới login được |
| 13 | Quên mật khẩu | Tạo token demo, mở được trang reset |
| 14 | Reset token hết hạn/đã dùng | Báo lỗi, không đổi mật khẩu |
| 15 | Google login mô phỏng | Tạo/tìm account provider, có session |
| 16 | Facebook login mô phỏng | Tạo/tìm account provider, có session |
| 17 | Account OAuth đặt mật khẩu | Lưu hash, sau đó login email/password được |
| 18 | Session hết hạn | Tự logout, redirect login |
| 19 | Tab A logout | Tab B nhận event và logout theo |
| 20 | Legacy account không hash | Login lần đầu → upgrade hash thành công |

---

## 6. Kế hoạch implement

### Phase 1 — Nền tảng auth (P0)

1. Tạo `src/services/authService.js`:
   - account CRUD,
   - session create/read/clear,
   - password hash/verify,
   - reset token,
   - login attempts.
2. Tạo `src/utils/authCrypto.js`.
3. Refactor `AuthContext`:
   - `status`, `user`, `login`, `register`, `logout`.
4. Sửa `Login.jsx`:
   - gửi password,
   - `remember`,
   - redirect `state.from`.
5. Sửa `Register.jsx`:
   - gửi password,
   - hash trong service.
6. Thêm `ProtectedRoute`, `GuestRoute`.
7. Cập nhật `App.jsx`.

### Phase 2 — Đổi mật khẩu & reset (P1)

8. Thêm `ChangePassword.jsx` + route.
9. Thêm `ResetPassword.jsx` + route.
10. Nâng cấp `ForgotPassword.jsx`.
11. Thêm policy mật khẩu.
12. Rotate session sau khi đổi mật khẩu.

### Phase 3 — Google/Facebook mô phỏng (P1)

13. Thêm `loginWithProvider`.
14. Thêm modal chọn/tạo account demo.
15. Thêm loading/disable cho social button.
16. Set `emailVerified: true` cho provider account.
17. Cho phép set password cho account OAuth.

### Phase 4 — Hoàn thiện (P2)

18. Sync tab bằng `storage` event.
19. Rate limit đăng nhập sai.
20. Session expiry timer.
21. Test flow.
22. Cập nhật README gốc + README này.

---

## 7. File dự kiến thay đổi

| File | Thay đổi |
|---|---|
| `src/context/AuthContext.jsx` | Refactor toàn bộ auth state |
| `src/services/authService.js` | **Mới**: account/session/password/reset |
| `src/utils/authCrypto.js` | **Mới**: hash/verify password |
| `src/utils/authStorage.js` | **Mới** (optional): đọc/ghi storage an toàn |
| `src/utils/constants.js` | Thêm auth storage keys |
| `src/components/auth/ProtectedRoute.jsx` | **Mới** |
| `src/components/auth/GuestRoute.jsx` | **Mới** |
| `src/pages/ChangePassword.jsx` | **Mới** |
| `src/pages/ResetPassword.jsx` | **Mới** |
| `src/pages/Login.jsx` | Gửi password, remember, social, redirect |
| `src/pages/Register.jsx` | Gửi password |
| `src/pages/ForgotPassword.jsx` | Tạo reset token demo |
| `src/pages/Profile.jsx` | Đổi email cần password, link đổi mật khẩu |
| `src/components/layout/Navbar/Navbar.jsx` | Logout confirm/redirect |
| `src/App.jsx` | Guard + route mới |
| `README.md` | Cập nhật mô tả auth demo |

---

## 8. Quyết định cần chốt trước khi code

1. **Có lưu password hash không?**
   - Có: demo giống thật hơn, nhưng trái với ghi chú “không lưu mật khẩu” hiện tại → phải sửa README.
   - Không: giữ mô hình “profile switcher”, bỏ hẳn password khỏi form để không gây hiểu nhầm.

2. **Session TTL bao lâu?**
   - Remember: 7 ngày.
   - Không remember: 12 giờ hoặc đến khi đóng tab.

3. **Đổi mật khẩu xong có force logout không?**
   - Khuyến nghị: rotate session, giữ đăng nhập; hoặc force logout để an toàn hơn.

4. **Google/Facebook mô phỏng chọn email thế nào?**
   - Modal chọn account demo có sẵn, hoặc
   - Nhập email demo tùy ý.

5. **Có protect `/checkout` không?**
   - Hiện cho phép guest. Nếu muốn auth-only thì thêm guard; nếu muốn guest checkout thì giữ.

6. **Có làm role/admin không?**
   - Nếu chỉ auth cơ bản: bỏ qua.
   - Nếu muốn demo phân quyền: thêm `role` + `RequireRole`.

---

## 9. Checklist

### Credential
- [ ] Login nhận và verify password
- [ ] Register lưu hash + salt
- [ ] Email unique, lowercase
- [ ] ID dùng `crypto.randomUUID()`
- [ ] Password policy ≥ 8 ký tự
- [ ] Validate trong service/context

### Session
- [ ] Có session object + `expiresAt`
- [ ] Remember dùng localStorage/sessionStorage
- [ ] Load app kiểm tra expiry
- [ ] Logout xóa session
- [ ] Sync tab bằng `storage` event
- [ ] Có `status: loading/authenticated/guest`

### Password
- [ ] Trang `/change-password`
- [ ] Verify current password
- [ ] Không cho trùng mật khẩu cũ
- [ ] Rotate session sau khi đổi
- [ ] Trang `/reset-password`
- [ ] Reset token có hạn + dùng một lần
- [ ] Forgot password không lộ email tồn tại

### Google/Facebook
- [ ] `loginWithProvider('google')`
- [ ] `loginWithProvider('facebook')`
- [ ] Modal chọn/tạo account demo
- [ ] Loading/disable button
- [ ] Account OAuth có `emailVerified: true`
- [ ] Account OAuth có thể set password

### Routing/UX
- [ ] `ProtectedRoute`
- [ ] `GuestRoute`
- [ ] Redirect về `state.from`
- [ ] Logout confirm/redirect
- [ ] Thông báo thành công/lỗi rõ ràng
- [ ] Loading state
- [ ] Cleanup `setTimeout`

### Security
- [ ] Không lưu plaintext password
- [ ] Không log password
- [ ] Cảnh báo localStorage không bảo mật
- [ ] Rate limit demo
- [ ] Thông báo lỗi không enumerate
- [ ] README ghi rõ giới hạn

### Test
- [ ] Register
- [ ] Login đúng/sai
- [ ] Remember
- [ ] Logout
- [ ] Protected route
- [ ] Change password
- [ ] Forgot/reset
- [ ] Google/Facebook demo
- [ ] Session expiry
- [ ] Cross-tab logout

---

## 10. Ghi chú cuối

- Tài liệu này **chỉ giải quyết auth phía frontend**, không đụng tới dữ liệu sản phẩm/đơn hàng.
- Google/Facebook và đổi mật khẩu **nằm trong scope**, nhưng là **mô phỏng localStorage**, không phải OAuth/email thật.
- Nếu sau này có backend, các phần cần thay:
  - hash password → server-side (Argon2/bcrypt),
  - session → HttpOnly cookie/JWT,
  - OAuth → provider thật,
  - reset/verify → email service,
  - rate limit/authorization → server.
- Cho đến lúc đó, mọi thứ trong `fix/auth` chỉ nên dùng cho demo/đồ án.
