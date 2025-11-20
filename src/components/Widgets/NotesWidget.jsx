import React, { useState } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useLanguage } from '../../context/LanguageContext';

const NotesWidget = () => {
  const { t } = useLanguage();
  const { notes, addNote, deleteNote, showToast } = useCalendar();
  const [noteText, setNoteText] = useState('');

  const handleAddNote = () => {
    if (!noteText.trim()) {
      showToast(t('noteText'), 'error');
      return;
    }

    addNote(noteText.trim());
    setNoteText('');
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddNote();
    }
  };

  return (
    <div className="notes-widget">
      <div className="widget-header">
        <h3>📝 {t('notes')}</h3>
      </div>

      <div className="add-note-section">
        <textarea
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('noteText')}
          className="note-textarea"
          rows={3}
        />
        <button onClick={handleAddNote} className="btn btn-primary btn-add-note">
          {t('addNote')}
        </button>
      </div>

      <div className="notes-list">
        {notes.length === 0 ? (
          <div className="empty-state">{t('noNotes')}</div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="note-item">
              <div className="note-content">{note.text}</div>
              <div className="note-meta">
                <span className="note-date">{new Date(note.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="btn-delete-note"
                  title={t('delete')}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(NotesWidget);
