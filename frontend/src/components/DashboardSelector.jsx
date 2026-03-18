import React, { useState, useEffect } from 'react'
import API from '../services/api'

const DashboardSelector = ({ currentDashboard, onDashboardChange, onCreateDashboard }) => {
    const [dashboards, setDashboards] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [newDashboardName, setNewDashboardName] = useState('')
    const [newDashboardDescription, setNewDashboardDescription] = useState('')

    useEffect(() => {
        loadDashboards()
    }, [])

    const loadDashboards = async (nextSelectId) => {
        try {
            const response = await API.get('/dashboard')
            if (response.data.success) {
                const list = response.data.dashboards || []
                setDashboards(list)
                if (nextSelectId) {
                    const next = list.find(d => d._id === nextSelectId)
                    if (next) {
                        onDashboardChange(next)
                        return
                    }
                }
                if (!currentDashboard && list.length > 0) {
                    onDashboardChange(list[0])
                } else if (currentDashboard && !list.find(d => d._id === currentDashboard._id) && list.length > 0) {
                    onDashboardChange(list[0])
                }
            }
        } catch (error) {
            console.error('Error loading dashboards:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateDashboard = async (e) => {
        e.preventDefault()
        if (!newDashboardName.trim()) return

        try {
            const response = await API.post('/dashboard', {
                name: newDashboardName.trim(),
                description: newDashboardDescription.trim(),
                widgets: []
            })

            if (response.data.success) {
                const newDashboard = response.data.dashboard
                setDashboards(prev => [newDashboard, ...prev])
                setNewDashboardName('')
                setNewDashboardDescription('')
                setShowCreateForm(false)
                onCreateDashboard(newDashboard)
            }
        } catch (error) {
            console.error('Error creating dashboard:', error)
        }
    }

    const handleDeleteDashboard = async () => {
        if (!currentDashboard?._id) return
        const confirmDelete = window.confirm("Delete this dashboard?")
        if (!confirmDelete) return

        try {
            await API.delete(`/dashboard/${currentDashboard._id}`)
            await loadDashboards()
        } catch (error) {
            console.error('Error deleting dashboard:', error)
        }
    }

    if (loading) {
        return <div className="text-sm text-gray-600">Loading dashboards...</div>
    }

    const adminDashboards = dashboards.filter(d => d.owner?.role === "admin")
    const userDashboards = dashboards.filter(d => d.owner?.role !== "admin")

    const formatLabel = (dashboard) => {
        const roleLabel = dashboard.owner?.role === "admin" ? "Admin" : "User"
        return `${roleLabel}: ${dashboard.name}`
    }

    return (
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Dashboard:</label>
                <select
                    value={currentDashboard?._id || ''}
                    onChange={(e) => {
                        const selected = dashboards.find(d => d._id === e.target.value)
                        onDashboardChange(selected)
                    }}
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                    {adminDashboards.length > 0 && (
                        <optgroup label="Admin Dashboards">
                            {adminDashboards.map(dashboard => (
                                <option key={dashboard._id} value={dashboard._id}>
                                    {formatLabel(dashboard)}
                                </option>
                            ))}
                        </optgroup>
                    )}
                    {userDashboards.length > 0 && (
                        <optgroup label="User Dashboards">
                            {userDashboards.map(dashboard => (
                                <option key={dashboard._id} value={dashboard._id}>
                                    {formatLabel(dashboard)}
                                </option>
                            ))}
                        </optgroup>
                    )}
                </select>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-amber-600 text-white text-sm px-3 py-1 rounded hover:bg-amber-700"
                >
                    + New Dashboard
                </button>
                <button
                    onClick={handleDeleteDashboard}
                    className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
                    disabled={!currentDashboard?._id}
                >
                    Delete
                </button>
            </div>

            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Create New Dashboard</h3>
                        <form onSubmit={handleCreateDashboard}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={newDashboardName}
                                    onChange={(e) => setNewDashboardName(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="Dashboard name"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={newDashboardDescription}
                                    onChange={(e) => setNewDashboardDescription(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="Dashboard description (optional)"
                                    rows="3"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateForm(false)
                                        setNewDashboardName('')
                                        setNewDashboardDescription('')
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DashboardSelector
