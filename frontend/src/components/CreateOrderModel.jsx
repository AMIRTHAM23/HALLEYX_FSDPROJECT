import { useState, useEffect } from "react"
import API from "../services/api"

function CreateOrderModel({ close, order }) {

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "United States",
        product: "Fiber Internet 300 Mbps",
        quantity: 1,
        unitPrice: 0,
        status: "Pending",
        createdBy: "Mr. Michael Harris"
    })

    useEffect(() => {

        if (order) {
            setForm(prev => ({
                ...prev,
                firstName: order.firstName || "",
                lastName: order.lastName || "",
                email: order.email || "",
                phone: order.phone || "",
                address: order.address || "",
                city: order.city || "",
                state: order.state || "",
                postalCode: order.postalCode || "",
                country: order.country || "United States",
                product: order.product || "Fiber Internet 300 Mbps",
                quantity: order.quantity || 1,
                unitPrice: order.unitPrice || 0,
                status: order.status || "Pending",
                createdBy: order.createdBy || "Mr. Michael Harris"
            }))
        }

    }, [order])

    const [errors, setErrors] = useState({})

    const total = form.quantity * form.unitPrice

    function validateForm() {
        const newErrors = {}

        if (!form.firstName.trim()) newErrors.firstName = "Please fill the field"
        if (!form.lastName.trim()) newErrors.lastName = "Please fill the field"
        if (!form.email.trim()) newErrors.email = "Please fill the field"
        if (!form.phone.trim()) newErrors.phone = "Please fill the field"
        if (!form.address.trim()) newErrors.address = "Please fill the field"
        if (!form.city.trim()) newErrors.city = "Please fill the field"
        if (!form.state.trim()) newErrors.state = "Please fill the field"
        if (!form.postalCode.trim()) newErrors.postalCode = "Please fill the field"
        if (!form.country.trim()) newErrors.country = "Please fill the field"
        if (!form.product.trim()) newErrors.product = "Please fill the field"
        if (form.quantity < 1) newErrors.quantity = "Quantity cannot be less than 1"
        if (form.unitPrice <= 0) newErrors.unitPrice = "Please enter a valid unit price"
        if (!form.status.trim()) newErrors.status = "Please fill the field"
        if (!form.createdBy.trim()) newErrors.createdBy = "Please fill the field"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    function submit() {
        if (!validateForm()) return

        const payload = {
            ...form,
            totalAmount: total
        }

        if (order) {
            API.put(`/orders/${order._id}`, payload)
                .then(() => {
                    close()
                })
        } else {
            API.post("/orders", payload)
                .then(() => {
                    close()
                })
        }
    }

    return (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-xl font-bold mb-4">
                    {order ? "Edit Order" : "Create Order"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <input
                            placeholder="First Name"
                            className={`border p-2 rounded w-full ${errors.firstName ? 'border-red-500' : ''}`}
                            value={form.firstName}
                            onChange={e => setForm({ ...form, firstName: e.target.value })}
                        />
                        {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
                    </div>

                    <div>
                        <input
                            placeholder="Last Name"
                            className={`border p-2 rounded w-full ${errors.lastName ? 'border-red-500' : ''}`}
                            value={form.lastName}
                            onChange={e => setForm({ ...form, lastName: e.target.value })}
                        />
                        {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
                    </div>

                    <div>
                        <input
                            placeholder="Email"
                            className={`border p-2 rounded w-full ${errors.email ? 'border-red-500' : ''}`}
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                    </div>

                    <div>
                        <input
                            placeholder="Phone"
                            className={`border p-2 rounded w-full ${errors.phone ? 'border-red-500' : ''}`}
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                        {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
                    </div>

                    <div className="md:col-span-2">
                        <input
                            placeholder="Street Address"
                            className={`border p-2 rounded w-full ${errors.address ? 'border-red-500' : ''}`}
                            value={form.address}
                            onChange={e => setForm({ ...form, address: e.target.value })}
                        />
                        {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
                    </div>

                    <div>
                        <input
                            placeholder="City"
                            className={`border p-2 rounded w-full ${errors.city ? 'border-red-500' : ''}`}
                            value={form.city}
                            onChange={e => setForm({ ...form, city: e.target.value })}
                        />
                        {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
                    </div>

                    <div>
                        <input
                            placeholder="State / Province"
                            className={`border p-2 rounded w-full ${errors.state ? 'border-red-500' : ''}`}
                            value={form.state}
                            onChange={e => setForm({ ...form, state: e.target.value })}
                        />
                        {errors.state && <span className="text-red-500 text-sm">{errors.state}</span>}
                    </div>

                    <div>
                        <input
                            placeholder="Postal Code"
                            className={`border p-2 rounded w-full ${errors.postalCode ? 'border-red-500' : ''}`}
                            value={form.postalCode}
                            onChange={e => setForm({ ...form, postalCode: e.target.value })}
                        />
                        {errors.postalCode && <span className="text-red-500 text-sm">{errors.postalCode}</span>}
                    </div>

                    <div>
                        <select
                            className={`border p-2 rounded w-full ${errors.country ? 'border-red-500' : ''}`}
                            value={form.country}
                            onChange={e => setForm({ ...form, country: e.target.value })}
                        >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>Australia</option>
                            <option>Singapore</option>
                            <option>Hong Kong</option>
                        </select>
                        {errors.country && <span className="text-red-500 text-sm">{errors.country}</span>}
                    </div>

                    <div className="md:col-span-2">
                        <select
                            className={`border p-2 rounded w-full ${errors.product ? 'border-red-500' : ''}`}
                            value={form.product}
                            onChange={e => setForm({ ...form, product: e.target.value })}
                        >
                            <option>Fiber Internet 300 Mbps</option>
                            <option>5GUnlimited Mobile Plan</option>
                            <option>Fiber Internet 1 Gbps</option>
                            <option>Business Internet 500 Mbps</option>
                            <option>VoIP Corporate Package</option>
                        </select>
                        {errors.product && <span className="text-red-500 text-sm">{errors.product}</span>}
                    </div>

                    <div>
                        <input
                            type="number"
                            placeholder="Quantity"
                            className={`border p-2 rounded w-full ${errors.quantity ? 'border-red-500' : ''}`}
                            value={form.quantity}
                            min="1"
                            onChange={e => setForm({ ...form, quantity: Math.max(1, Number(e.target.value)) })}
                        />
                        {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity}</span>}
                    </div>

                    <div>
                        <div className={`flex items-center border rounded w-full ${errors.unitPrice ? 'border-red-500' : ''}`}>
                            <span className="px-3 py-2 text-gray-500 bg-gray-50 border-r">$</span>
                            <input
                                type="number"
                                placeholder="Unit Price"
                                className="flex-1 p-2 outline-none"
                                value={form.unitPrice}
                                step="0.01"
                                onChange={e => setForm({ ...form, unitPrice: Number(e.target.value) })}
                            />
                        </div>
                        {errors.unitPrice && <span className="text-red-500 text-sm">{errors.unitPrice}</span>}
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Total Amount"
                            className="border p-2 rounded w-full bg-gray-100"
                            value={`$${total.toFixed(2)}`}
                            readOnly
                        />
                    </div>

                    <div>
                        <select
                            className={`border p-2 rounded w-full ${errors.status ? 'border-red-500' : ''}`}
                            value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value })}
                        >
                            <option>Pending</option>
                            <option>In progress</option>
                            <option>Completed</option>
                        </select>
                        {errors.status && <span className="text-red-500 text-sm">{errors.status}</span>}
                    </div>

                    <div>
                        <select
                            className={`border p-2 rounded w-full ${errors.createdBy ? 'border-red-500' : ''}`}
                            value={form.createdBy}
                            onChange={e => setForm({ ...form, createdBy: e.target.value })}
                        >
                            <option>Mr. Michael Harris</option>
                            <option>Mr. Ryan Cooper</option>
                            <option>Ms. Olivia Carter</option>
                            <option>Mr. Lucas Martin</option>
                        </select>
                        {errors.createdBy && <span className="text-red-500 text-sm">{errors.createdBy}</span>}
                    </div>
                </div>

                <div className="mt-4 font-bold">
                    Total Amount: ${total.toFixed(2)}
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={close}
                        className="border px-4 py-2 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={submit}
                        className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                    >
                        {order ? "Update Order" : "Save Order"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateOrderModel
