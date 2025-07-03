import React, { useState, useEffect } from 'react';
import QuestionModal from '../components/QuestionModal';
import CustomAlertDialog from '../components/CustomAlertDialog';
import './CreateTestPage.css'; // Import the dedicated CSS file

const CreateTestPage = () => {
  const [testName, setTestName] = useState('');
  const [timeLimitHrs, setTimeLimitHrs] = useState('');
  const [timeLimitMin, setTimeLimitMin] = useState('');
  const [scheduleFrom, setScheduleFrom] = useState('');
  const [scheduleTo, setScheduleTo] = useState('');
  const [minGrade, setMinGrade] = useState('60');
  const [passGradeEnabled, setPassGradeEnabled] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [presets, setPresets] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [alertConfig, setAlertConfig] = useState(null);

  const getDescriptiveQuestionType = (type) => {
    switch (type) {
      case 'single':
        return 'Single Choice (Radio Button)';
      case 'multiple':
        return 'Multiple Choice (Checkboxes)';
      case 'descriptive':
        return 'Descriptive Answer (Text Area)';
      case 'coding':
        return 'Coding Question';
      default:
        return 'Unknown Type';
    }
  };

  useEffect(() => {
    const loadTest = () => {
      if (!selectedTestId) {
        setQuestions([]);
        return;
      }

      const testData = tests.find(test => test.id === selectedTestId);
      if (testData) {
        setTestName(testData.name || '');
        setTimeLimitHrs(testData.timeLimitHrs || '');
        setTimeLimitMin(testData.timeLimitMin || '');
        setScheduleFrom(testData.scheduleFrom || '');
        setScheduleTo(testData.scheduleTo || '');
        setMinGrade(testData.minGrade || '60');
        setPassGradeEnabled(testData.passGradeEnabled || false);
        setQuestions(testData.questions || []);
      } else {
        setAlertConfig({
          message: 'Test not found.',
          type: 'alert',
          onConfirm: () => setAlertConfig(null)
        });
        resetForm();
      }
    };
    loadTest();
  }, [selectedTestId, tests]);


  const resetForm = () => {
    setTestName('');
    setTimeLimitHrs('');
    setTimeLimitMin('');
    setScheduleFrom('');
    setScheduleTo('');
    setMinGrade('60');
    setPassGradeEnabled(false);
    setQuestions([]);
    setSelectedTestId('');
    setSelectedQuestion(null);
    setSelectedPresetId('');
  };

  const handleCreateTestSubmit = () => {
    const newTest = {
      id: selectedTestId || `test-${Date.now()}`,
      name: testName,
      timeLimitHrs: timeLimitHrs,
      timeLimitMin: timeLimitMin,
      scheduleFrom: scheduleFrom,
      scheduleTo: scheduleTo,
      minGrade: minGrade,
      passGradeEnabled: passGradeEnabled,
      createdAt: Date.now(),
      questions: questions,
    };

    if (selectedTestId) {
      setTests(tests.map(test => test.id === selectedTestId ? newTest : test));
      setAlertConfig({
        message: 'Test updated successfully!',
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
    } else {
      setTests([...tests, newTest]);
      setSelectedTestId(newTest.id);
      setAlertConfig({
        message: 'Test configured successfully!',
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
    }
  };

  const handleScheduleTest = () => {
    if (!selectedTestId || !testName || !scheduleFrom || !scheduleTo) {
      setAlertConfig({
        message: 'Please select a test, provide a test name, and set both schedule dates to schedule.',
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
      return;
    }

    const message = `Test "${testName}" (ID: ${selectedTestId}) scheduled from ${scheduleFrom} to ${scheduleTo}.`;
    setAlertConfig({
      message: message,
      type: 'alert',
      onConfirm: () => setAlertConfig(null)
    });
  };

  const addQuestion = (newQuestion) => {
    if (!selectedTestId) {
      setAlertConfig({ message: "Please save the test first before adding questions.", type: "alert", onConfirm: () => setAlertConfig(null) });
      return;
    }
    const updatedQuestions = [...questions, { ...newQuestion, id: `q-${Date.now()}` }];
    setQuestions(updatedQuestions);
    setTests(tests.map(test =>
      test.id === selectedTestId ? { ...test, questions: updatedQuestions } : test
    ));
    setShowQuestionModal(false);
  };

  const updateQuestion = (updatedQuestion) => {
    if (!selectedTestId || !updatedQuestion.id) {
      setAlertConfig({ message: "Cannot update question. Test or question ID missing.", type: "alert", onConfirm: () => setAlertConfig(null) });
      return;
    }
    const updatedQuestions = questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q);
    setQuestions(updatedQuestions);
    setTests(tests.map(test =>
      test.id === selectedTestId ? { ...test, questions: updatedQuestions } : test
    ));
    setShowQuestionModal(false);
    setSelectedQuestion(null);
  };

  const handleDeleteQuestion = (questionId) => {
    setAlertConfig({
      message: "Are you sure you want to delete this question?",
      type: 'confirm',
      onConfirm: () => {
        setAlertConfig(null);
        if (!selectedTestId || !questionId) {
          setAlertConfig({ message: "Cannot delete question. Test or question ID missing.", type: "alert", onConfirm: () => setAlertConfig(null) });
          return;
        }
        const updatedQuestions = questions.filter(q => q.id !== questionId);
        setQuestions(updatedQuestions);
        setTests(tests.map(test =>
          test.id === selectedTestId ? { ...test, questions: updatedQuestions } : test
        ));
      },
      onCancel: () => setAlertConfig(null)
    });
  };

  const handleDeleteTest = (testId) => {
    setAlertConfig({
      message: "Are you sure you want to delete this test and all its questions?",
      type: 'confirm',
      onConfirm: () => {
        setAlertConfig(null);
        setTests(tests.filter(test => test.id !== testId));
        resetForm();
      },
      onCancel: () => setAlertConfig(null)
    });
  };

  const openEditQuestionModal = (question) => {
    setSelectedQuestion(question);
    setShowQuestionModal(true);
  };

  const handleSavePreset = () => {
    if (!testName.trim()) {
      setAlertConfig({
        message: 'Please enter a Test Name to save as a preset.',
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
      return;
    }

    const newPreset = {
      id: `preset-${Date.now()}`,
      name: testName + ' Preset',
      testName: testName,
      timeLimitHrs: timeLimitHrs,
      timeLimitMin: timeLimitMin,
      scheduleFrom: scheduleFrom,
      scheduleTo: scheduleTo,
      minGrade: minGrade,
      passGradeEnabled: passGradeEnabled,
    };
    setPresets([...presets, newPreset]);
    setAlertConfig({
      message: `Preset "${newPreset.name}" saved successfully!`,
      type: 'alert',
      onConfirm: () => setAlertConfig(null)
    });
  };

  const handleLoadPreset = (presetId) => {
    const presetData = presets.find(preset => preset.id === presetId);
    if (presetData) {
      setTestName(presetData.testName || '');
      setTimeLimitHrs(presetData.timeLimitHrs || '');
      setTimeLimitMin(presetData.timeLimitMin || '');
      setScheduleFrom(presetData.scheduleFrom || '');
      setScheduleTo(presetData.scheduleTo || '');
      setMinGrade(presetData.minGrade || '60');
      setPassGradeEnabled(presetData.passGradeEnabled || false);
      setAlertConfig({
        message: `Preset "${presetData.name}" loaded.`,
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
    } else {
      setAlertConfig({
        message: 'Preset not found.',
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
    }
  };

  return (
    <div className="create-test-page">
      <div className="create-test-container">
        <h2 className="create-test-title">Configure your test</h2>

        <div className="config-card">
          <div className="config-row">
            <label htmlFor="selectPreset" className="form-label">Load Preset:</label>
            <div className="select-wrapper config-item">
              <select
                id="selectPreset"
                className="input-field"
                value={selectedPresetId}
                onChange={(e) => {
                  setSelectedPresetId(e.target.value);
                  if (e.target.value) {
                    handleLoadPreset(e.target.value);
                  }
                }}
              >
                <option value="">-- Select a Preset --</option>
                {presets.map(preset => (
                  <option key={preset.id} value={preset.id}>{preset.name}</option>
                ))}
              </select>
              <span className="select-arrow">
                <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
            <button onClick={handleSavePreset} className="btn-secondary px-4 py-2">Save as Preset</button>
          </div>

          <div className="config-row">
            <label htmlFor="selectTest" className="form-label">Load Existing Test:</label>
            <div className="select-wrapper config-item">
              <select
                id="selectTest"
                className="input-field"
                value={selectedTestId}
                onChange={(e) => setSelectedTestId(e.target.value)}
              >
                <option value="">-- Select a Test --</option>
                {tests.map(test => (
                  <option key={test.id} value={test.id}>{test.name}</option>
                ))}
              </select>
              <span className="select-arrow">
                <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
            <button onClick={resetForm} className="btn-secondary px-4 py-2">New Test</button>
          </div>

          <div>
            <label htmlFor="testName" className="form-label">Test Name:</label>
            <input
              type="text"
              id="testName"
              className="input-field"
              placeholder="Enter your test name"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="config-item md-w-1-2">
              <label htmlFor="timeLimit" className="form-label">Time Limit:</label>
              <div className="time-limit-inputs">
                <input
                  type="number"
                  id="timeLimitHrs"
                  className="input-field"
                  placeholder="Hrs"
                  value={timeLimitHrs}
                  onChange={(e) => setTimeLimitHrs(e.target.value)}
                />
                <input
                  type="number"
                  id="timeLimitMin"
                  className="input-field"
                  placeholder="MIN"
                  value={timeLimitMin}
                  onChange={(e) => setTimeLimitMin(e.target.value)}
                />
              </div>
            </div>
            <div className="config-item md-w-1-2">
                <div className="schedule-date-inputs">
                  <div>
                    <label htmlFor="scheduleFrom" className="form-label">Schedule From:</label>
                    <input
                      type="date"
                      id="scheduleFrom"
                      className="input-field"
                      value={scheduleFrom}
                      onChange={(e) => setScheduleFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="scheduleTo" className="form-label">Schedule To:</label>
                    <input
                      type="date"
                      id="scheduleTo"
                      className="input-field"
                      value={scheduleTo}
                      onChange={(e) => setScheduleTo(e.target.value)}
                    />
                  </div>
                </div>
            </div>
          </div>

          <div className="grading-section">
            <h3 className="grading-title">Grading</h3>
            <div className="grading-checkbox-wrapper">
              <input 
                type="checkbox" 
                id="passGradeEnabled" 
                className="accent-CBE220 rounded-sm"
                checked={passGradeEnabled}
                onChange={(e) => setPassGradeEnabled(e.target.checked)}
              />
              <label htmlFor="passGradeEnabled" className="form-label">Enable Pass/Fail Grading</label>
            </div>
            {passGradeEnabled && (
              <div className="grading-min-score">
                <span className="form-label">Minimum Pass Score:</span>
                <input
                  type="number"
                  id="minGrade"
                  className="input-field"
                  value={minGrade}
                  onChange={(e) => setMinGrade(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
            )}
            {!passGradeEnabled && (
              <div className="grading-disabled-message">Pass/Fail grading is disabled. Scores will be recorded without a specific pass threshold.</div>
            )}
          </div>

          <div className="test-action-buttons">
            <button onClick={handleCreateTestSubmit} className="btn-primary">
              {selectedTestId ? 'Update Test Configuration' : 'Submit Test Configuration'}
            </button>
            {selectedTestId && (
              <>
                <button onClick={handleScheduleTest} className="btn-secondary">
                  Schedule Test
                </button>
                <button onClick={() => handleDeleteTest(selectedTestId)} className="red-background ml-4">
                  Delete Test
                </button>
              </>
            )}
          </div>
        </div>

        <div className="questions-section">
          <h2 className="questions-title">Questions</h2>
          {questions.length === 0 ? (
            <p className="no-questions-message">No questions added yet. Click "Add Question" to start.</p>
          ) : (
            <div className="question-list">
              {questions.map((q) => (
                <div key={q.id} className="question-card">
                  <div className="flex-grow">
                    <p className="question-content">{q.question}</p>
                 {/* --- CHANGE 2: Conditionally render test cases for coding questions --- */}
                    {q.type === 'coding' ? (
                      <div className="coding-question-details">
                        <h4 className="text-md font-semibold mt-2 mb-1">Test Cases:</h4>
                        {q.testCases && q.testCases.length > 0 ? (
                          <ul className="test-case-list">
                            {q.testCases.map((tc, index) => (
                              <li key={index} className={`test-case-item ${tc.isHidden ? 'test-case-hidden' : 'test-case-shown'}`}>
                                <p><strong>Input:</strong> <pre>{tc.input.length > 50 ? tc.input.substring(0, 50) + '...' : tc.input}</pre></p>
                                <p><strong>Output:</strong> <pre>{tc.output.length > 50 ? tc.output.substring(0, 50) + '...' : tc.output}</pre></p>
                                <span className={`test-case-status ${tc.isHidden ? 'status-hidden' : 'status-shown'}`}>
                                  {tc.isHidden ? 'Hidden' : 'Shown'}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm">No test cases defined.</p>
                        )}
                      </div>
                    ) : (
                      // Existing options rendering for non-coding questions
                      q.options && q.options.length > 0 && q.type !== 'descriptive' && (
                        <ul className="question-options-list">
                          {q.options.map((opt, index) => (
                            <li key={index} className={opt.isCorrect ? 'question-option correct' : 'question-option'}>
                              {opt.text} {opt.isCorrect && '(Correct)'}
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                    <p className="question-meta">Score: {q.score}</p>
                    <p className="question-meta">Type: {getDescriptiveQuestionType(q.type)}</p>
                  </div>
                  <div className="question-actions">
                    <button onClick={() => openEditQuestionModal(q)} className="btn-secondary">Edit</button>
                    <button onClick={() => handleDeleteQuestion(q.id)} className="red-background">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="add-question-section">
            <button onClick={() => { setSelectedQuestion(null); setShowQuestionModal(true); }} className="btn-primary" disabled={!selectedTestId}>
              Add Question
            </button>
            {!selectedTestId && <p className="add-question-message">Save the test configuration first to add questions.</p>}
          </div>
        </div>

        {showQuestionModal && (
          <QuestionModal
            addQuestion={addQuestion}
            updateQuestion={updateQuestion}
            closeModal={() => { setShowQuestionModal(false); setSelectedQuestion(null); }}
            questionToEdit={selectedQuestion}
            setAlertConfig={setAlertConfig}
          />
        )}

        {alertConfig && (
          <CustomAlertDialog
            message={alertConfig.message}
            type={alertConfig.type}
            onConfirm={alertConfig.onConfirm}
            onCancel={alertConfig.onCancel}
          />
        )}
      </div>
    </div>
  );
};

export default CreateTestPage;  