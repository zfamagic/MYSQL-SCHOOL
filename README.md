🎓 教学事务管理系统 (学生选课管理系统)
基于 Vue3 + TypeScript 与 Node.js + Express + MySQL 构建的前后端分离教学管理平台，支持多角色权限控制，实现课程管理、在线选课、成绩录入与考勤记录全流程业务。








📖 项目介绍
本系统专为高校教学场景设计，采用 B/S 架构，打造简洁美观的响应式界面。系统核心功能包括用户认证、角色权限控制、课程管理、在线选课、成绩管理及考勤记录，支持数据持久化与自动统计。
✨ 核心能力
👤 多角色登录：管理员 / 教师 / 学生三级权限隔离
📚 课程管理：课程信息的新增、编辑与查看
🎯 在线选课：学生自主选课，触发器自动统计选课人数
📝 成绩管理：教师录入 / 修改成绩，学生实时查询
📋 考勤记录：学生出勤状态登记与管理
🔧 技术栈
⚡ 前端 (Frontend)
表格
类别	选型
核心框架	Vue3 + TypeScript
构建工具	Vite
UI 组件库	Element Plus
状态管理	Pinia
路由管理	Vue Router
网络请求	Axios
样式预编译	SCSS
🖥️ 后端 (Backend)
表格
类别	选型
运行环境	Node.js (LTS 18/20)
Web 框架	Express
数据库	MySQL 8.0+
API 文档	自定义 RESTful API
认证方案	JWT (JsonWebToken) + bcrypt
📁 项目结构
text
teaching-affairs-management-system/
├── 📁 public/             # 静态资源目录
├── 📁 src/                # 前端源码目录
│   ├── 📁 assets/         # 样式、图片资源
│   ├── 📁 components/     # 公共/业务组件
│   ├── 📁 router/         # 路由配置 (分角色管控)
│   ├── 📁 store/          # Pinia 状态管理
│   ├── 📁 views/          # 页面视图组件
│   ├── 📁 api/            # 接口请求封装
│   ├── 📁 utils/          # 工具函数
│   ├── 📁 types/          # TypeScript 类型定义
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── 📁 backend/            # 后端服务源码
│   ├── 📁 config/         # 数据库与全局配置
│   ├── 📁 controllers/    # 控制器 (业务逻辑)
│   ├── 📁 middlewares/    # 中间件 (权限/错误处理)
│   ├── 📁 models/         # 数据模型
│   ├── 📁 routes/         # 路由接口
│   ├── 📁 utils/          # 后端工具函数
│   ├── app.js             # Express 配置
│   └── server.js          # 服务启动入口
├── package.json           # 项目依赖
└── README.md              # 项目说明文档
🚀 快速开始
1. 环境准备
确保本地已安装以下基础环境：
Node.js: >= 18.x (LTS)
MySQL: >= 8.0
npm: 随 Node.js 安装
2. 安装依赖
bash
运行
# 1. 安装前端依赖 (根目录执行)
npm install

# 2. 安装后端依赖 (进入后端目录)
cd backend
npm install
cd .. # 返回根目录
3. 数据库配置
创建数据库
登录 MySQL，执行创建脚本：
sql
CREATE DATABASE teaching_system;
USE teaching_system;
配置环境变量
在 backend 目录下新建 .env 文件，填入以下内容并修改密码：
dotenv
# 后端服务端口
PORT=4000

# MySQL 连接信息
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=123456      # 修改为你的本地 MySQL 密码
MYSQL_DATABASE=teaching_system

# JWT 加密密钥
JWT_SECRET=teaching_system_secure_key_123
初始化数据表
将你提供的 SQL 脚本完整导入 teaching_system 数据库中。
4. 启动项目
bash
运行
# 1. 启动后端服务 (端口 4000)
cd backend
npm run dev

# 2. 启动前端服务 (端口 3000)
# 新开一个终端，在根目录执行
npm run dev
前端访问地址: http://localhost:3000
后端服务地址: http://localhost:4000
🔐 默认账号密码
所有账号密码统一为：123456
表格
角色	账号	权限说明
管理员	admin	系统管理、用户管理、课程管理
教师	teacher1 / teacher2	成绩录入、考勤管理、课程管理
学生	student1 / student2 / student3	选课、成绩查询、个人中心
💡 注意事项
首次运行：务必确保 MySQL 服务已启动，且 .env 中的密码配置正确。
Git 忽略：项目已配置 .gitignore，自动忽略 node_modules、.env 敏感文件及日志。
安全提示：密码采用 bcrypt 加盐加密，JWT Token 有效期为 1 天，请定期更新密钥。