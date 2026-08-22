import * as dateHelper from '../../utils/dateHelper.js';
import * as storage from '../../utils/storage.js';

Page({
  data: {
    holidayInfo: null,
    todayDate: '',
    todayWeekday: '',
    todayCourses: [],
    todayTodos: []
  },

  onLoad() {
    this.initializePageData();
  },

  onShow() {
    this.loadTodayData();
  },

  initializePageData() {
    const today = dateHelper.getTodayString();
    const weekday = dateHelper.getWeekday(today);
    const displayDate = dateHelper.formatDateDisplay(today);

    this.setData({
      todayDate: displayDate,
      todayWeekday: weekday
    });

    this.loadTodayData();
  },

  loadTodayData() {
    const today = dateHelper.getTodayString();

    // 获取下一个假期
    const holidays = storage.getHolidays();
    const nextHoliday = this.getNextHoliday(holidays);

    // 获取今日课程
    const courses = storage.getCoursesByDate(today);
    const sortedCourses = this.sortCoursesByTime(courses);

    // 获取今日代办（待办事项）
    const notes = storage.getNotesByDate(today);
    const todoNotes = notes.filter(n => n.type === 'daily' && !n.completed);

    this.setData({
      holidayInfo: nextHoliday,
      todayCourses: sortedCourses,
      todayTodos: todoNotes
    });
  },

  getNextHoliday(holidays) {
    const today = dateHelper.getTodayString();
    let nextHoliday = null;
    let minDays = Infinity;

    holidays.forEach(holiday => {
      if (holiday.endDate >= today) {
        const daysToStart = dateHelper.getDaysDifference(today, holiday.startDate);
        if (daysToStart < minDays) {
          minDays = daysToStart;
          nextHoliday = {
            ...holiday,
            daysUntil: daysToStart
          };
        }
      }
    });

    return nextHoliday;
  },

  sortCoursesByTime(courses) {
    return courses.sort((a, b) => {
      return dateHelper.compareTime(a.startTime, b.startTime);
    });
  },

  onCourseClick(e) {
    const courseId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/courseDetail/courseDetail?id=${courseId}`
    });
  },

  onTodoClick(e) {
    const todoId = e.currentTarget.dataset.id;
    const todo = this.data.todayTodos.find(t => t.id === todoId);
    if (todo) {
      storage.updateNote(todoId, { completed: true });
      this.loadTodayData();
    }
  },

  onGoToCalendar() {
    wx.switchTab({
      url: '/pages/calendar/calendar'
    });
  },

  onAddCourse() {
    wx.navigateTo({
      url: '/pages/addCourse/addCourse'
    });
  },

  onAddTodo() {
    wx.navigateTo({
      url: '/pages/addNote/addNote?type=daily'
    });
  }
});
