import React, { useState } from 'react';
import axios from 'axios';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await axios.get(`http://localhost:5000/api/search?q=${query}`);
    setResults(res.data.products);
    setSuggestions(res.data.suggestions);
  };

  return (
    <div style={{ padding: '20px' }}>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search items (e.g. shoes)..." 
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Primary Results */}
      <section>
        <h2>Search Results</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {results.map(p => (
            <div key={p._id} style={{ border: '1px solid #ccc', padding: '10px' }}>
              <h4>{p.name}</h4>
              <p>${p.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <section style={{ marginTop: '40px', backgroundColor: '#f9f9f9', padding: '10px' }}>
          <h3>Frequently Bought Together / Related</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {suggestions.map(s => (
              <div key={s._id} style={{ color: 'blue' }}>
                <p>{s.name} - ${s.price}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchPage;