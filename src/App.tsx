
import React, { useEffect, useState } from 'react'
import { useData } from './Store/Zustand'
import CircularProgress from '@mui/material/CircularProgress'
import { useForm } from 'react-hook-form'

function App() {
  const data = useData((state) => state.data)
  const loading = useData((state) => state.loading)
  const error = useData((state) => state.error)
  const getUsers = useData((state) => state.getUsers)
  const addUser = useData((state) => state.addUser)
  const editUser = useData((state) => state.editUser)

  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [search, setSearch] = useState('')

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    getUsers()
  }, [getUsers])

  const handleAdd = async (formData) => {
    await addUser({
      ...formData,
      age: Number(formData.age)
    })
    reset()
    setOpen(false)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    reset({
      name: user.name,
      age: user.age
    })
    setOpen(true)
  }

  const handleSaveEdit = async (formData) => {
    await editUser(selectedUser.id, {
      ...formData,
      age: Number(formData.age)
    })
    reset()
    setSelectedUser(null)
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedUser(null)
    reset()
  }

  const filteredData = data.filter((elem) =>
    elem.name?.toLowerCase().includes(search.toLowerCase())
  )

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#f4f6fb',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
      color: '#1e293b'
    },
    container: {
      maxWidth: '1100px',
      margin: '0 auto'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px',
      marginBottom: '30px'
    },
    title: {
      fontSize: '32px',
      color: '#172554',
      margin: '0 0 8px'
    },
    subtitle: {
      color: '#64748b',
      margin: 0
    },
    actions: {
      display: 'flex',
      gap: '12px',
      marginBottom: '30px',
      flexWrap: 'wrap'
    },
    search: {
      flex: 1,
      minWidth: '200px',
      padding: '14px 16px',
      border: '1px solid #dbe2ee',
      borderRadius: '12px',
      outline: 'none',
      fontSize: '15px',
      background: 'white'
    },
    addButton: {
      padding: '14px 22px',
      border: 'none',
      borderRadius: '12px',
      background: '#4f46e5',
      color: 'white',
      fontSize: '15px',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    list: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '22px'
    },
    card: {
      background: 'white',
      padding: '25px',
      borderRadius: '18px',
      textAlign: 'center',
      border: '1px solid #e8edf5',
      boxShadow: '0 5px 20px rgba(23, 37, 84, 0.06)'
    },
    avatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover',
      background: '#eef2ff',
      border: '4px solid #eef2ff',
      marginBottom: '15px'
    },
    name: {
      fontSize: '21px',
      margin: '5px 0 15px',
      overflowWrap: 'anywhere'
    },
    age: {
      display: 'inline-block',
      background: '#eef2ff',
      color: '#4f46e5',
      padding: '8px 16px',
      borderRadius: '20px',
      marginBottom: '18px'
    },
    editButton: {
      width: '100%',
      padding: '12px',
      background: '#4f46e5',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    dialog: {
      width: 'min(400px, calc(100% - 40px))',
      padding: '30px',
      border: 'none',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    formInput: {
      padding: '13px',
      border: '1px solid #dbe2ee',
      borderRadius: '10px',
      fontSize: '15px',
      outline: 'none'
    },
    saveButton: {
      padding: '13px',
      border: 'none',
      borderRadius: '10px',
      background: '#4f46e5',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    closeButton: {
      padding: '13px',
      border: 'none',
      borderRadius: '10px',
      background: '#e2e8f0',
      color: '#334155',
      cursor: 'pointer'
    },
    empty: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      padding: '40px',
      background: 'white',
      borderRadius: '16px',
      color: '#64748b'
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <CircularProgress />
      </div>
    )
  }

  if (error) return <h1>{error}</h1>

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>User Dashboard</h1>
            <p style={styles.subtitle}>Manage your users in one place</p>
          </div>
        </div>

        <div style={styles.actions}>
          <input
            style={styles.search}
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            style={styles.addButton}
            onClick={() => {
              reset({ name: '', age: '' })
              setSelectedUser(null)
              setOpen(true)
            }}
          >
            + Add User
          </button>
        </div>

        <dialog style={styles.dialog} open={open}>
          <h2 style={{ marginTop: 0, marginBottom: '22px', color: '#172554' }}>
            {selectedUser ? 'Edit User' : 'Add New User'}
          </h2>

          <form
            style={styles.form}
            onSubmit={handleSubmit(
              selectedUser ? handleSaveEdit : handleAdd
            )}
          >
            <input
              style={styles.formInput}
              placeholder="Enter name"
              {...register('name', { required: true })}
            />

            <input
              style={styles.formInput}
              placeholder="Enter age"
              type="number"
              {...register('age', {
                required: true,
                valueAsNumber: true
              })}
            />

            <button style={styles.saveButton} type="submit">
              {selectedUser ? 'Save Changes' : 'Add User'}
            </button>

            <button
              style={styles.closeButton}
              type="button"
              onClick={handleClose}
            >
              Cancel
            </button>
          </form>
        </dialog>

        <div style={styles.list}>
          {filteredData.length > 0 ? (
            filteredData.map((elem) => (
              <div style={styles.card} key={elem.id}>
                <img
                  style={styles.avatar}
                  src={elem.avatar}
                  alt={elem.name}
                />

                <h2 style={styles.name}>{elem.name}</h2>

                <p style={styles.age}>{elem.age} years old</p>

                <button
                  style={styles.editButton}
                  onClick={() => handleEdit(elem)}
                >
                  ✏️ Edit User
                </button>
              </div>
            ))
          ) : (
            <div style={styles.empty}>
              <h2>No users found</h2>
              <p>Try another name or add a new user.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
