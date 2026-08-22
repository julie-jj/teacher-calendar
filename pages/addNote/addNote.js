import * as storage from '../../utils/storage.js';
import * as dateHelper from '../../utils/dateHelper.js';

Page({
  data: {
    note: {
      content: '',
      date: '',
      type: 'daily', // 'daily' 或 'course'
      priority: '普通', // '低', '普通', '高'
      time: '',
      completed: false
    },
    noteId: null,
    isEditing: false
  },

  onLoad(options) {
    const today = dateHelper.getTodayString();
    const note = { ...this.data.note, date: today, type: options.type || 'daily' };
    
    if (options.id) {
      // 编辑模式
      const existingNote = storage.getNoteById(options.id);
      if (existingNote) {
        this.setData({
          note: existingNote,
          noteId: options.id,
          isEditing: true
        });
      }
    } else {
      this.setData({ note });
    }
  },

  onInputContent(e) {
    const note = this.data.note;
    note.content = e.detail.value;
    this.setData({ note });
  },

  onDateChange(e) {
    const note = this.data.note;
    note.date = e.detail.value;
    this.setData({ note });
  },

  onPriorityChange(e) {
    const note = this.data.note;
    note.priority = e.detail.value;
    this.setData({ note });
  },

  onTimeChange(e) {
    const note = this.data.note;
    note.time = e.detail.value;
    this.setData({ note });
  },

  onSaveNote() {
    const { note, noteId, isEditing } = this.data;

    if (!note.content) {
      wx.showToast({
        title: '请填写备注内容',
        icon: 'none'
      });
      return;
    }

    if (isEditing) {
      storage.updateNote(noteId, note);
      wx.showToast({
        title: '更新成功',
        icon: 'success'
      });
    } else {
      storage.addNote(note);
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
