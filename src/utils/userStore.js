// 用户状态管理工具
export const userStore = {
  // 获取当前登录用户信息
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // 设置用户信息
  setUser(userInfo) {
    localStorage.setItem('user', JSON.stringify(userInfo));
  },

  // 清除用户信息
  clearUser() {
    localStorage.removeItem('user');
    console.log('清除用户信息');
  },

  // 检查是否已登录（简化版）
  isLoggedIn() {
    // 首先检查localStorage中是否有用户信息
    const user = this.getCurrentUser();
    console.log('检查登录状态 - 用户信息:', user);
    
    if (!user) {
      console.log('localStorage中没有用户信息，用户未登录');
      return false;
    }

    console.log('用户已登录:', user.username);
    return true;
  },

  // 简单检查是否存在认证cookie
  checkCookie() {
    // 检查document.cookie中是否包含token
    return document.cookie.includes('token=');
  },

  // 获取用户ID
  getUserId() {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  },

  // 获取用户名
  getUsername() {
    const user = this.getCurrentUser();
    return user ? user.username : null;
  },

  // 获取用户头像URL
  getUserImageUrl() {
    const user = this.getCurrentUser();
    return user ? user.imgurl : null;
  },

  // 调试用：完全清除登录状态
  forceLogout() {
    console.log('强制退出登录');
    this.clearUser();
    // 清除所有相关的cookie（如果需要的话）
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    console.log('已清除所有登录状态');
  }
};

// 导出默认对象
export default userStore;