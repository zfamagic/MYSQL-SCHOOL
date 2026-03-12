教学事务管理系统（学生选课管理系统）
基于 Vue3 + TypeScript + Element Plus + Pinia 前端 + Node.js + Express + MySQL 后端的前后端分离教学管理平台，支持管理员、教师、学生多角色权限管理，实现课程管理、选课、成绩录入、考勤等核心功能。
一、项目介绍
本系统为高校教学场景设计，采用前后端分离 B/S 架构，实现用户认证、权限控制、课程管理、在线选课、成绩管理、考勤记录全流程业务，界面美观、操作简洁，支持响应式布局。
核心能力
多角色登录：管理员 / 教师 / 学生
权限路由：不同角色访问对应页面与接口
课程管理：新增、编辑、查看课程信息
在线选课：学生自主选课，自动统计选课人数
成绩管理：教师录入 / 修改成绩，学生查询成绩
考勤记录：教师登记学生出勤状态
数据持久化：MySQL 存储，触发器自动更新选课人数
二、技术栈
前端
框架：Vue3 + TypeScript
构建工具：Vite
UI 组件：Element Plus
状态管理：Pinia
路由：Vue Router
请求库：Axios
样式：SCSS
后端
运行环境：Node.js
服务框架：Express
数据库：MySQL 8.0+
核心依赖：mysql2、jsonwebtoken、bcryptjs、cors、nodemon
认证方式：JWT 无状态认证
三、项目目录结构
plaintext
teaching-affairs-management-system/
├── public/                # 静态资源
├── src/                   # 前端源码
│   ├── assets/            # 样式、图片资源
│   ├── components/        # 公共/业务组件
│   ├── router/            # 路由配置（分角色）
│   ├── store/             # Pinia状态管理
│   ├── views/             # 页面组件
│   ├── api/               # 接口请求
│   ├── utils/             # 工具函数
│   ├── types/             # TS类型定义
│   ├── App.vue
│   └── main.ts
├── backend/               # 后端源码
│   ├── config/            # 数据库/全局配置
│   ├── controllers/       # 控制器（业务逻辑）
│   ├── middlewares/       # 中间件（权限/错误处理）
│   ├── models/            # 数据模型
│   ├── routes/            # 路由接口
│   ├── utils/             # 后端工具
│   ├── app.js             # Express配置
│   └── server.js          # 服务启动
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
四、环境准备
Node.js：18.x/ 20.x LTS 版本
MySQL：8.0 及以上版本
浏览器：Chrome / Edge
五、安装与配置
1. 克隆 / 下载项目
将项目放置本地目录，进入项目根目录
2. 安装前端依赖
bash
运行
# 根目录执行
npm install
3. 安装后端依赖
bash
运行
# 进入后端目录
cd backend
# 安装依赖
npm install
# 返回根目录
cd ..
4. 环境变量配置
前端 .env（根目录创建）
plaintext
VITE_API_BASE_URL=http://localhost:4000/api
后端 .env（backend 目录创建）
plaintext
PORT=4000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=你的MySQL密码
MYSQL_DATABASE=teaching_system
JWT_SECRET=自定义密钥（如：teaching123456）
六、数据库初始化
1. 创建数据库
sql
CREATE DATABASE teaching_system;
USE teaching_system;
2. 创建数据表
sql
-- 用户表
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role ENUM('admin','teacher','student') NOT NULL,
  name VARCHAR(50) NOT NULL
);

-- 课程表
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  credit INT NOT NULL,
  teacher INT NOT NULL,
  current_student INT DEFAULT 0,
  FOREIGN KEY (teacher) REFERENCES users(id)
);

-- 成绩表
CREATE TABLE scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  score INT NOT NULL,
  semester VARCHAR(50) NOT NULL DEFAULT '2024-2025学年第一学期',
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  UNIQUE KEY (student_id, course_id)
);

-- 选课表
CREATE TABLE selected_courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  selected_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  UNIQUE KEY (student_id, course_id)
);

