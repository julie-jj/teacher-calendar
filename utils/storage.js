/**
 * 本地存储管理
 */

const COURSES_KEY = 'courses';
const NOTES_KEY = 'notes';
const HOLIDAYS_KEY = 'holidays';

// ============ 课程存储 ============

export function getCourses() {
  try {
    return wx.getStorageSync(COURSES_KEY) || [];
  } catch (e) {
    console.error('获取课程失败:', e);
    return [];
  }
}

export function saveCourses(courses) {
  try {
    wx.setStorageSync(COURSES_KEY, courses);
    return true;
  } catch (e) {
    console.error('保存课程失败:', e);
    wx.showToast({
      title: '保存失败',
      icon: 'none'
    });
    return false;
  }
}

export function addCourse(course) {
  const courses = getCourses();
  course.id = Date.now().toString();
  course.createdAt = new Date().toISOString();
  courses.push(course);
  return saveCourses(courses);
}

export function updateCourse(courseId, courseData) {
  const courses = getCourses();
  const index = courses.findIndex(c => c.id === courseId);
  if (index !== -1) {
    courses[index] = { ...courses[index], ...courseData, updatedAt: new Date().toISOString() };
    return saveCourses(courses);
  }
  return false;
}

export function deleteCourse(courseId) {
  const courses = getCourses();
  const filtered = courses.filter(c => c.id !== courseId);
  return saveCourses(filtered);
}

export function getCourseById(courseId) {
  const courses = getCourses();
  return courses.find(c => c.id === courseId);
}

export function getCoursesByDate(dateString) {
  const courses = getCourses();
  return courses.filter(c => {
    if (c.repeatType === 'weekly') {
      // 周期性课程：检查是否在有效期内且是相同的星期几
      return c.startDate <= dateString && 
             (!c.endDate || c.endDate >= dateString) &&
             c.weekdays && c.weekdays.includes(new Date(dateString + ' 00:00:00').getDay());
    } else {
      // 一次性课程：精确匹配日期
      return c.date === dateString;
    }
  });
}

export function getCoursesByDateRange(startDate, endDate) {
  const courses = getCourses();
  return courses.filter(c => {
    if (c.repeatType === 'weekly') {
      return c.startDate <= endDate && (!c.endDate || c.endDate >= startDate);
    } else {
      return c.date >= startDate && c.date <= endDate;
    }
  });
}

// ============ 备注存储 ============

export function getNotes() {
  try {
    return wx.getStorageSync(NOTES_KEY) || [];
  } catch (e) {
    console.error('获取备注失败:', e);
    return [];
  }
}

export function saveNotes(notes) {
  try {
    wx.setStorageSync(NOTES_KEY, notes);
    return true;
  } catch (e) {
    console.error('保存备注失败:', e);
    wx.showToast({
      title: '保存失败',
      icon: 'none'
    });
    return false;
  }
}

export function addNote(note) {
  const notes = getNotes();
  note.id = Date.now().toString();
  note.createdAt = new Date().toISOString();
  notes.push(note);
  return saveNotes(notes);
}

export function updateNote(noteId, noteData) {
  const notes = getNotes();
  const index = notes.findIndex(n => n.id === noteId);
  if (index !== -1) {
    notes[index] = { ...notes[index], ...noteData, updatedAt: new Date().toISOString() };
    return saveNotes(notes);
  }
  return false;
}

export function deleteNote(noteId) {
  const notes = getNotes();
  const filtered = notes.filter(n => n.id !== noteId);
  return saveNotes(filtered);
}

export function getNoteById(noteId) {
  const notes = getNotes();
  return notes.find(n => n.id === noteId);
}

export function getNotesByDate(dateString) {
  const notes = getNotes();
  return notes.filter(n => n.date === dateString);
}

export function getNotesByDateRange(startDate, endDate) {
  const notes = getNotes();
  return notes.filter(n => n.date >= startDate && n.date <= endDate);
}

export function getNotesByType(type) {
  const notes = getNotes();
  return notes.filter(n => n.type === type); // 'course' 或 'daily'
}

// ============ 假期存储 ============

export function getHolidays() {
  try {
    return wx.getStorageSync(HOLIDAYS_KEY) || [];
  } catch (e) {
    console.error('获取假期失败:', e);
    return [];
  }
}

export function saveHolidays(holidays) {
  try {
    wx.setStorageSync(HOLIDAYS_KEY, holidays);
    return true;
  } catch (e) {
    console.error('保存假期失败:', e);
    wx.showToast({
      title: '保存失败',
      icon: 'none'
    });
    return false;
  }
}

export function addHoliday(holiday) {
  const holidays = getHolidays();
  holiday.id = Date.now().toString();
  holidays.push(holiday);
  return saveHolidays(holidays);
}

export function updateHoliday(holidayId, holidayData) {
  const holidays = getHolidays();
  const index = holidays.findIndex(h => h.id === holidayId);
  if (index !== -1) {
    holidays[index] = { ...holidays[index], ...holidayData };
    return saveHolidays(holidays);
  }
  return false;
}

export function deleteHoliday(holidayId) {
  const holidays = getHolidays();
  const filtered = holidays.filter(h => h.id !== holidayId);
  return saveHolidays(filtered);
}

// ============ 数据导出 ============

export function exportAllData() {
  const data = {
    courses: getCourses(),
    notes: getNotes(),
    holidays: getHolidays(),
    exportTime: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
}

export function importData(dataString) {
  try {
    const data = JSON.parse(dataString);
    if (data.courses) saveCourses(data.courses);
    if (data.notes) saveNotes(data.notes);
    if (data.holidays) saveHolidays(data.holidays);
    return true;
  } catch (e) {
    console.error('导入数据失败:', e);
    return false;
  }
}

// ============ 数据清空 ============

export function clearAllData() {
  try {
    wx.removeStorageSync(COURSES_KEY);
    wx.removeStorageSync(NOTES_KEY);
    wx.removeStorageSync(HOLIDAYS_KEY);
    return true;
  } catch (e) {
    console.error('清空数据失败:', e);
    return false;
  }
}
