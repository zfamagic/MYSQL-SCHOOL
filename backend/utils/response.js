/**
 * 统一响应格式工具
 */
module.exports = {
  /**
   * 成功响应
   * @param {Object} res - Express response 对象
   * @param {*} data - 响应数据
   * @param {string} message - 响应消息
   * @param {number} code - 状态码
   */
  success(res, data = null, message = '操作成功', code = 200) {
    res.status(code).json({
      success: true,
      code,
      message,
      data
    });
  },

  /**
   * 错误响应
   * @param {Object} res - Express response 对象
   * @param {string} message - 错误消息
   * @param {number} code - 状态码
   * @param {*} errors - 错误详情
   */
  error(res, message = '操作失败', code = 400, errors = null) {
    res.status(code).json({
      success: false,
      code,
      message,
      errors
    });
  },

  /**
   * 分页响应
   * @param {Object} res - Express response 对象
   * @param {Array} data - 数据列表
   * @param {number} total - 总记录数
   * @param {number} page - 当前页码
   * @param {number} size - 每页大小
   * @param {string} message - 响应消息
   */
  paginate(res, data, total, page, size, message = '操作成功') {
    res.status(200).json({
      success: true,
      code: 200,
      message,
      data: {
        list: data,
        pagination: {
          total,
          page: parseInt(page, 10) || 1,
          size: parseInt(size, 10) || 10,
          totalPages: Math.ceil(total / (parseInt(size, 10) || 10))
        }
      }
    });
  }
};