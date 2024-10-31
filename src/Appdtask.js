import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { db, storage } from './Firebase';
import './App.css';
import FindQuestions from './FindQuestions';
import PricingPlan from './PricingPlan';
import { Controlled as CodeMirror } from 'react-codemirror2';
import ReactMarkdown from 'react-markdown';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

function App() {
  const [postType, setPostType] = useState('question');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [abstract, setAbstract] = useState('');
  const [image, setImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  // Handle Post Type Change
  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Submit form and upload data to Firestore and Firebase Storage
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsPosting(true);

    try {
      let imageUrl = '';
      if (image) {
        const imageRef = storage.ref(`images/${image.name}`);
        await imageRef.put(image);
        imageUrl = await imageRef.getDownloadURL();
      }

      await db.collection('posts').add({
        postType,
        title,
        description,
        tags,
        abstract,
        imageUrl,
        timestamp: new Date(),
      });

      setIsPosting(false);
      setTitle('');
      setDescription('');
      setTags('');
      setAbstract('');
      setImage(null);

      alert('Post submitted successfully!');
    } catch (error) {
      console.error('Error posting:', error);
      setIsPosting(false);
      alert(`Failed to submit the post. Error: ${error.message}`);
    }
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Create Post</Link></li>
            <li><Link to="/find">Find Questions</Link></li>
            <li><Link to="/plans">Plans</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={
            <>
              <h1>Create a New Post</h1>
              <form onSubmit={handleSubmit}>
                <div className="post-type">
                  <label>Select Post Type: </label>
                  <div className="post-type-options">
                    <input
                      type="radio"
                      value="question"
                      checked={postType === 'question'}
                      onChange={handlePostTypeChange}
                    />
                    <label>Question</label>

                    <input
                      type="radio"
                      value="article"
                      checked={postType === 'article'}
                      onChange={handlePostTypeChange}
                    />
                    <label>Article</label>
                  </div>
                </div>

                {postType === 'question' ? (
                  <>
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        placeholder="Start your question with how, what, why, etc."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        placeholder="Describe your problem"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        placeholder="Enter a descriptive title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Abstract</label>
                      <textarea
                        placeholder="Enter a 1-paragraph abstract"
                        value={abstract}
                        onChange={(e) => setAbstract(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Article Text</label>
                      <CodeMirror
                        value={description}
                        options={{
                          mode: 'javascript',
                          theme: 'default',
                          lineNumbers: true
                        }}
                        onBeforeChange={(editor, data, value) => {
                          setDescription(value);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label>Upload Image</label>
                      <input type="file" onChange={handleImageChange} />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Tags</label>
                  <input
                    type="text"
                    placeholder="Please add up to 3 tags to describe what your post is about"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" disabled={isPosting}>
                  {isPosting ? 'Posting...' : 'Post'}
                </button>
              </form>

              <h2>Preview:</h2>
              <ReactMarkdown>{description}</ReactMarkdown>
            </>
          } />

          <Route path="/find" element={<FindQuestions />} />
          <Route path="/plans" element={<PricingPlan />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
