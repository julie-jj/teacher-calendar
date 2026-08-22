import * as storage from '../../utils/storage.js';
import * as dateHelper from '../../utils/dateHelper.js';

Page({
  data: {
    courses: [],
    filteredCourses: [],
    filterType: 'all', // 'all', 'weekly', 'once'
    searchText: ''
  },

  onLoad() {
    this.loadCourses();
  },

  onShow() {
    this.loadCourses();
  },

  loadCourses() {
    const courses = storage.getCourses();
    this.setData({
      courses: courses
    });
    this.filterCourses();
  },

  filterCourses() {
    const { courses, filterType, searchText } = this.data;
    let filtered = courses;

    // 按类型筛选
    if (filterType === 'weekly') {
      filtered = filtered.filter(c => c.repeatType === 'weekly');
    } else if (filterType === 'once') {
      filtered = filtered.filter(c => c.repeatType !== 'weekly');
    }

    // 按搜索文本筛选
    if (searchText) {
      filtered = filtered.filter(c =>
        c.name.includes(searchText) || 
        (c.className && c.className.includes(searchText))
      );
    }

    this.setData({
      filteredCourses: filtered
    });
  },

  onFilterChange(e) {
    const filterType = e.currentTarget.dataset.type;
    this.setData({ filterType });
    this.filterCourses();
  },

  onSearchInput(e) {
    const searchText = e.detail.value;
    this.setData({ searchText });
    this.filterCourses();
  },

  onCourseClick(e) {
    const courseId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/courseDetail/courseDetail?id=${courseId}`
    });
  },

  onAddCourse() {
    wx.navigateTo({
      url: '/pages/addCourse/addCourse'
    });
  },

  onDeleteCourse(e) {
    e.stopPropagation();
    const courseId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除课程',
      content: '确定要删除这门课程吗？',
      success: (res) => {
        if (res.confirm) {
          storage.deleteCourse(courseId);
          this.loadCourses();
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  }
});
