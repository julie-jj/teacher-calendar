import * as dateHelper from '../../utils/dateHelper.js';
import * as storage from '../../utils/storage.js';

Page({
  data: {
    currentYear: 0,
    currentMonth: 0,
    monthDays: [],
    viewMode: 'month', // 'month' 或 'week'
    selectedDate: '',
    coursesMap: {},
    weekDays: []
  },

  onLoad() {
    this.initializeCalendar();
  },

  onShow() {
    this.refreshCalendar();
  },

  initializeCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const dateString = dateHelper.getTodayString();

    this.setData({
      currentYear: year,
      currentMonth: month,
      selectedDate: dateString
    });

    this.loadMonthData(year, month);
  },

  refreshCalendar() {
    const { currentYear, currentMonth } = this.data;
    this.loadMonthData(currentYear, currentMonth);
  },

  loadMonthData(year, month) {
    const monthDays = dateHelper.getMonthDays(year, month);
    const dateRange = {
      start: monthDays[0].date,
      end: monthDays[monthDays.length - 1].date
    };

    const courses = storage.getCoursesByDateRange(dateRange.start, dateRange.end);
    const coursesMap = this.buildCoursesMap(courses);

    this.setData({
      monthDays: monthDays,
      coursesMap: coursesMap
    });
  },

  buildCoursesMap(courses) {
    const map = {};
    courses.forEach(course => {
      if (!map[course.date]) {
        map[course.date] = [];
      }
      map[course.date].push(course);
    });
    return map;
  },

  onPrevMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth--;
    if (currentMonth < 1) {
      currentMonth = 12;
      currentYear--;
    }
    this.setData({ currentYear, currentMonth });
    this.loadMonthData(currentYear, currentMonth);
  },

  onNextMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
    this.setData({ currentYear, currentMonth });
    this.loadMonthData(currentYear, currentMonth);
  },

  onDayClick(e) {
    const date = e.currentTarget.dataset.date;
    this.setData({ selectedDate: date });
    this.showDayDetail(date);
  },

  showDayDetail(date) {
    const courses = this.data.coursesMap[date] || [];
    const notes = storage.getNotesByDate(date);
    
    wx.navigateTo({
      url: `/pages/dayDetail/dayDetail?date=${date}`
    });
  },

  onToggleViewMode() {
    const newMode = this.data.viewMode === 'month' ? 'week' : 'month';
    this.setData({ viewMode: newMode });
  },

  onAddCourse() {
    wx.navigateTo({
      url: '/pages/addCourse/addCourse'
    });
  }
});
