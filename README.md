# 实验室试剂与仪器管控平台

## 项目简介

实验室试剂与仪器管控平台是一套面向科研实验室、检测机构、高校实验中心的信息化管理系统。系统涵盖试剂采购领用、危化品台账管理、仪器预约使用、实验原始记录存档等核心业务场景，帮助实验室实现规范化、数字化管理，提升管理效率，保障实验室安全。

## 适用场景

- 高校化学/生物/环境实验室
- 第三方检测机构（CMA/CNAS实验室）
- 企业研发中心实验室
- 医院检验科/病理科
- 政府环境监测站
- 各类需要试剂和仪器管理的科研单位

## 核心功能

### 1. 试剂管理
- 试剂信息登记（名称、CAS号、分类、规格、供应商等）
- 采购入库与领用出库操作
- 库存自动更新与低库存预警
- 出入库操作记录追溯

### 2. 危化品台账
- 危化品信息登记（危险分类、UN编号、风险短语、安全短语）
- 危化品出入库管理
- 储存条件与责任人管理
- 完整的操作日志记录

### 3. 仪器预约
- 仪器设备信息管理（型号、制造商、序列号、位置等）
- 在线预约使用（时间段选择、用途说明）
- 预约冲突检测
- 管理员审批预约（确认/拒绝）

### 4. 实验记录
- 实验原始记录创建与编辑
- 实验流程管理（草稿→进行中→已完成）
- 实验步骤、结果、结论记录
- 实验分类与检索

### 5. 系统管理
- 用户注册与登录
- 基于角色的权限控制（管理员/普通用户）
- 仪表盘数据概览
- 库存预警与待办提醒

## 技术栈

| 技术 | 说明 |
|------|------|
| Node.js 20 | 运行时环境 |
| Express.js 4 | Web框架 |
| TypeScript | 开发语言 |
| EJS | 模板引擎 |
| SQLite (better-sqlite3) | 数据库 |
| bcryptjs | 密码加密 |
| express-session | 会话管理 |
| connect-sqlite3 | Session存储 |

## 目录结构

```
repo/
├── package.json              # 项目依赖配置
├── tsconfig.json             # TypeScript配置
├── .gitignore                # Git忽略规则
├── README.md                 # 项目文档
├── src/
│   ├── config/
│   │   ├── app.ts            # Express应用配置
│   │   └── database.ts       # 数据库初始化与连接
│   ├── controllers/
│   │   ├── authController.ts       # 认证控制器
│   │   ├── reagentController.ts    # 试剂控制器
│   │   ├── hazardController.ts     # 危化品控制器
│   │   ├── instrumentController.ts # 仪器控制器
│   │   ├── experimentController.ts # 实验记录控制器
│   │   └── dashboardController.ts  # 仪表盘控制器
│   ├── middleware/
│   │   └── auth.ts           # 认证中间件
│   ├── models/
│   │   ├── user.ts           # 用户模型
│   │   ├── reagent.ts        # 试剂模型
│   │   ├── hazardChemical.ts # 危化品模型
│   │   ├── instrument.ts     # 仪器模型
│   │   ├── reservation.ts    # 预约模型
│   │   └── experiment.ts     # 实验记录模型
│   ├── routes/
│   │   ├── index.ts          # 路由汇总
│   │   ├── auth.ts           # 认证路由
│   │   ├── reagents.ts       # 试剂路由
│   │   ├── hazards.ts        # 危化品路由
│   │   ├── instruments.ts    # 仪器路由
│   │   └── experiments.ts    # 实验记录路由
│   ├── services/
│   │   ├── userService.ts         # 用户服务
│   │   ├── reagentService.ts      # 试剂服务
│   │   ├── hazardService.ts       # 危化品服务
│   │   ├── instrumentService.ts   # 仪器服务
│   │   └── experimentService.ts   # 实验记录服务
│   ├── seed.ts                # 种子数据
│   └── server.ts              # 入口文件
├── views/
│   ├── layout.ejs             # 基础布局
│   ├── index.ejs              # 首页
│   ├── partials/
│   │   ├── header.ejs         # 页头
│   │   └── footer.ejs         # 页脚
│   ├── auth/
│   │   ├── login.ejs          # 登录页
│   │   └── register.ejs       # 注册页
│   ├── reagents/
│   │   ├── list.ejs           # 试剂列表
│   │   ├── detail.ejs         # 试剂详情
│   │   ├── create.ejs         # 新增试剂
│   │   └── edit.ejs           # 编辑试剂
│   ├── hazards/
│   │   ├── list.ejs           # 危化品列表
│   │   ├── detail.ejs         # 危化品详情
│   │   └── create.ejs         # 新增危化品
│   ├── instruments/
│   │   ├── list.ejs           # 仪器列表
│   │   ├── detail.ejs         # 仪器详情
│   │   └── reserve.ejs        # 仪器预约
│   ├── experiments/
│   │   ├── list.ejs           # 实验记录列表
│   │   ├── detail.ejs         # 实验记录详情
│   │   └── create.ejs         # 新增实验记录
│   └── dashboard/
│       └── overview.ejs       # 系统概览
└── public/
    ├── css/
    │   └── style.css          # 样式文件
    └── js/
        └── main.js            # 前端脚本
```

## Docker启动方式

### 构建镜像

```bash
cd lab-reagent
docker build -t lab-reagent .
```

### 运行容器

```bash
docker run -d \
  --name lab-reagent \
  -p 3000:3000 \
  -p 2222:22 \
  -e SSH_PUBLIC_KEY="$(cat ~/.ssh/id_rsa.pub)" \
  lab-reagent
```

### 访问系统

浏览器打开 `http://localhost:3000` 即可访问系统。

## 本地启动方式

### 前置条件

- Node.js >= 20
- npm >= 9

### 安装依赖

```bash
cd repo
npm install
```

### 初始化种子数据

```bash
npx ts-node src/seed.ts
```

### 启动服务

```bash
npx ts-node src/server.ts
```

### 开发模式（自动重启）

```bash
npx ts-node-dev --respawn src/server.ts
```

服务启动后访问 `http://localhost:3000`。

## 默认账号

| 用户名 | 密码 | 角色 | 部门 |
|--------|------|------|------|
| admin | admin123 | 管理员 | 信息中心 |
| zhangwei | 123456 | 普通用户 | 化学分析室 |
| lina | 123456 | 普通用户 | 微生物检测室 |
| wangfang | 123456 | 普通用户 | 环境监测室 |
| liuyang | 123456 | 管理员 | 质量管理部 |

## 可扩展方向

1. **数据导入导出**：支持Excel/CSV批量导入试剂数据，导出危化品台账报表
2. **审批流程**：试剂采购审批、危化品领用审批等多级审批流程
3. **条码/二维码管理**：为试剂和仪器生成条码，支持扫码出入库和查询
4. **预警通知**：库存预警邮件/短信通知、仪器维保到期提醒、危化品年检提醒
5. **权限细化**：基于部门的权限控制、操作审计日志
6. **移动端适配**：响应式布局优化或开发微信小程序
7. **数据可视化**：试剂消耗趋势图、仪器使用率统计、实验完成率分析
8. **LIMS集成**：与实验室信息管理系统(LIMS)对接
9. **文件管理**：实验附件上传下载、仪器操作规程文档管理
10. **多语言支持**：国际化(i18n)支持中英文切换
