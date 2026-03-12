/**
 * 日期格式化工具
 * @param date - 日期对象、时间戳或时间字符串
 * @param fmt - 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string | number, fmt: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return fmt
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 时间格式化函数（兼容 MySQL datetime 格式）
 * @param timeString - 时间字符串、时间戳、Date 对象、null 或 undefined
 * @returns 格式化后的时间字符串
 */
export function formatTime(timeString: string | number | Date | null | undefined): string {
  // 如果是空值，直接返回提示
  if (timeString === undefined || timeString === null || timeString === '') {
    return '未设置'
  }

  let parsedDate: Date

  // 如果是字符串，尝试兼容 MySQL 格式（YYYY-MM-DD HH:mm:ss）
  if (typeof timeString === 'string') {
    // MySQL 格式转成 JS Date 可识别的 ISO 格式
    if (timeString.includes(' ')) {
      parsedDate = new Date(timeString.replace(' ', 'T') + 'Z')
    } else {
      parsedDate = new Date(timeString)
    }
  } else {
    // 直接用时间戳或 Date 对象
    parsedDate = new Date(timeString)
  }

  // 检查是否是有效日期
  if (isNaN(parsedDate.getTime())) {
    return '时间格式错误'
  }

  return formatDate(parsedDate, 'YYYY-MM-DD HH:mm:ss')
}