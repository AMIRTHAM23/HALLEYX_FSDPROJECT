function FilterBar({ filter, setFilter, statusFilter, setStatusFilter, startDate, setStartDate, endDate, setEndDate }) {

    return (

        <div className="flex flex-wrap gap-3 mb-4 items-center">
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Show data for:</label>
                <select
                    value={filter || "all"}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border px-3 py-1 rounded"
                >
                    <option value="all">All time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="quarter">Last 90 Days</option>
                </select>
            </div>
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Status:</label>
                <select
                    value={statusFilter || "all"}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border px-3 py-1 rounded"
                >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <label className="text-sm font-medium">From:</label>
                <input
                    type="date"
                    value={startDate || ""}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border px-3 py-1 rounded"
                />

                <label className="text-sm font-medium">To:</label>
                <input
                    type="date"
                    value={endDate || ""}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border px-3 py-1 rounded"
                />
            </div>

        </div>

    )

}

export default FilterBar
