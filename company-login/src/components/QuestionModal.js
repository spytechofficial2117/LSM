import React, { useState, useEffect } from 'react';
import './QuestionModal.css'; // Import the dedicated CSS file

const QuestionModal = ({ addQuestion, updateQuestion, closeModal, questionToEdit, setAlertConfig }) => {
    const [questionText, setQuestionText] = useState(questionToEdit?.question || '');
    const [questionType, setQuestionType] = useState(questionToEdit?.type || 'single');
    const [options, setOptions] = useState(questionToEdit?.options || [{ text: '', isCorrect: false }]);
    const [score, setScore] = useState(questionToEdit?.score || 2);

    //new state for test cases in coding qns
    const [testCases, setTestCases] = useState([]);
    const [problemTitle, setProblemTitle] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState('');

    //new state for coding question hints
    const [hints, setHints] = useState(['', '', '', '', '']);

    const getDescriptiveQuestionType = (type) => {
        switch (type) {
            case 'single': return 'Single Choice (Radio Button)';
            case 'multiple': return 'Multiple Choice (Checkboxes)';
            case 'descriptive': return 'Descriptive Answer (Text Area)';
            case 'coding': return 'Coding Question';
            default: return 'Unknown Type';
        }
    };

    useEffect(() => {
        if (questionToEdit) {
            setQuestionText(questionToEdit.question);
            setQuestionType(questionToEdit.type);
            setScore(questionToEdit.score);
            if (questionToEdit.type === 'coding') {
                setTestCases(questionToEdit.testCases || [{ input: '', output: '', isHidden: false }]);
                setOptions([]); // Clear options if it's a coding question
                setProblemTitle(questionToEdit.problemTitle || '');
                setDifficultyLevel(questionToEdit.difficultyLevel || '');
                setHints(questionToEdit.hints || ['', '', '', '', '']);
            } else {
                setOptions(questionToEdit.options || [{ text: '', isCorrect: false }]);
                setTestCases([]); // Clear test cases if it's not a coding question
                setProblemTitle('');
                setDifficultyLevel('');

                // NEW: Reset hints if not a coding question
                setHints(['', '', '', '', '']);
            }
        }
        else {
            // Reset states for a brand new question (when questionToEdit is null)
            setQuestionText('');
            setQuestionType('single');
            setOptions([{ text: '', isCorrect: false }]);
            setScore(2);
            setTestCases([]);
            setProblemTitle('');
            setDifficultyLevel('');
            setHints(['', '', '', '', '']);
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

    const removeOption = (indexToRemove) => {
        setOptions(options.filter((_, index) => index !== indexToRemove));
    };
    // NEW: Test Case Handlers
    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...testCases];
        newTestCases[index][field] = value;
        setTestCases(newTestCases);
    };

  const addTestCase = () => {
        // NEW: Limit for test cases
        if (testCases.length >= 10) {
            setAlertConfig({
                message: 'Maximum 10 test cases allowed.',
                type: 'alert',
                onConfirm: () => setAlertConfig(null)
            });
            return;
        }
        setTestCases([...testCases, { input: '', output: '', isHidden: false }]);
    };

    const removeTestCase = (indexToRemove) => {
        setTestCases(testCases.filter((_, index) => index !== indexToRemove));
    };

      // NEW: Handler for Hints
    const handleHintChange = (index, value) => {
        const newHints = [...hints];
        newHints[index] = value;
        setHints(newHints);
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

        // NEW: Score validation - re-added from previous suggestions
        if (score <= 0) {
            setAlertConfig({
                message: 'Score must be a positive number.',
                type: 'alert',
                onConfirm: () => setAlertConfig(null)
            });
            return;
        }

        if (questionType !== 'descriptive' && questionType !== 'coding') {
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
        // NEW: Validation for coding questions
        if (questionType === 'coding') {
            // NEW: Problem Title validation
            if (!problemTitle.trim()) {
                setAlertConfig({
                    message: 'Coding questions must have a problem title.',
                    type: 'alert',
                    onConfirm: () => setAlertConfig(null)
                });
                return;
            }
            // NEW: Difficulty Level validation (optional, but good if it's mandatory)
            if (!difficultyLevel) { // Checks for empty string
                setAlertConfig({
                    message: 'Please select a difficulty level for the coding question.',
                    type: 'alert',
                    onConfirm: () => setAlertConfig(null)
                });
                return;
            }


            const validTestCases = testCases.filter(tc => tc.input.trim() !== '' || tc.output.trim() !== '');
            if (validTestCases.length === 0) {
                setAlertConfig({
                    message: 'Coding questions must have at least one test case with input or output.',
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
            options: questionType === 'descriptive' || questionType === 'coding' ? [] : options,
            testCases: questionType === 'coding' ? testCases : [],
        };

        if (questionType === 'coding') {
            newQuestion.problemTitle = problemTitle;
            newQuestion.difficultyLevel = difficultyLevel;
            newQuestion.hints = hints.filter(hint => hint.trim() !== '');
        }

        if (questionToEdit) {
            updateQuestion(newQuestion);
        } else {
            addQuestion(newQuestion);
        }
        closeModal();
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
                                const newType = e.target.value; // Capture the new value
                                setQuestionType(newType);
                                if (newType === 'single') {
                                    setOptions([{ text: '', isCorrect: true }]);
                                    setTestCases([]);
                                    setProblemTitle('');
                                    setDifficultyLevel('');
                                    setHints(['', '', '', '', '']);
                                } else if (newType === 'multiple') {
                                    setOptions([{ text: '', isCorrect: false }]);
                                    setTestCases([]);
                                    setProblemTitle('');
                                    setDifficultyLevel('');
                                    setHints(['', '', '', '', '']);
                                } else if (newType === 'descriptive') {
                                    setOptions([]);
                                    setTestCases([]);
                                    setProblemTitle('');
                                    setDifficultyLevel('');
                                    setHints(['', '', '', '', '']);
                                }
                                else if (newType === 'coding') {
                                    setOptions([]);
                                    setTestCases([{ input: '', output: '', isHidden: false }]);
                                    setProblemTitle('');
                                    setDifficultyLevel('');
                                    setHints(['', '', '', '', '']);
                                }
                            }}
                        >
                            <option value="single">{getDescriptiveQuestionType('single')}</option>
                            <option value="multiple">{getDescriptiveQuestionType('multiple')}</option>
                            <option value="descriptive">{getDescriptiveQuestionType('descriptive')}</option>
                            <option value="coding">{getDescriptiveQuestionType('coding')}</option>
                        </select>
                        <span className="select-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        min="1" // Added min attribute for better UX/validation
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

                {/* MODIFIED: Conditional Rendering for Options or Test Cases */}
                {questionType === 'coding' ? (
                    <div className="coding-problem-details-section">
                        {/* NEW: Problem Title Input */}
                        <div>
                            <label htmlFor="problemTitle" className="form-label">Problem Title</label>
                            <input
                                type="text"
                                id="problemTitle"
                                className="input-field"
                                placeholder="Enter problem title (e.g., 'Two Sum')"
                                value={problemTitle}
                                onChange={(e) => setProblemTitle(e.target.value)}
                            />
                        </div>

                        {/* NEW: Difficulty Level Select */}
                        <div>
                            <label htmlFor="difficultyLevel" className="form-label">Difficulty Level</label>
                            <div className="select-wrapper"> {/* Reusing select-wrapper for consistent styling */}
                                <select
                                    id="difficultyLevel"
                                    className="input-field"
                                    value={difficultyLevel}
                                    onChange={(e) => setDifficultyLevel(e.target.value)}
                                >
                                    {/* NEW: Added disabled placeholder option */}
                                    <option value="" disabled>Select Difficulty</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                                <span className="select-arrow">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* NEW: Hints Section */}
                        <div className="hints-section">
                            <label className="form-label">Hints (Max 5):</label>
                            {hints.map((hint, index) => (
                                <div key={index} className="hint-item">
                                    <span className="hint-bullet">•</span> {/* Visual bullet point */}
                                    <textarea
                                        className="input-field hint-textarea"
                                        placeholder={`Hint ${index + 1}`}
                                        value={hint}
                                        onChange={(e) => handleHintChange(index, e.target.value)}
                                        rows="1" // Start with 1 row, expand as needed
                                    ></textarea>
                                </div>
                            ))}
                        </div>
                        
                        {/* NEW: Section for Coding Question Test Cases */}
                        <div className="test-cases-section">
                            <label className="form-label">Test Cases:</label>
                            {testCases.map((tc, index) => (
                                <div key={index} className={`test-case-item ${tc.isHidden ? 'test-case-item--hidden' : 'test-case-item--shown'}`}>
                                    <label className="form-label small">Test Case {index + 1} Input:</label>
                                    <textarea
                                        className="input-field mb-2"
                                        placeholder="Enter input for test case (e.g., function arguments)"
                                        value={tc.input}
                                        onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                        rows="2"
                                    ></textarea>
                                    <label className="form-label small">Test Case {index + 1} Expected Output:</label>
                                    <textarea
                                        className="input-field mb-2"
                                        placeholder="Enter expected output for test case"
                                        value={tc.output}
                                        onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                                        rows="2"
                                    ></textarea>
                                    <div className="checkbox-group">
                                        <input
                                            type="checkbox"
                                            id={`isHidden-${index}`}
                                            className="accent-CBE220 rounded-sm"
                                            checked={tc.isHidden}
                                            onChange={(e) => handleTestCaseChange(index, 'isHidden', e.target.checked)}
                                        />
                                        <label htmlFor={`isHidden-${index}`} className="ml-2">Hidden Test Case</label>
                                    </div>
                                    {testCases.length > 0 && ( // Ensure there's at least one test case before allowing removal
                                        <button
                                            onClick={() => removeTestCase(index)}
                                            className="btn-danger-sm mt-2"
                                        >
                                            Remove Test Case
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button onClick={addTestCase} className="btn-secondary add-item-button">Add Test Case</button>
                        </div>
                    </div>
                ) : questionType !== 'descriptive' ? (
                    // Your existing Options section (Single/Multiple Choice)
                    <div className="options-section">
                        <label className="form-label">Options</label>
                        {options.map((option, index) => (
                            <div key={index} className="option-item">
                                <input
                                    type={questionType === 'single' ? 'radio' : 'checkbox'}
                                    name="correctOption"
                                    checked={option.isCorrect}
                                    onChange={() => handleCorrectChange(index)}
                                    style={{ accentColor: '#CBE220', borderRadius: '0.125rem', width: '1.1rem', height: '1.1rem', flexShrink: 0 }}
                                />
                                <input
                                    type="text"
                                    className="input-field"
                                    value={option.text}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                />
                                {options.length > 1 && ( // Only show remove if there's more than one option
                                    <button
                                        onClick={() => removeOption(index)}
                                        className="btn-danger-sm ml-2" // Adjust margin as needed
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button onClick={addOption} className="btn-secondary add-option-button">Add option</button>
                    </div>
                ) : (
                    <p className="text-gray-600 text-sm mt-4">Descriptive questions do not require predefined options or test cases.</p>
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