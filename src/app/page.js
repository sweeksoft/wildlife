'use client'
import { useState, useEffect } from "react";
import questions from './mcqs.json';

const QuizComponent = () => {
  // State for selected answers
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [startIndex, setStartIndex] = useState(0); // Starting index for pagination
  const [endIndex, setEndIndex] = useState(10); // Ending index for pagination
  const [questionsPerPage, setQuestionsPerPage] = useState(10); // Number of questions per page

  // Handle change in selected answer
  const handleAnswerChange = (index, selectedAnswer) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[index] = selectedAnswer;
    setSelectedAnswers(newSelectedAnswers);
  };

  // Handle the search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase()); // Convert to lowercase for case-insensitive search
  };

  // Filter the questions based on the search query
  const filteredQuestions = questions.filter((question) =>
    question.question_title.toLowerCase().includes(searchQuery)
  );

  // Calculate total pages based on the filtered questions and questionsPerPage
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  // Slice the filtered questions to implement pagination
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

  // Handle pagination changes (ensures valid range)
  const handlePaginationChange = (newStartIndex, newEndIndex) => {
    if (newStartIndex >= 0 && newEndIndex <= filteredQuestions.length) {
      setStartIndex(newStartIndex);
      setEndIndex(newEndIndex);
    }
  };

  // Function to go to the next page
  const goToNextPage = () => {
    if (endIndex < filteredQuestions.length) {
      const newStartIndex = endIndex;
      const newEndIndex = Math.min(newStartIndex + questionsPerPage, filteredQuestions.length);
      handlePaginationChange(newStartIndex, newEndIndex);
    }

    setSelectedAnswers(Array(questions.length).fill(null));
  };

  // Function to go to the previous page
  const goToPreviousPage = () => {
    if (startIndex > 0) {
      const newEndIndex = startIndex;
      const newStartIndex = Math.max(newEndIndex - questionsPerPage, 0);
      handlePaginationChange(newStartIndex, newEndIndex);
    }

    setSelectedAnswers(Array(questions.length).fill(null));
  };

  // Ensure the pagination state is valid when filteredQuestions changes
  useEffect(() => {
    // Reset pagination to the first page if filteredQuestions is empty or shrinks
    if (filteredQuestions.length === 0) {
      setStartIndex(0);
      setEndIndex(10);
    } else if (startIndex >= filteredQuestions.length) {
      const newEndIndex = Math.min(filteredQuestions.length, questionsPerPage);
      setStartIndex(filteredQuestions.length - questionsPerPage);
      setEndIndex(newEndIndex);
    }
  }, [filteredQuestions, startIndex, questionsPerPage]);

  return (
    <div className="quiz-container">
      <h1 style={{marginBottom: "10px"}}>Wildlife Quiz</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by question title"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <div>
          <label>
            Start Index:
            <input
              type="number"
              value={startIndex}
              onChange={(e) => setStartIndex(Math.max(0, parseInt(e.target.value) || 0))}
              className="pagination-input"
            />
          </label>
          <label>
            End Index:
            <input
              type="number"
              value={endIndex}
              onChange={(e) => setEndIndex(Math.min(filteredQuestions.length, parseInt(e.target.value) || 10))}
              className="pagination-input"
            />
          </label>
        </div>
        {/* <button onClick={() => handlePaginationChange(startIndex, endIndex)} className="apply-button">
          Apply Range
        </button> */}
        <span style={{ margin: "auto", paddingTop: "10px"}}>
          Page {Math.floor(startIndex / questionsPerPage) + 1} of {totalPages}{" "}
          {filteredQuestions.length > 0 ? `(${filteredQuestions.length} questions)` : ""}
        </span>
      </div>

      {/* Render filtered and paginated questions */}
      {paginatedQuestions.map((question, index) => {
        const selectedAnswer = selectedAnswers[index];
        const correctAnswer = question.answer;

        return (
          <div key={index} className="question">
            {/* Display question number before title */}
            <h6 className="question-title">
              {startIndex + index}. {question.question_title}
            </h6>
            <div className="options">
              {question.options.map((option, key) => {
                const isCorrect = option.id === correctAnswer;
                const isSelected = selectedAnswer === option.id;

                let optionColor = ""; // Default color (no color applied initially)

                // If the user has selected an answer
                if (selectedAnswer !== null) {
                  if (isSelected && !isCorrect) {
                    optionColor = "red"; // Incorrect answer selected
                  } else if (isSelected && isCorrect) {
                    optionColor = "green"; // Correct answer selected
                  } else if (!isSelected && isCorrect) {
                    optionColor = "green"; // Correct answer but not selected
                  }
                }

                return (
                  <label key={key} className="option-label">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option.id}
                      checked={isSelected}
                      onChange={() => handleAnswerChange(index, option.id)}
                      className="option-input"
                    />
                    <span className="option-title" style={{ color: optionColor }}>
                      {option.title}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Pagination Controls: Next and Previous Buttons */}
      <div className="pagination-buttons">
        <button onClick={goToPreviousPage} disabled={startIndex === 0} className="pagination-button">
          Previous
        </button>
        <button onClick={goToNextPage} disabled={endIndex >= filteredQuestions.length} className="pagination-button">
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizComponent;
