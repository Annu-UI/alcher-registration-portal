import { useState } from "react";
import axios from "axios";

const Filter = () => {
  const [module, setModule] = useState("");
  const [filter1, setFilter1] = useState("");
  const [filter2, setFilter2] = useState("");
  const [filter3, setFilter3] = useState("");
  const [competitions, setCompetitions] = useState([]);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleFilter = async () => {
    try {
      const params = {};
      if (module) params.module = module;
      if (filter1) params.filter1 = filter1;
      if (filter2) params.filter2 = filter2;
      if (filter3) params.filter3 = filter3;

      const res = await axios.get(`${backendUrl}/show-all-competitions/`, {
        params,
      });

      setCompetitions(res.data.allcomp);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Filter Competitions</h2>

      <div>
        <label>Module:</label>
        <input
          type="text"
          value={module}
          onChange={(e) => setModule(e.target.value)}
          placeholder="Enter module query name"
        />
      </div>

      <div>
        <label>Filter1 (members):</label>
        <select value={filter1} onChange={(e) => setFilter1(e.target.value)}>
          <option value="">All</option>
          <option value="0">More than 1 member</option>
          <option value="1">Single member only</option>
        </select>
      </div>

      <div>
        <label>Filter2 (online):</label>
        <select value={filter2} onChange={(e) => setFilter2(e.target.value)}>
          <option value="">All</option>
          <option value="1">Online</option>
          <option value="0">Offline</option>
        </select>
      </div>

      <div>
        <label>Filter3 (event name search):</label>
        <input
          type="text"
          value={filter3}
          onChange={(e) => setFilter3(e.target.value)}
          placeholder="Search by event name"
        />
      </div>

      <button onClick={handleFilter}>Apply Filter</button>

      <h3>Competitions</h3>
      <ul>
        {competitions.map((comp) => (
          <li key={comp.id}>{comp.event_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Filter;
