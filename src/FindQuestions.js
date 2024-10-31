import React, { useState, useEffect } from 'react';
import { db } from './Firebase'; // Firebase Firestore
import './FindQuestions.css';

function FindQuestions() {
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState({ title: '', tag: '', date: '' });
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  // Fetch questions from Firestore
  useEffect(() => {
    const fetchQuestions = async () => {
      const snapshot = await db.collection('posts').get();
      const questionData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(questionData);
    };

    fetchQuestions();
  }, []);

  // Handle filtering based on title, tag, and date
  const filteredQuestions = questions.filter((question) => {
    const matchesTitle = filter.title
      ? question.title.toLowerCase().includes(filter.title.toLowerCase())
      : true;
    const matchesTag = filter.tag
      ? question.tags.toLowerCase().includes(filter.tag.toLowerCase())
      : true;
    const matchesDate = filter.date ? question.timestamp.toDate().toLocaleDateString() === filter.date : true;

    return matchesTitle && matchesTag && matchesDate;
  });

  // Handle question deletion
  const handleDelete = async (id) => {
    await db.collection('posts').doc(id).delete();
    setQuestions(questions.filter((q) => q.id !== id)); // Update the list after deletion
  };

  // Toggle expanded question details
  const toggleExpand = (id) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  return (
    <div className="find-questions">
      <h1>Find Questions</h1>

      {/* Filtering options */}
      <div className="filters">
        <input
          type="text"
          placeholder="Filter by title"
          value={filter.title}
          onChange={(e) => setFilter({ ...filter, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by tag"
          value={filter.tag}
          onChange={(e) => setFilter({ ...filter, tag: e.target.value })}
        />
        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />
      </div>

      {/* Questions list */}
      <div className="questions-list">
        {filteredQuestions.map((question) => (
          <div key={question.id} className="question-card">
            <h2>{question.title}</h2>
            <p>{question.description}</p>
            <div className="question-meta">
              <span>{new Date(question.timestamp.seconds * 1000).toLocaleDateString()}</span>
              <span>{question.tags}</span>
            </div>
            <button onClick={() => handleDelete(question.id)}>Delete</button>
            <button onClick={() => toggleExpand(question.id)}>
              {expandedQuestionId === question.id ? 'Collapse' : 'Expand'}
            </button>

            {/* Expanded question details */}
            {expandedQuestionId === question.id && (
              <div className="expanded-details">
                <p>{question.abstract}</p>
                {question.imageUrl && <img src={question.imageUrl} alt="Question related" />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FindQuestions;
