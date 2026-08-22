/**
 * 日期处理工具函数
 */

// 获取今天的日期字符串 YYYY-MM-DD
export function getTodayString() {
  const today = new Date();
  return formatDate(today);
}

// 格式化日期为 YYYY-MM-DD
export function formatDate(date) {
  if (typeof date === 'string') {
    return date;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 格式化日期为显示格式 如 2026年8月22日
export function formatDateDisplay(dateString) {
  const date = new Date(dateString + ' 00:00:00');
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

// 获取星期几
export function getWeekday(dateString) {
  const date = new Date(dateString + ' 00:00:00');
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return weekdays[date.getDay()];
}

// 获取星期几（英文缩写）
export function getWeekdayEn(dateString) {
  const date = new Date(dateString + ' 00:00:00');
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return weekdays[date.getDay()];
}

// 比较两个日期是否相同
export function isSameDate(date1, date2) {
  return formatDate(date1) === formatDate(date2);
}

// 获取两个日期之间的天数差
export function getDaysDifference(startDate, endDate) {
  const start = new Date(startDate + ' 00:00:00');
  const end = new Date(endDate + ' 00:00:00');
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// 判断日期是否在指定范围内
export function isDateInRange(date, startDate, endDate) {
  return date >= startDate && date <= endDate;
}

// 获取月份的所有天数
export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

// 获取月份的第一天是星期几
export function getFirstDayOfMonth(year, month) {
  return new Date(year, month - 1, 1).getDay();
}

// 获取本月的日期数组（用于日历显示）
export function getMonthDays(year, month) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = [];

  // 添加上月的日期
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = prevMonthDays - firstDay + 1; i <= prevMonthDays; i++) {
    days.push({
      date: formatDate(new Date(year, month - 2, i)),
      isCurrentMonth: false,
      day: i
    });
  }

  // 添加本月的日期
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: formatDate(new Date(year, month - 1, i)),
      isCurrentMonth: true,
      day: i
    });
  }

  // 添加下月的日期
  const remainingDays = 42 - days.length; // 6行 * 7列 = 42
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: formatDate(new Date(year, month, i)),
      isCurrentMonth: false,
      day: i
    });
  }

  return days;
}

// 获取周的日期数组
export function getWeekDays(dateString) {
  const date = new Date(dateString + ' 00:00:00');
  const dayOfWeek = date.getDay();
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - dayOfWeek);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push(formatDate(d));
  }
  return days;
}

// 添加天数
export function addDays(dateString, days) {
  const date = new Date(dateString + ' 00:00:00');
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

// 获取下一个假期（返回距离天数和假期名称）
export function getNextHoliday(holidays) {
  const today = getTodayString();
  let nextHoliday = null;
  let minDays = Infinity;

  holidays.forEach(holiday => {
    if (holiday.endDate >= today) {
      const daysToHoliday = getDaysDifference(today, holiday.startDate);
      if (daysToHoliday < minDays) {
        minDays = daysToHoliday;
        nextHoliday = {
          ...holiday,
          daysUntil: daysToHoliday
        };
      }
    }
  });

  return nextHoliday;
}

// 判断日期是否是假期
export function isHoliday(dateString, holidays) {
  return holidays.some(holiday => 
    dateString >= holiday.startDate && dateString <= holiday.endDate
  );
}

// 比较时间大小 格式 "14:30"
export function compareTime(time1, time2) {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;
  if (minutes1 < minutes2) return -1;
  if (minutes1 > minutes2) return 1;
  return 0;
}

// 计算两个时间的分钟差
export function getTimeDifference(startTime, endTime) {
  const [h1, m1] = startTime.split(':').map(Number);
  const [h2, m2] = endTime.split(':').map(Number);
  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;
  return minutes2 - minutes1;
}

// 格式化时间为 HH:MM 格式
export function formatTime(hours, minutes) {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// 将分钟转换为小时:分钟格式
export function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return formatTime(hours, minutes);
}
