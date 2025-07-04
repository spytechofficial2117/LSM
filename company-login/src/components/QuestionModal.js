import React, { useState, useEffect } from 'react';
import './QuestionModal.css';

const QuestionModal = ({ addQuestion, updateQuestion, closeModal, questionToEdit, setAlertConfig }) => {
    const [questionText, setQuestionText] = useState(questionToEdit?.question || '');
    const [questionType, setQuestionType] = useState(questionToEdit?.type || 'single');
    const [options, setOptions] = useState(questionToEdit?.options || [{ text: '', isCorrect: false }]);
    const [score, setScore] = useState(questionToEdit?.score || 2);

    const [testCases, setTestCases] = useState(questionToEdit?.testCases || []);
    const [problemTitle, setProblemTitle] = useState(questionToEdit?.problemTitle || '');
    const [difficultyLevel, setDifficultyLevel] = useState(questionToEdit?.difficultyLevel || '');

    const [hintsEnabled, setHintsEnabled] = useState(
        questionToEdit?.type === 'coding' && questionToEdit.hints && questionToEdit.hints.length > 0
            ? true
            : false
    );
    const [hints, setHints] = useState(questionToEdit?.hints || ['', '', '', '', '']);

    const [questionImageFile, setQuestionImageFile] = useState(null); // This holds the actual file object for backend upload
    const [questionImageURL, setQuestionImageURL] = useState(questionToEdit?.imageUrl || '');

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
            setQuestionText(questionToEdit.question || '');
            setQuestionType(questionToEdit.type || 'single');
            setScore(questionToEdit.score || 2);
            setQuestionImageURL(questionToEdit.imageUrl || '');
            setQuestionImageFile(null); // Clear file input when editing

            if (questionToEdit.type === 'coding') {
                setTestCases(questionToEdit.testCases || [{ input: '', output: '', isHidden: false }]);
                setOptions([]);
                setProblemTitle(questionToEdit.problemTitle || '');
                setDifficultyLevel(questionToEdit.difficultyLevel || '');
                setHints(questionToEdit.hints || ['', '', '', '', '']);
                setHintsEnabled(questionToEdit.hints && questionToEdit.hints.length > 0 ? true : false);
            } else {
                setOptions(questionToEdit.options || [{ text: '', isCorrect: false }]);
                setTestCases([]);
                setProblemTitle('');
                setDifficultyLevel('');
                setHints(['', '', '', '', '']);
                setHintsEnabled(false);
            }
        } else {
            setQuestionText('');
            setQuestionType('single');
            setOptions([{ text: '', isCorrect: false }]);
            setScore(2);
            setTestCases([]);
            setProblemTitle('');
            setDifficultyLevel('');
            setHints(['', '', '', '', '']);
            setHintsEnabled(false);
            setQuestionImageFile(null);
            setQuestionImageURL('');
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

    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...testCases];
        newTestCases[index][field] = value;
        setTestCases(newTestCases);
    };

    const addTestCase = () => {
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

    const handleHintChange = (index, value) => {
        const newHints = [...hints];
        while (newHints.length < 5) {
            newHints.push('');
        }
        newHints[index] = value;
        setHints(newHints);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setAlertConfig({
                    message: 'Please upload an image file (e.g., JPG, PNG, GIF).',
                    type: 'alert',
                    onConfirm: () => setAlertConfig(null)
                });
                setQuestionImageFile(null);
                setQuestionImageURL('');
                return;
            }

            if (file.size > 2 * 1024 * 1024) { // Max 2MB
                 setAlertConfig({
                    message: 'Image size should not exceed 2MB.',
                    type: 'alert',
                    onConfirm: () => setAlertConfig(null)
                });
                setQuestionImageFile(null);
                setQuestionImageURL('');
                return;
            }

            setQuestionImageFile(file);
            setQuestionImageURL(URL.createObjectURL(file)); // For immediate client-side preview
        }
    };

    const removeImage = () => {
        setQuestionImageFile(null);
        setQuestionImageURL('');
        document.getElementById('questionImage').value = null;
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

        if (questionType === 'coding') {
            if (!problemTitle.trim()) {
                setAlertConfig({
                    message: 'Coding questions must have a problem title.',
                    type: 'alert',
                    onConfirm: () => setAlertConfig(null)
                });
                return;
            }
            // this is commented to make selection of difficulty level as optional
            
            // if (!difficultyLevel) {
            //     setAlertConfig({
            //         message: 'Please select a difficulty level for the coding question.',
            //         type: 'alert',
            //         onConfirm: () => setAlertConfig(null)
            //     });
            //     return;
            // }

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
            imageUrl: questionImageURL, // This stores the URL for display
        };

        if (questionType === 'coding') {
            newQuestion.problemTitle = problemTitle;
            newQuestion.difficultyLevel = difficultyLevel;
            newQuestion.testCases = testCases;
            newQuestion.hints = hintsEnabled ? hints.filter(hint => hint.trim() !== '') : [];
        } else {
            newQuestion.options = options;
        }

        // In a full-stack application, 'questionImageFile' would be sent to the backend here
        // using FormData, and the 'imageUrl' would be updated with the permanent URL from the server.
        // Example (conceptual):
        /*
        if (questionImageFile) {
            const formData = new FormData();
            formData.append('image', questionImageFile);
            // formData.append('questionData', JSON.stringify(newQuestion));
            // await fetch('/api/upload-question-with-image', { method: 'POST', body: formData })
            // .then(response => response.json())
            // .then(data => {
            //     newQuestion.imageUrl = data.uploadedImageUrl; // Update with actual server URL
            // });
        }
        */

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
                                const newType = e.target.value;
                                setQuestionType(newType);
                                // Reset fields based on new question type
                                if (newType === 'single' || newType === 'multiple') {
                                    setOptions([{ text: '', isCorrect: false }]);
                                    setTestCases([]);
                                    setProblemTitle('');
                                    setDifficultyLevel('');
                                    setHints(['', '', '', '', '']);
                                    setHintsEnabled(false);
                                } else if (newType === 'descriptive') {
                                    setOptions([]);
                                    setTestCases([]);
                                    setProblemTitle('');
                                    setDifficultyLevel('');
                                    setHints(['', '', '', '', '']);
                                    setHintsEnabled(false);
                                } else if (newType === 'coding') {
                                    setOptions([]);
                                    setTestCases([{ input: '', output: '', isHidden: false }]);
                                    setProblemTitle('');
                                    setDifficultyLevel('');
                                    setHints(['', '', '', '', '']);
                                    setHintsEnabled(false);
                                }
                                setQuestionImageFile(null);
                                setQuestionImageURL('');
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
                        min="1"
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
                    {/* Placeholder for rich text editor if implemented */}
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

                    {/* Image Upload Section */}
                    {questionType === 'coding' &&(
                    <div className="image-upload-section">
                        <label htmlFor="questionImage" className="form-label">Attach Image (Optional)</label>
                        <input
                            type="file"
                            id="questionImage"
                            className="hidden-file-input"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <button
                            type="button"
                            onClick={() => document.getElementById('questionImage').click()}
                            className="btn-secondary upload-image-button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Upload Image
                        </button>
                        {questionImageURL && (
                            <div className="image-preview mt-4">
                                <img src={questionImageURL} alt="Question Preview" className="max-w-full h-auto rounded-md shadow-md" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="btn-danger-sm mt-2"
                                >
                                    Remove Image
                                </button>
                            </div>
                        )}
                    </div>
                    )}
                </div>

                {/* Conditional Rendering for Options or Coding Question Details */}
                {questionType === 'coding' ? (
                    <div className="coding-problem-details-section">
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

                        <div>
                            <label htmlFor="difficultyLevel" className="form-label">Difficulty Level</label>
                            <div className="select-wrapper">
                                <select
                                    id="difficultyLevel"
                                    className="input-field"
                                    value={difficultyLevel}
                                    onChange={(e) => setDifficultyLevel(e.target.value)}
                                >
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

                        <div className="hints-section">
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="hintsEnabled"
                                    className="accent-CBE220 rounded-sm"
                                    checked={hintsEnabled}
                                    onChange={(e) => {
                                        setHintsEnabled(e.target.checked);
                                        if (!e.target.checked) {
                                            setHints(['', '', '', '', '']);
                                        }
                                    }}
                                />
                                <label htmlFor="hintsEnabled" className="ml-2 form-label">Enable Hints</label>
                            </div>

                            {hintsEnabled && (
                                <>
                                    <label className="form-label">Hints (Max 5):</label>
                                    {[...Array(5)].map((_, index) => (
                                        <div key={index} className="hint-item">
                                            <span className="hint-bullet">•</span>
                                            <textarea
                                                className="input-field hint-textarea"
                                                placeholder={`Hint ${index + 1}`}
                                                value={hints[index] || ''}
                                                onChange={(e) => handleHintChange(index, e.target.value)}
                                                rows="1"
                                            ></textarea>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

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
                                    {testCases.length > 0 && (
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
                                {options.length > 1 && (
                                    <button
                                        onClick={() => removeOption(index)}
                                        className="btn-danger-sm ml-2"
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
                        {questionToEdit ? 'Save Changes' : 'Save Question'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionModal;