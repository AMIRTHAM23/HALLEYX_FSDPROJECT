function TableWidget({ data }) {
    return (
        <div className="bg-white p-4 shadow rounded col-span-4">
            <h2 className="font-bold mb-3">{data.title}</h2>
            <table className="w-full">
                <thead>
                    <tr>
                        {data.columns.map(col => (
                            <th className="p-2 text-left">{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.rows.map((row, i) => (
                        <tr key={i}>
                            {data.columns.map(col => (
                                <td className="p-2">{row[col]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableWidget;