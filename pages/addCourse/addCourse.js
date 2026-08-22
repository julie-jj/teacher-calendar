import * as storage from '../../utils/storage.js';
import * as dateHelper from '../../utils/dateHelper.js';

Page({
  data: {
    course: {
      name: '',
      startTime: '09:00',
      endTime: '10:00',
      date: '',
      repeatType: 'once', // 'once' 或 'weekly'
      weekdays: [],
      startDate: '',
      endDate: '',
      className: '',
      location: '',
      teacher: '',
      notes: ''
    },
    courseId: null,
    isEditing: false,
    availableWeekdays: [
      { id: 0, name: '周日', selected: false },
      { id: 1, name: '周一', selected: false },
      { id: 2, name: '周二', selected: false },
      { id: 3, name: '周三', selected: false },
      { id: 4, name: '周四', selected: false },
      { id: 5, name: '周五', selected: false },
      { id: 6, name: '周六', selected: false }
    ]
  },

  onLoad(options) {
    const today = dateHelper.getTodayString();
    const course = { ...this.data.course, date: today };
    
    if (options.id) {
      // 编辑模式
      const existingCourse = storage.getCourseById(options.id);
      if (existingCourse) {
        this.setData({
          course: existingCourse,
          courseId: options.id,
          isEditing: true
        });
        this.updateWeekdaySelection();
      }
    } else {
      // 新增模式
      this.setData({ course });
    }
  },

  updateWeekdaySelection() {
    const { course, availableWeekdays } = this.data;
    if (course.weekdays) {
      availableWeekdays.forEach(day => {
        day.selected = course.weekdays.includes(day.id);
      });
      this.setData({ availableWeekdays });
    }
  },

  onInputName(e) {
    const course = this.data.course;
    course.name = e.detail.value;
    this.setData({ course });
  },

  onInputClassName(e) {
    const course = this.data.course;
    course.className = e.detail.value;
    this.setData({ course });
  },

  onInputLocation(e) {
    const course = this.data.course;
    course.location = e.detail.value;
    this.setData({ course });
  },

  onInputTeacher(e) {
    const course = this.data.course;
    course.teacher = e.detail.value;
    this.setData({ course });
  },

  onInputNotes(e) {
    const course = this.data.course;
    course.notes = e.detail.value;
    this.setData({ course });
  },

  onStartTimeChange(e) {
    const course = this.data.course;
    course.startTime = e.detail.value;
    this.setData({ course });
  },

  onEndTimeChange(e) {
    const course = this.data.course;
    course.endTime = e.detail.value;
    this.setData({ course });
  },

  onDateChange(e) {
    const course = this.data.course;
    course.date = e.detail.value;
    this.setData({ course });
  },

  onRepeatTypeChange(e) {
    const course = this.data.course;
    course.repeatType = e.detail.value;
    this.setData({ course });
  },

  onStartDateChange(e) {
    const course = this.data.course;
    course.startDate = e.detail.value;
    this.setData({ course });
  },

  onEndDateChange(e) {
    const course = this.data.course;
    course.endDate = e.detail.value;
    this.setData({ course });
  },

  onWeekdayToggle(e) {
    const index = e.currentTarget.dataset.index;
    const availableWeekdays = this.data.availableWeekdays;
    availableWeekdays[index].selected = !availableWeekdays[index].selected;
    
    const selectedWeekdays = availableWeekdays
      .filter(d => d.selected)
      .map(d => d.id);
    
    const course = this.data.course;
    course.weekdays = selectedWeekdays;
    this.setData({ course, availableWeekdays });
  },

  onSaveCourse() {
    const { course, courseId, isEditing } = this.data;

    // 验证必填项
    if (!course.name) {
      wx.showToast({
        title: '请填写课程名称',
        icon: 'none'
      });
      return;
    }

    if (course.repeatType === 'once' && !course.date) {
      wx.showToast({
        title: '请选择课程日期',
        icon: 'none'
      });
      return;
    }

    if (course.repeatType === 'weekly') {
      if (!course.startDate || !course.endDate) {
        wx.showToast({
          title: '请选择周期性课程的开始和结束日期',
          icon: 'none'
        });
        return;
      }
      if (!course.weekdays || course.weekdays.length === 0) {
        wx.showToast({
          title: '请至少选择一个上课日期',
          icon: 'none'
        });
        return;
      }
    }

    if (isEditing) {
      storage.updateCourse(courseId, course);
      wx.showToast({
        title: '更新成功',
        icon: 'success'
      });
    } else {
      storage.addCourse(course);
      wx.showToast({
        title: '添加成功',
        icon: 'success'
      });
    }

    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  },

  onCancel() {
    wx.navigateBack();
  }
});
