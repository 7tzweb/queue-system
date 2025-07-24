import React, { useEffect, useState, useCallback } from 'react';
import '../App.css';
import ApiServiceActions from './ApiServiceActions';

const API_URL = process.env.REACT_APP_API_URL;

const QueueControls = () => {
  const [queue, setQueue] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPhone, setSearchPhone] = useState('');

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/queue/all`);
      const data = await res.json();
      setQueue(data);
    } catch (err) {
      console.error('שגיאה בשליפת תור:', err);
    }
  }, []);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/agents`);
      const data = await res.json();
      setAgents(data);
    } catch (err) {
      console.error('שגיאה בשליפת סוכנים:', err);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    fetchAgents();
  }, [fetchQueue, fetchAgents]);

  const translateStatus = (status) => {
    switch (status) {
      case 'pending': return 'ממתין';
      case 'done': return 'בוצע';
      case 'cancelled': return 'בוטל';
      case 'assigned': return 'משוייך';
      default: return status;
    }
  };

  const filteredQueue = queue.filter((item) => {
    const matchesStatus = filter === 'all' || item.status === filter;
    const matchesName = item.name.includes(searchTerm);
    const matchesPhone = item.phone.includes(searchPhone);
    return matchesStatus && matchesName && matchesPhone;
  });

  return (
    <div className="queue-container">
      <h2 className="title">ניהול תור</h2>

      <ApiServiceActions
        queue={queue}
        agents={agents}
        fetchQueue={fetchQueue}
        fetchAgents={fetchAgents}
      />

      <div className="filters">
        <button className="btn" onClick={fetchQueue}>טען מחדש</button>
        <input
          type="text"
          placeholder="שם"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="טלפון"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">הכל</option>
          <option value="pending">ממתין</option>
          <option value="assigned">משוייך</option>
          <option value="done">בוצע</option>
          <option value="cancelled">בוטל</option>
        </select>
      </div>

      <table className="queue-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>טלפון</th>
            <th>סטטוס</th>
            <th>סוכן משויך</th>
          </tr>
        </thead>
        <tbody>
          {filteredQueue.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td>{translateStatus(item.status)}</td>
              <td>{item.assignedAgentId ? item.assignedAgentId.name : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QueueControls;
