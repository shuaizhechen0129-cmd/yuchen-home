# 雨宸公寓网站性能优化和安全防护指南

## 优化内容

### 1. 性能优化

#### 🚀 加载速度优化
- **预加载关键资源**：使用 `<link rel="preload">` 预加载CSS和图片
- **CSS优化**：
  - 关键CSS内联，减少阻塞渲染
  - 懒加载非关键CSS
  - 使用媒体查询按需加载
- **图片优化**：
  - 使用 `loading="lazy"` 实现懒加载
  - 使用 `fetchpriority` 优化关键图片加载
- **JavaScript优化**：
  - 延迟加载非关键脚本
  - 使用 `defer` 属性
  - 实现 IntersectionObserver 懒加载

#### 📦 缓存策略
- **浏览器缓存**：
  - HTML：禁用缓存（实时更新）
  - CSS/JS：1年缓存
  - 图片/字体：1年缓存
- **服务器缓存**：
  - 启用 ETag
  - 启用压缩（Gzip/Brotli）
  - 启用 Keep-Alive

### 2. 安全防护

#### 🔒 内容安全策略（CSP）
```http
Content-Security-Policy: 
  default-src 'self';
  img-src 'self' data: https://*.gravatar.com;
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  font-src 'self' data:;
  connect-src 'self' https://*.google-analytics.com;
```

#### 🛡️ 安全头配置
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

#### 🚫 攻击防护
- 防止点击劫持
- 防止MIME类型混淆攻击
- 防止目录列表
- 防止访问敏感文件

## 部署步骤

### 1. 本地测试
```bash
# 启动本地服务器
cd /path/to/雨宸文件夹
python3 -m http.server 8080

# 访问性能测试页面
http://localhost:8080/performance-test.html
```

### 2. 生产环境部署

#### Nginx 配置示例
```nginx
server {
    listen 80;
    server_name www.yuchen-apartment.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.yuchen-apartment.com;
    
    # SSL证书配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self';" always;
    
    # 缓存配置
    location ~* \.(css|js|ico|gif|jpe?g|png|webp|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    location ~* \.html$ {
        add_header Cache-Control "no-cache";
    }
    
    # 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # 静态文件根目录
    root /path/to/雨宸;
    index index.html;
}
```

### 3. 性能监控
- 使用 PageSpeed Insights 测试
- 使用 Lighthouse CI 定期检查
- 监控 Core Web Vitals（LCP, FID, CLS）

## 文件说明

- `optimized-index.html` - 优化后的主页面
- `.htaccess` - Apache服务器配置文件
- `performance-test.html` - 性能测试工具
- `README-optimization.md` - 本说明文档

## 注意事项

1. **HTTPS**：必须启用HTTPS，否则部分安全特性无法生效
2. **CSP调试**：初次启用CSP可能出现资源加载失败，需要调整CSP规则
3. **浏览器兼容性**：某些特性（如fetchpriority）需要较新的浏览器版本
4. **定期更新**：定期检查和更新安全配置

## 性能目标

- 首屏加载时间 < 2秒
- LCP (最大内容绘制) < 2.5秒
- FID (首次输入延迟) < 100ms
- CLS (累积布局偏移) < 0.1
- Lighthouse评分 > 90