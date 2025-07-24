import React, { useState } from 'react';

const ApiServiceActions = ({ queue, agents, fetchQueue, fetchAgents }) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [results, setResults] = useState({});
  const [isExpanded, setIsExpanded] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleApiCall = async (id, method, endpoint, body = null) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : null,
      });
      const data = await response.json();
      setResults((prev) => ({ ...prev, [id]: JSON.stringify(data, null, 2) }));
      await fetchQueue();
      await fetchAgents();
    } catch (error) {
      setResults((prev) => ({ ...prev, [id]: 'שגיאה: ' + error.message }));
    }
  };

  const registerRandomClient = () => {
    const name = 'לקוח-' + Math.floor(Math.random() * 1000);
    const phone = '050' + Math.floor(1000000 + Math.random() * 8999999);
    return handleApiCall(1, 'POST', `/queue`, { name, phone });
  };

  const registerRandomAgent = async () => {
    const name = 'סוכן-' + Math.floor(Math.random() * 1000);
    const department = 'תמיכה';
    await handleApiCall('agent-register', 'POST', `/agents`, { name, department });
  };

  return (
    <div className="api-actions">
      <button className="btn" onClick={() => setIsExpanded((prev) => !prev)}>
        {isExpanded ? 'צמצם שירותים' : 'הצג שירותים'}
      </button>

      {isExpanded && (
        <>
          {/* 1 */}
          <div className="api-action-block">
            <div className="api-action-row">
              <span>1. לקוחות יכולים להרשם לתור - POST /queue</span>
              <button className="btn" onClick={registerRandomClient}>השתמש בשירות</button>
            </div>
            {results[1] && <pre className="api-result">{results[1]}</pre>}
          </div>

          {/* 2 */}
          <div className="api-action-block">
            <div className="api-action-row">
              <span>2. שליפת הלקוח הבא בתור - GET /next/queue</span>
              <button className="btn" onClick={() => handleApiCall(2, 'GET', `/queue/next/queue`)}>השתמש בשירות</button>
            </div>
            {results[2] && <pre className="api-result">{results[2]}</pre>}
          </div>

          {/* 3 */}
          <div className="api-action-block">
            <div className="api-action-row">
              <span>3. דחיית לקוח לסוף התור - POST /queue/defer/:id</span>
            </div>
            <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}>
              <option value="">בחר לקוח</option>
              {queue.map((q) => (
                <option key={q._id} value={q._id}>{q.name}</option>
              ))}
            </select>
            <button
              className="btn"
              disabled={!selectedClientId}
              onClick={() => handleApiCall(3, 'POST', `/queue/defer/${selectedClientId}`)}
            >
              דחה לקוח
            </button>
            {results[3] && <pre className="api-result">{results[3]}</pre>}
          </div>

          {/* 4 */}
          <div className="api-action-block">
            <div className="api-action-row">
              <span>4. שיוך לקוח לסוכן - POST /queue/agentId/:agentId/assign/id/:id</span>
            </div>
            <button className="btn" onClick={registerRandomAgent}>+ צור סוכן</button>
            <div>
              <select value={selectedAgentId} onChange={(e) => setSelectedAgentId(e.target.value)}>
                <option value="">בחר סוכן</option>
                {agents.map((a) => (
                  <option key={a._id} value={a._id}>{a.name}</option>
                ))}
              </select>

              <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}>
                <option value="">בחר לקוח</option>
                {queue.map((q) => (
                  <option key={q._id} value={q._id}>{q.name}</option>
                ))}
              </select>

              <button
                className="btn"
                disabled={!selectedAgentId || !selectedClientId}
                onClick={() =>
                  handleApiCall(
                    4,
                    'POST',
                    `/queue/agentId/${selectedAgentId}/assign/id/${selectedClientId}`
                  )
                }
              >
                שייך לקוח
              </button>
            </div>
            {results[4] && <pre className="api-result">{results[4]}</pre>}
          </div>

          {/* 5 */}
          <div className="api-action-block">
            <div className="api-action-row">
              <span>5. שליפת תור לפי סטטוס - GET /pending=status?queue</span>
            </div>
            <select
              onChange={(e) => {
                const status = e.target.value;
                if (!status) return;
                handleApiCall(5, 'GET', `/queue/by-status?status=${status}`);
              }}
            >
              <option value="">בחר סטטוס</option>
              <option value="pending">ממתין</option>
              <option value="assigned">משוייך</option>
              <option value="done">בוצע</option>
            </select>
            {results[5] && <pre className="api-result">{results[5]}</pre>}
          </div>

          {/* 6 */}
          <div className="api-action-block">
            <div className="api-action-row">
              <span>6. שיוך מחדש לסוכן – POST /queue/:id/assign/:agentId</span>
            </div>
            <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}>
              <option value="">בחר לקוח</option>
              {queue.map((q) => (
                <option key={q._id} value={q._id}>{q.name}</option>
              ))}
            </select>
            <select value={selectedAgentId} onChange={(e) => setSelectedAgentId(e.target.value)}>
              <option value="">בחר סוכן</option>
              {agents.map((a) => (
                <option key={a._id} value={a._id}>{a.name}</option>
              ))}
            </select>
            <button
              className="btn"
              disabled={!selectedClientId || !selectedAgentId}
              onClick={() =>
                handleApiCall(
                  6,
                  'POST',
                  `/queue/${selectedClientId}/assign/${selectedAgentId}`
                )
              }
            >
              שיוך מחדש
            </button>
            {results[6] && <pre className="api-result">{results[6]}</pre>}
          </div>
        </>
      )}
    </div>
  );
};

export default ApiServiceActions;
