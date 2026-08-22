import * as storage from '../../utils/storage.js';

Page({
  data: {
    holidays: [],
    showAddHolidayForm: false,
    newHoliday: {
      name: '',
      startDate: '',
      endDate: ''
    }
  },

  onLoad() {
    this.loadHolidays();
  },

  onShow() {
    this.loadHolidays();
  },

  loadHolidays() {
    const holidays = storage.getHolidays();
    this.setData({ holidays });
  },

  onShowAddForm() {
    this.setData({ showAddHolidayForm: true });
  },

  onCancelAddForm() {
    this.setData({
      showAddHolidayForm: false,
      newHoliday: { name: '', startDate: '', endDate: '' }
    });
  },

  onInputHolidayName(e) {
    const newHoliday = this.data.newHoliday;
    newHoliday.name = e.detail.value;
    this.setData({ newHoliday });
  },

  onInputStartDate(e) {
    const newHoliday = this.data.newHoliday;
    newHoliday.startDate = e.detail.value;
    this.setData({ newHoliday });
  },

  onInputEndDate(e) {
    const newHoliday = this.data.newHoliday;
    newHoliday.endDate = e.detail.value;
    this.setData({ newHoliday });
  },

  onAddHoliday() {
    const { name, startDate, endDate } = this.data.newHoliday;
    if (!name || !startDate || !endDate) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }
    if (startDate > endDate) {
      wx.showToast({
        title: '开始日期不能晚于结束日期',
        icon: 'none'
      });
      return;
    }
    storage.addHoliday({
      name,
      startDate,
      endDate,
      id: Date.now().toString()
    });
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
    this.onCancelAddForm();
    this.loadHolidays();
  },

  onDeleteHoliday(e) {
    const holidayId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除假期',
      content: '确定要删除这个假期吗？',
      success: (res) => {
        if (res.confirm) {
          storage.deleteHoliday(holidayId);
          this.loadHolidays();
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  onExportData() {
    const dataString = storage.exportAllData();
    // 复制到剪贴板
    wx.setClipboardData({
      data: dataString,
      success: () => {
        wx.showToast({
          title: '数据已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },

  onClearAllData() {
    wx.showModal({
      title: '清空数据',
      content: '确定要清空所有数据吗？此操作不可恢复！',
      success: (res) => {
        if (res.confirm) {
          storage.clearAllData();
          wx.showToast({
            title: '数据已清空',
            icon: 'success'
          });
          this.loadHolidays();
        }
      }
    });
  }
});
