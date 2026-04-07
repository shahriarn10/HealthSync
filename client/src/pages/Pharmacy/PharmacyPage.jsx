import { useEffect, useState } from "react";
import { getPharmacyData, addMedicine, deleteMedicine, createPharmacyOrder, getPharmacyOrders, updatePharmacyOrderStatus } from "../../api";
import { Pill, PackagePlus, DollarSign, Package, Trash2, ShoppingCart, Plus, Minus, ImagePlus, ShieldCheck, Globe, Users, Award, X, CheckCircle } from "lucide-react";

export default function PharmacyPage() {
    const [meds, setMeds] = useState([]);
    const [orders, setOrders] = useState([]);
    
    // Auth & Layout States
    const user = JSON.parse(localStorage.getItem("user"));
    const isPharmacist = user?.role === "pharmacist" || user?.role === "admin";
    const [activeTab, setActiveTab] = useState("inventory"); // inventory | orders (for pharmacist)
    
    // User Cart States
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem(`cart_${user?._id}`);
        return saved ? JSON.parse(saved) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editModal, setEditModal] = useState({ show: false, medicine: null });
    
    useEffect(() => {
        if (user) {
            localStorage.setItem(`cart_${user._id}`, JSON.stringify(cart));
        }
    }, [cart, user]);
    
    // Checkout States
    const [checkoutForm, setCheckoutForm] = useState({ paymentMethod: "bKash", senderNumber: "", transactionId: "" });
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    // Add/Edit Medicine State
    const [form, setForm] = useState({ name: "", image: "", quantity: "", price: "" });

    const loadMeds = async () => {
        try {
            const res = await getPharmacyData(user.token); setMeds(res.data);
        } catch(e) { console.error(e) }
    };
    
    const loadOrders = async () => {
        if(!isPharmacist) return;
        try {
            const res = await getPharmacyOrders(user.token); setOrders(res.data);
        } catch(e) { console.error(e) }
    };

    useEffect(() => { loadMeds(); loadOrders(); }, []);

    // -------- Pharmacist Actions --------
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setForm({ ...form, image: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addMedicine(user.token, form);
            setForm({ name: "", image: "", quantity: "", price: "" });
            loadMeds();
        } catch (e) { alert("Failed to add medicine") }
    };

    const handleDelete = async (id) => {
        await deleteMedicine(user.token, id);
        loadMeds();
    };

    const handleApproveOrder = async (orderId) => {
        try {
            await updatePharmacyOrderStatus(user.token, orderId, "Approved");
            loadOrders();
        } catch (e) { alert("Failed to approve order") }
    };
    
    const handleDeliverOrder = async (orderId) => {
        try {
            await updatePharmacyOrderStatus(user.token, orderId, "Delivered");
            loadOrders();
        } catch (e) { alert("Failed to mark as delivered") }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setEditModal({ ...editModal, medicine: { ...editModal.medicine, image: reader.result } });
            reader.readAsDataURL(file);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await import("../../api.js").then(api => api.updateMedicine(user.token, editModal.medicine._id, editModal.medicine));
            setEditModal({ show: false, medicine: null });
            loadMeds();
        } catch (e) { alert("Failed to update medicine"); }
    };

    // -------- Customer Actions --------
    const addToCart = (med) => {
        setCart(prev => {
            const exists = prev.find(item => item.medicineId === med._id);
            if (exists) {
                return prev.map(item => item.medicineId === med._id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { medicineId: med._id, name: med.name, price: med.price, quantity: 1, image: med.image }];
        });
        setIsCartOpen(true);
    };

    const updateCartQuantity = (id, newQuantity) => {
        if (newQuantity < 1) {
            setCart(prev => prev.filter(item => item.medicineId !== id));
            return;
        }
        setCart(prev => prev.map(item => item.medicineId === id ? { ...item, quantity: newQuantity } : item));
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckout = async (e) => {
        e.preventDefault();
        try {
            await createPharmacyOrder(user.token, {
                items: cart,
                totalPrice: cartTotal,
                ...checkoutForm
            });
            setCart([]);
            setCheckoutForm({ paymentMethod: "bKash", senderNumber: "", transactionId: "" });
            setIsCheckingOut(false);
            setOrderSuccess(true);
            setTimeout(() => setOrderSuccess(false), 3000);
            loadMeds(); // stock might have changed
        } catch (err) {
            alert("Checkout failed");
        }
    };


    return (
        <div className="w-full relative animate-in fade-in duration-500 pb-20">
            
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden mb-12 bg-emerald-900 text-white shadow-2xl">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="relative p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-r from-emerald-900 via-emerald-800/90 to-transparent">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 rounded-full text-sm font-medium mb-6">
                            <ShieldCheck size={16} /> Rank 1 pharmacy in the city
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-tight">Professional Pharmacy Services You Can Trust</h1>
                        <p className="text-emerald-100/80 text-lg mb-8 max-w-xl line-clamp-3">
                            Providing expert pharmacal care and personalized service to our community. We believe in building lasting relationships with our patients, offering not just medications, but comprehensive health support.
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
                            <div><div className="flex items-center gap-2 text-xl font-bold text-white"><Award size={24} className="text-emerald-400"/> 26+</div><div className="text-sm text-emerald-200">Years of excellence</div></div>
                            <div><div className="flex items-center gap-2 text-xl font-bold text-white"><Pill size={24} className="text-emerald-400"/> 5k+</div><div className="text-sm text-emerald-200">Type of medicine</div></div>
                            <div><div className="flex items-center gap-2 text-xl font-bold text-white"><Globe size={24} className="text-emerald-400"/> 600+</div><div className="text-sm text-emerald-200">Global brands</div></div>
                            <div><div className="flex items-center gap-2 text-xl font-bold text-white"><Users size={24} className="text-emerald-400"/> 1M</div><div className="text-sm text-emerald-200">Happy customers</div></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Role Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-slate-200 pb-4 gap-4">
                <div className="flex-1 w-full flex flex-col md:flex-row items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Trending products for you!</h2>
                        <p className="text-slate-500">Explore our reliable catalog</p>
                    </div>
                    <div className="relative w-full max-w-sm group">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search medicines..."
                            className="w-full pl-4 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm outline-none focus:border-emerald-500 transition-all font-medium text-slate-600"
                        />
                    </div>
                </div>
                
                {isPharmacist ? (
                    <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                        <button onClick={()=>setActiveTab("inventory")} className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'inventory' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}>Inventory</button>
                        <button onClick={()=>setActiveTab("orders")} className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'orders' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}>
                            Pending Orders {orders.filter(o => o.status === 'Pending').length > 0 && <span className="ml-2 bg-rose-500 text-white px-2 py-0.5 rounded-full text-xs">{orders.filter(o => o.status === 'Pending').length}</span>}
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-transform active:scale-95 shadow-lg shadow-emerald-200 relative">
                        <ShoppingCart size={20} />
                        View Cart
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                                {cart.length}
                            </span>
                        )}
                    </button>
                )}
            </div>

            {/* Pharmacist Add Form (Visible only if isPharmacist & activeTab === inventory) */}
            {isPharmacist && activeTab === "inventory" && (
                <div className="glass-card p-6 mb-8 border border-emerald-100 bg-emerald-50/50">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <PackagePlus size={20} className="text-emerald-600" /> Administrative Controls: Add Medicine
                    </h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Image Upload (Auto Base64)</label>
                            <label className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-50 text-sm overflow-hidden text-slate-500">
                                <ImagePlus size={18} className="text-emerald-500 flex-shrink-0" />
                                <span className="truncate">{form.image ? "Image Selected" : "Choose file"}</span>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
                            </label>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Medicine Name</label>
                            <input name="name" placeholder="E.g. Paracetamol" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Stock Quantity</label>
                            <input type="number" name="quantity" placeholder="100" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="input-field" required />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Price (৳)</label>
                            <input type="number" step="0.01" name="price" placeholder="15.50" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" required />
                        </div>
                        <div className="md:col-span-1">
                            <button type="submit" className="w-full btn-primary bg-emerald-600 hover:bg-emerald-700 h-11">Add Item</button>
                        </div>
                    </form>
                </div>
            )}

            {/* List / Orders Content */}
            {activeTab === "inventory" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {meds.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())).map(m => (
                        <div key={m._id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col group">
                            {/* Image Wrapper */}
                            <div className="w-full aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden mb-4 relative flex items-center justify-center p-4">
                                {isPharmacist && (
                                    <div className="absolute top-2 right-2 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditModal({ show: true, medicine: m })} className="bg-white text-sky-500 p-2 rounded-full shadow-md hover:bg-sky-50 hover:scale-110 transition-transform">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                        </button>
                                        <button onClick={() => handleDelete(m._id)} className="bg-white text-rose-500 p-2 rounded-full shadow-md hover:bg-rose-50 hover:scale-110 transition-transform">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                                {m.image ? (
                                    <img src={m.image} alt={m.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <Pill size={48} className="text-slate-300" />
                                )}
                                <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-0.5 rounded-full text-xs font-medium text-slate-600 border border-slate-100 shadow-sm">
                                    ★ 4.9 <span className="text-slate-400 font-normal">| 1k+ Sold</span>
                                </div>
                            </div>
                            
                            <h4 className="text-lg font-bold text-slate-800 line-clamp-1">{m.name}</h4>
                            <p className="text-slate-400 text-xs mt-1 mb-4 flex items-center gap-1.5"><Package size={14}/> {m.quantity} Unit(s) left</p>
                            
                            <div className="mt-auto flex items-end justify-between">
                                <div>
                                    <span className="text-xs text-slate-400 block line-through">৳ {(m.price * 1.2).toFixed(2)}</span>
                                    <span className="text-xl font-black text-emerald-600">৳{m.price.toFixed(2)}</span>
                                </div>
                                {!isPharmacist && (
                                    <button onClick={() => addToCart(m)} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
                                        Cart <Plus size={16}/>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.length === 0 ? <p className="text-slate-500 text-center py-10">No standard orders found.</p> : orders.map(order => (
                        <div key={order._id} className="glass-card p-6 flex flex-col md:flex-row justify-between gap-6 border-l-4 border-l-emerald-500">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : order.status === 'Approved' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        Order Status: {order.status}
                                    </span>
                                    <span className="text-slate-400 text-sm">ID: {order._id.substring(18)}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-800 mb-1">Customer: {order.user.name} ({order.user.email})</p>
                                <p className="text-sm font-semibold text-slate-600">Total: ৳{order.totalPrice.toFixed(2)}</p>
                                
                                <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Items Purchased</p>
                                    <ul className="text-sm text-slate-700 space-y-1">
                                        {order.items.map(item => (
                                            <li key={item._id} className="flex justify-between">
                                                <span>{item.quantity}x {item.name}</span>
                                                <span>৳{(item.price * item.quantity).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="w-full md:w-72 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex flex-col justify-center">
                                <p className="text-xs font-bold text-emerald-800 mb-3 uppercase tracking-wide">Payment Verification</p>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Method:</span> <span className="font-semibold text-slate-800">{order.paymentMethod}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">Sender No:</span> <span className="font-mono bg-white px-1.5 rounded">{order.senderNumber}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-slate-500">TrxID:</span> <span className="font-mono bg-white px-1.5 rounded text-xs">{order.transactionId}</span></div>
                                </div>
                                
                                <div className="flex gap-2 mt-auto">
                                    {order.status === 'Pending' && (
                                        <button onClick={() => handleApproveOrder(order._id)} className="flex-1 bg-emerald-600 text-white text-sm py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">Approve Payment</button>
                                    )}
                                    {order.status === 'Approved' && (
                                        <button onClick={() => handleDeliverOrder(order._id)} className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Mark Delivered</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Shopping Cart Drawer / Modal for Users */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => !isCheckingOut && setIsCartOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white z-10 sticky top-0">
                            <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingCart className="text-emerald-500"/> Your Cart</h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><X size={20}/></button>
                        </div>
                        
                        {orderSuccess ? (
                            <div className="flex flex-col items-center justify-center p-10 h-full text-center">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Order Placed!</h3>
                                <p className="text-slate-500 mb-8">Thank you! Your order is waiting for pharmacist approval.</p>
                                <button onClick={() => setIsCartOpen(false)} className="btn-primary bg-slate-800 w-full hover:bg-slate-900">Close</button>
                            </div>
                        ) : cart.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                                <ShoppingCart size={48} className="text-slate-200 mb-4"/>
                                <p>Your cart is empty.</p>
                                <button onClick={() => setIsCartOpen(false)} className="text-emerald-500 font-medium mt-4 hover:underline">Continue Shopping</button>
                            </div>
                        ) : isCheckingOut ? (
                            <div className="flex-1 overflow-y-auto p-5 pb-32">
                                <div className="bg-slate-50 p-4 rounded-xl mb-6 text-sm border border-slate-200">
                                    <p className="font-semibold text-slate-700 mb-2">Order Summary</p>
                                    <div className="flex justify-between font-bold text-lg"><span className="text-emerald-600">Total to Pay:</span> <span>৳{cartTotal.toFixed(2)}</span></div>
                                </div>
                                
                                <h3 className="font-bold text-lg mb-4 text-slate-800">Checkout Payment Details</h3>
                                <form onSubmit={handleCheckout} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Select Payment Method</label>
                                        <div className="flex gap-4">
                                            <label className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-colors flex items-center justify-center font-bold ${checkoutForm.paymentMethod === 'bKash' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                                                <input type="radio" value="bKash" checked={checkoutForm.paymentMethod === 'bKash'} onChange={(e) => setCheckoutForm({...checkoutForm, paymentMethod: e.target.value})} className="hidden" />
                                                bKash
                                            </label>
                                            <label className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-colors flex items-center justify-center font-bold ${checkoutForm.paymentMethod === 'Nagad' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                                                <input type="radio" value="Nagad" checked={checkoutForm.paymentMethod === 'Nagad'} onChange={(e) => setCheckoutForm({...checkoutForm, paymentMethod: e.target.value})} className="hidden" />
                                                Nagad
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Sender Mobile Number</label>
                                        <input type="text" placeholder="e.g. 017XXXXXXX" required className="input-field bg-white" value={checkoutForm.senderNumber} onChange={(e) => setCheckoutForm({...checkoutForm, senderNumber: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Transaction ID (TrxID)</label>
                                        <input type="text" placeholder="e.g. 9JXX2A5R" required className="input-field bg-white font-mono uppercase" value={checkoutForm.transactionId} onChange={(e) => setCheckoutForm({...checkoutForm, transactionId: e.target.value.toUpperCase()})} />
                                    </div>
                                    <button type="submit" className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 mt-6 h-12 text-lg">
                                        Confirm & Pay ৳{cartTotal.toFixed(2)}
                                    </button>
                                    <button type="button" onClick={() => setIsCheckingOut(false)} className="w-full text-slate-500 font-medium py-3 hover:text-slate-800 text-sm mt-2">
                                        Back to Cart
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                    {cart.map(item => (
                                        <div key={item.medicineId} className="flex gap-4 p-3 bg-white rounded-xl border border-slate-100 shadow-sm relative">
                                            <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden border border-slate-100 flex-shrink-0">
                                                {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <Pill size={24} className="text-slate-300" />}
                                            </div>
                                            <div className="flex-1 min-w-0 pr-8">
                                                <h4 className="font-bold text-slate-800 truncate text-sm">{item.name}</h4>
                                                <p className="text-emerald-600 font-bold">৳{item.price.toFixed(2)}</p>
                                                
                                                <div className="flex items-center gap-3 mt-2 h-8">
                                                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white h-full">
                                                        <button onClick={() => updateCartQuantity(item.medicineId, item.quantity - 1)} className="px-2.5 h-full hover:bg-slate-100 text-slate-600 transition-colors"><Minus size={14}/></button>
                                                        <input type="number" min="0" value={item.quantity} onChange={(e) => updateCartQuantity(item.medicineId, parseInt(e.target.value) || 0)} className="w-12 text-center text-sm font-semibold border-x border-slate-200 h-full focus:outline-none" />
                                                        <button onClick={() => updateCartQuantity(item.medicineId, item.quantity + 1)} className="px-2.5 h-full hover:bg-slate-100 text-slate-600 transition-colors"><Plus size={14}/></button>
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={() => updateCartQuantity(item.medicineId, 0)} className="absolute top-3 right-3 text-slate-400 hover:text-rose-500"><X size={16}/></button>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-5 border-t border-slate-100 bg-slate-50 mt-auto">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-slate-500 font-medium">Subtotal</span>
                                        <span className="text-2xl font-black text-slate-800">৳{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <button onClick={() => setIsCheckingOut(true)} className="btn-primary w-full bg-slate-800 hover:bg-slate-900 shadow-lg shadow-slate-300 h-12 text-lg">
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModal.show && editModal.medicine && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditModal({ show: false, medicine: null })}></div>
                    <div className="relative bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl">
                        <button onClick={() => setEditModal({ show: false, medicine: null })} className="absolute top-6 right-6 text-slate-400 hover:bg-slate-100 p-1.5 rounded-full"><X size={20}/></button>
                        <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-6 flex items-center gap-2">Edit Medicine</h3>
                        
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Image Update (Auto Base64)</label>
                                <label className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 text-sm overflow-hidden text-slate-500">
                                    <ImagePlus size={18} className="text-emerald-500 flex-shrink-0" />
                                    <span className="truncate">Change Image</span>
                                    <input type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
                                </label>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Medicine Name</label>
                                <input value={editModal.medicine.name} onChange={(e) => setEditModal({...editModal, medicine: {...editModal.medicine, name: e.target.value}})} className="input-field" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Stock Quantity</label>
                                    <input type="number" value={editModal.medicine.quantity} onChange={(e) => setEditModal({...editModal, medicine: {...editModal.medicine, quantity: e.target.value}})} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Price (৳)</label>
                                    <input type="number" step="0.01" value={editModal.medicine.price} onChange={(e) => setEditModal({...editModal, medicine: {...editModal.medicine, price: e.target.value}})} className="input-field" required />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setEditModal({ show: false, medicine: null })} className="flex-1 btn bg-slate-100 text-slate-600 font-bold py-3 hover:bg-slate-200 rounded-xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl transition-all h-auto">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
