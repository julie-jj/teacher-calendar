App({
  onLaunch() {
    // 初始化应用
    this.initializeApp();
  },

  initializeApp() {
    // 检查本地数据
    const courses = wx.getStorageSync('courses') || [];
    const notes = wx.getStorageSync('notes') || [];
    const holidays = wx.getStorageSync('holidays') || this.getDefaultHolidays();
    
    if (!wx.getStorageSync('courses')) {
      wx.setStorageSync('courses', courses);
    }
    if (!wx.getStorageSync('notes')) {
      wx.setStorageSync('notes', notes);
    }
    if (!wx.getStorageSync('holidays')) {
      wx.setStorageSync('holidays', holidays);
    }
  },

  getDefaultHolidays() {
    return [
      {
        name: '春节',
        startDate: '2026-02-01',
        endDate: '2026-02-15'
      },
      {
        name: '清明节',
        startDate: '2026-04-04',
        endDate: '2026-04-06'
      },
      {
        name: '劳动节',
        startDate: '2026-05-01',
        endDate: '2026-05-05'
      },
      {
        name: '端午节',
        startDate: '2026-06-09',
        endDate: '2026-06-11'
      },
      {
        name: '暑假',
        startDate: '2026-07-01',
        endDate: '2026-08-31'
      },
      {
        name: '中秋节',
        startDate: '2026-09-15',
        endDate: '2026-09-17'
      },
      {
        name: '国庆节',
        startDate: '2026-10-01',
        endDate: '2026-10-07'
      },
      {
        name: '寒假',
        startDate: '2027-01-01',
        endDate: '2027-01-31'
      }
    ];
  },

  // 获取课程列表
  getCourses() {
    return wx.getStorageSync('courses') || [];
  },

  // 保存课程
  saveCourses(courses) {
    wx.setStorageSync('courses', courses);
  },

  // 获取备注列表
  getNotes() {
    return wx.getStorageSync('notes') || [];
  },

  // 保存备注
  saveNotes(notes) {
    wx.setStorageSync('notes', notes);
  },

  // 获取假期列表
  getHolidays() {
    return wx.getStorageSync('holidays') || [];
  },

  // 保存假期
  saveHolidays(holidays) {
    wx.setStorageSync('holidays', holidays);
  }
});
