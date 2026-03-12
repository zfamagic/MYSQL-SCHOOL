// 解决导出冲突：改为命名空间导出
import * as authApi from './auth'
import * as adminApi from './admin'
import * as teacherApi from './teacher'
import * as studentApi from './student'

export { authApi, adminApi, teacherApi, studentApi }