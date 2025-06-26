import React, { useState, useEffect } from 'react';
import './QuestionModal.css'; // Import the dedicated CSS file

const QuestionModal = ({ addQuestion, updateQuestion, closeModal, questionToEdit, setAlertConfig }) => {
  const [questionText, setQuestionText] = useState(questionToEdit?.question || '');
  const [questionType, setQuestionType] = useState(questionToEdit?.type || 'single');
  const [options, setOptions] = useState(questionToEdit?.options || [{ text: '', isCorrect: false }]);
  const [score, setScore] = useState(questionToEdit?.score || 2);

  const getDescriptiveQuestionType = (type) => {
    switch (type) {
      case 'single': return 'Single Choice (Radio Button)';
      case 'multiple': return 'Multiple Choice (Checkboxes)';
      case 'descriptive': return 'Descriptive Answer (Text Area)';
      default: return 'Unknown Type';
    }
  };

  useEffect(() => {
    if (questionToEdit) {
      setQuestionText(questionToEdit.question);
      setQuestionType(questionToEdit.type);
      setScore(questionToEdit.score);
      setOptions(questionToEdit.options || []);
    }
  }, [questionToEdit]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleCorrectChange = (index) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: (questionType === 'single') ? (i === index) : (i === index ? !opt.isCorrect : opt.isCorrect)
    }));
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const handleSubmitQuestion = () => {
    if (!questionText.trim()) {
      setAlertConfig({
        message: 'Question text cannot be empty.',
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
      return;
    }

    if (questionType !== 'descriptive') {
      if (options.some(opt => !opt.text.trim())) {
        setAlertConfig({
          message: 'All options must have text.',
          type: 'alert',
          onConfirm: () => setAlertConfig(null)
        });
        return;
      }
      if (!options.some(opt => opt.isCorrect)) {
        setAlertConfig({
          message: 'At least one option must be marked as correct.',
          type: 'alert',
          onConfirm: () => setAlertConfig(null)
        });
        return;
      }
    }

    const newQuestion = {
      id: questionToEdit?.id || `q-${Date.now()}`,
      question: questionText,
      type: questionType,
      score: score,
      options: questionType === 'descriptive' ? [] : options,
    };

    if (questionToEdit) {
      updateQuestion(newQuestion);
    } else {
      addQuestion(newQuestion);
    }
  };

  return (
    <div className="question-modal-backdrop">
      <div className="question-modal-content">
        <button onClick={closeModal} className="question-modal-close-button">&times;</button>
        <h2 className="question-modal-title">{questionToEdit ? 'Edit Question' : 'New Question'}</h2>

        <div>
          <label htmlFor="questionType" className="form-label">Question Type</label>
          <div className="select-wrapper question-type-select-wrapper">
            <select
              id="questionType"
              className="input-field"
              value={questionType}
              onChange={(e) => {
                  setQuestionType(e.target.value);
                  if (e.target.value === 'single') {
                      setOptions([{ text: '', isCorrect: true }]);
                  } else if (e.target.value === 'multiple') {
                      setOptions([{ text: '', isCorrect: false }]);
                  } else if (e.target.value === 'descriptive') {
                      setOptions([]);
                  }
              }}
            >
              <option value="single">{getDescriptiveQuestionType('single')}</option>
              <option value="multiple">{getDescriptiveQuestionType('multiple')}</option>
              <option value="descriptive">{getDescriptiveQuestionType('descriptive')}</option>
            </select>
            <span className="select-arrow">
              <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </span>
          </div>
        </div>

        <div className="score-input-wrapper">
          <label htmlFor="score" className="form-label">Score</label>
          <input
            type="number"
            id="score"
            className="input-field score-input"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="question" className="form-label">Question</label>
          <textarea
            id="question"
            className="input-field question-textarea"
            placeholder="Enter your question here...."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          ></textarea>
          <div className="rich-text-placeholder">
            <input type="checkbox" id="fontBIU" className="hidden" readOnly checked />
            <label htmlFor="fontBIU" className="rich-text-checkbox-label">
              <span className="rich-text-checkbox-icon-wrapper">
                <svg className="rich-text-checkbox-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                </svg>
              </span>
              font BIU (Placeholder for rich text options)
            </label>
          </div>
        </div>

        {questionType !== 'descriptive' && (
          <div className="options-section">
            <label className="form-label">Options</label>
            {options.map((option, index) => (
              <div key={index} className="option-item">
                <input
                  type={questionType === 'single' ? 'radio' : 'checkbox'}
                  name="correctOption"
                  checked={option.isCorrect}
                  onChange={() => handleCorrectChange(index)}
                  style={{accentColor: '#CBE220', borderRadius: '0.125rem', width: '1.1rem', height: '1.1rem', flexShrink: 0}}
                />
                <input
                  type="text"
                  className="input-field"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
            <button onClick={addOption} className="btn-secondary add-option-button">Add option</button>
          </div>
        )}

        <div className="question-modal-buttons">
          <button onClick={handleSubmitQuestion} className="btn-primary">
            {questionToEdit ? 'Save Changes' : 'Save & add another'}
          </button>
          <button onClick={handleSubmitQuestion} className="btn-primary">Save</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
