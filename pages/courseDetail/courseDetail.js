import * as storage from '../../utils/storage.js';
import * as dateHelper from '../../utils/dateHelper.js';

Page({
  data: {
    course: null,
    courseId: ''
  },

  onLoad(options) {
    const courseId = options.id;
    this.setData({ courseId });
    this.loadCourseDetail(courseId);
  },

  loadCourseDetail(courseId) {
    const course = storage.getCourseById(courseId);
    if (course) {
      this.setData({ course });
    } else {
      wx.showToast({
        title: '课程不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  onEditCourse() {
    wx.navigateTo({
      url: `/pages/addCourse/addCourse?id=${this.data.courseId}`
    });
  },

  onDeleteCourse() {
    wx.showModal({
      title: '删除课程',
      content: '确定要删除这门课程吗？',
      success: (res) => {
        if (res.confirm) {
          storage.deleteCourse(this.data.courseId);
          wx.showToast({
            title: '删除成���',
            icon: 'success'
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      }
    });
  }
});
