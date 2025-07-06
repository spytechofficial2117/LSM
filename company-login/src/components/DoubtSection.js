import React, { useState } from 'react';
import './DoubtSection.css'; // Optional for styling

const DoubtSection = ({ className, doubts, onSubmitQuestion, onSubmitReply }) => {
  const [questionText, setQuestionText] = useState('');
  const [replyBoxes, setReplyBoxes] = useState({});

  const handleQuestionSubmit = () => {
    if (questionText.trim()) {
      onSubmitQuestion(className, questionText);
      setQuestionText('');
    }
  };

  const handleReplySubmit = (questionId, replyText) => {
    if ((replyText || '').trim()) {
      onSubmitReply(className, questionId, replyText);
      setReplyBoxes(prev => ({ ...prev, [questionId]: '' }));
    }
  };

  return (
    <div className="doubt-section">
      <h3>Ask a question about "{className}"</h3>

      <div className="comment-input">
        <textarea
          placeholder="Type your question..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
        <button onClick={handleQuestionSubmit}>Post</button>
      </div>

      <div className="comment-thread-list">
        {(doubts[className] || []).map((thread) => (
          <div key={thread.id} className="comment-thread">
            <div className="question">
              <strong>{thread.user}</strong>: {thread.text}
            </div>
            <div className="replies">
              {thread.replies.map((reply, idx) => (
                <div key={idx} className="reply">
                  <em>{reply.user}</em>: {reply.text}
                </div>
              ))}
            </div>
            <div className="reply-box">
              <textarea
                type="text"
                placeholder="Write a reply..."
                value={replyBoxes[thread.id] || ''}
                onChange={(e) =>
                  setReplyBoxes((prev) => ({ ...prev, [thread.id]: e.target.value }))
                }
                   onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); // Prevent newline
                    handleReplySubmit(thread.id, replyBoxes[thread.id]);
                  }
                }}

              />
              <button onClick={() => handleReplySubmit(thread.id, replyBoxes[thread.id])}>
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoubtSection;