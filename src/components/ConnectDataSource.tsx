import React, { useState } from 'react'

export default function ConnectDataSource() {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    id: '',
    name: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    notes: '',
    additionalInfo: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleConnect = async () => {
    const res = await fetch(`/api/workspaces/bh-user/data-sources/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'mysql', // 👈 Change to 'psql', 'snowflake' etc. based on dropdown
        data: form
      })
    })

    if (res.ok) {
      alert('✅ Connected successfully!')
      setShowModal(false)
    } else {
      alert('❌ Connection failed')
    }
  }

  return (
    <>
      <button onClick={() => setShowModal(true)} style={{
        padding: '10px 16px',
        backgroundColor: '#6EE7B7',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '10px'
      }}>
        ➕ Add Data Source
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Datasource</h3>
            <input name="id" placeholder="ID" onChange={handleChange} />
            <input name="name" placeholder="Name" onChange={handleChange} />
            <input name="host" placeholder="Host" onChange={handleChange} />
            <input name="port" placeholder="Port" onChange={handleChange} />
            <input name="database" placeholder="Database" onChange={handleChange} />
            <input name="username" placeholder="Username" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} />
            <input name="notes" placeholder="Notes" onChange={handleChange} />
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleConnect}>✅ Connect</button>{' '}
              <button onClick={() => setShowModal(false)}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