-- 考勤表
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT,
  student_id INT,
  status ENUM('present','absent'),
  date DATETIME DEFAULT CURRENT_TIMESTAMP
);
3. 插入初始数据
sql
-- 用户数据（密码统一：123456）
INSERT INTO users (username, password, role, name) VALUES
('admin','$2a$10$XQ8z4nH4hJ6uL5mX2yN9OeBvCwDxGfEgHhIiJjKkLlMmNnOoPpQq','admin','系统管理员'),
('teacher1','$2a$10$XQ8z4nH4hJ6uL5mX2yN9OeBvCwDxGfEgHhIiJjKkLlMmNnOoPpQq','teacher','张老师'),
('teacher2','$2a$10$XQ8z4nH4hJ6uL5mX2yN9OeBvCwDxGfEgHhIiJjKkLlMmNnOoPpQq','teacher','李老师'),
('student1','$2a$10$XQ8z4nH4hJ6uL5mX2yN9OeBvCwDxGfEgHhIiJjKkLlMmNnOoPpQq','student','小明'),
('student2','$2a$10$XQ8z4nH4hJ6uL5mX2yN9OeBvCwDxGfEgHhIiJjKkLlMmNnOoPpQq','student','小红'),
('student3','$2a$10$XQ8z4nH4hJ6uL5mX2yN9OeBvCwDxGfEgHhIiJjKkLlMmNnOoPpQq','student','小刚');

-- 课程数据
INSERT INTO courses (name, code, credit, teacher) VALUES
('高等数学','MATH101',4,2),('大学物理','PHYS101',4,2),
('程序设计','CS101',3,3),('数据结构','CS201',3,3),
('线性代数','MATH201',3,2),('概率论','MATH301',3,2),
('操作系统','CS301',3,3),('计算机网络','CS401',3,3),
('大学英语','ENG101',2,2),('体育','PE101',1,3);

-- 选课/成绩数据
INSERT INTO selected_courses (student_id,course_id) VALUES (4,1),(4,3),(5,2),(5,4),(6,1),(6,3);
INSERT INTO scores (student_id,course_id,score) VALUES (4,1,85),(4,3,92),(5,2,78),(5,4,88),(6,1,90),(6,3,76);
4. 初始化选课人数 + 创建触发器
sql
-- 初始化课程选课人数
UPDATE courses c JOIN (SELECT course_id,COUNT(*) AS cnt FROM selected_courses GROUP BY course_id) sc ON c.id=sc.course_id SET c.current_student=sc.cnt;

-- 选课人数+1触发器
DELIMITER //
CREATE TRIGGER trg_selected_courses_insert AFTER INSERT ON selected_courses FOR EACH ROW
BEGIN UPDATE courses SET current_student=current_student+1 WHERE id=NEW.course_id; END //
DELIMITER ;

-- 选课人数-1触发器
DELIMITER //
CREATE TRIGGER trg_selected_courses_delete AFTER DELETE ON selected_courses FOR EACH ROW
BEGIN UPDATE courses SET current_student=current_student-1 WHERE id=OLD.course_id; END //
DELIMITER ;
七、启动项目
1. 启动后端服务
bash
运行
cd backend
npm run dev
# 服务运行在：http://localhost:4000
2. 启动前端项目
bash
运行
# 项目根目录执行
npm run dev
# 前端运行在：http://localhost:3000
八、默认账号密码
所有账号密码统一：123456
管理员：admin
教师：teacher1、teacher2
学生：student1、student2、student3
九、功能模块
管理员
系统概览、用户管理（增删改查）、课程管理、权限管理
教师
授课计划、成绩录入与修改、学生考勤管理
学生
课程查询与选课、个人成绩查询、个人信息查看
十、注意事项
启动前务必修改 backend/.env 中的 MySQL 密码为本地密码
首次运行需完整执行数据库初始化脚本
项目已配置 .gitignore，自动忽略 node_modules、.env、日志等文件
密码采用 bcrypt 加密，JWT 令牌有效期 1 天，支持无状态认证