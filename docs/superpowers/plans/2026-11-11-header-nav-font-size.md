# Header Navigation Font Size Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Tăng nhẹ cỡ chữ menu, giỏ hàng và đăng nhập trong header.

**Architecture:** Chỉ chỉnh CSS hiện có trong `src/styles/global.css`; không đổi component hoặc thêm dependency.

**Tech Stack:** React, CSS, Vite.

**Spec:** `docs/superpowers/specs/2026-11-11-header-nav-font-size-design.md`

## Global Constraints
- `.nav-link` và `.cart-link`: `font-size: 0.9rem`.
- Nút đăng nhập: `font-size: 0.9rem`.
- Giữ nguyên responsive behavior và các thành phần khác.

## Review Focus
- Header ở viewport nhỏ: không làm tràn hoặc phá bố cục; kiểm tra CSS responsive hiện có.

---

### Task 1: Tăng cỡ chữ header

**Files:**
- Modify: `src/styles/global.css` (`.nav-link`, `.cart-link`, nút trong `.nav-actions`)

- [ ] **Step 1: Chỉnh CSS**
  Đổi `.nav-link` và `.cart-link` từ `0.78rem` thành `0.9rem`; đặt `font-size: 0.9rem` cho `.nav-actions .btn--light`.
- [ ] **Step 2: Verify**
  Chạy `npm run build`; xác nhận build thành công và xem lại vùng CSS responsive header để bảo đảm không thêm quy tắc làm thay đổi breakpoint.
