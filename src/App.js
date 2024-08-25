import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css'; // Import the CSS file

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(false); // New state for loading

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting API call
    try {
      const parsedJson = JSON.parse(jsonInput);
      const response = await axios.post('http://localhost:5555/bfhl', parsedJson);
      setResponseData(response.data);
    } catch (error) {
      alert('Invalid JSON or API Error');
    } finally {
      setLoading(false); // Set loading to false once API call is finished
    }
  };

  const handleSelectChange = (options) => {
    setSelectedOptions(options);
  };

  const renderResponse = () => {
    if (!responseData) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = responseData;
    const selectedValues = selectedOptions.map(option => option.value);

    return (
      <div className="response-container">
        {selectedValues.includes('Alphabets') && (
          <div className="response-section">
            <h3 className="header">Alphabets</h3>
            <p className="paragraph">{alphabets.join(', ')}</p>
          </div>
        )}
        {selectedValues.includes('Numbers') && (
          <div className="response-section">
            <h3 className="header">Numbers</h3>
            <p className="paragraph">{numbers.join(', ')}</p>
          </div>
        )}
        {selectedValues.includes('Highest Lowercase Alphabet') && (
          <div className="response-section">
            <h3 className="header">Highest Lowercase Alphabet</h3>
            <p className="paragraph">{highest_lowercase_alphabet.join(', ')}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app-container">
      <h1 className="title">JSON Processor</h1>
      <form onSubmit={handleFormSubmit} className="form">
        <textarea
          value={jsonInput}
          onChange={handleInputChange}
          placeholder='Enter JSON here'
          rows='6'
          cols='50'
          className="textarea"
        />
        <button
          type="submit"
          className={`button ${loading ? 'button-loading' : ''}`} // Conditional class based on loading state
          disabled={loading} // Disable button when loading
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {responseData && (
        <Select
          isMulti
          options={[
            { value: 'Alphabets', label: 'Alphabets' },
            { value: 'Numbers', label: 'Numbers' },
            { value: 'Highest Lowercase Alphabet', label: 'Highest Lowercase Alphabet' }
          ]}
          onChange={handleSelectChange}
          className="select"
          styles={customSelectStyles}
        />
      )}
      {renderResponse()}
    </div>
  );
}

const customSelectStyles = {
  container: (provided) => ({
    ...provided,
    width: '100%',
    maxWidth: '600px',
  }),
  control: (provided) => ({
    ...provided,
    marginTop: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderColor: '#ccc',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '5px',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#fff',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#fff',
    ':hover': {
      backgroundColor: '#0056b3',
      color: '#fff',
    },
  }),
};

export default App;
