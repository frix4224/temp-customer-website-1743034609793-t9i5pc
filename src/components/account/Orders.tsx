import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Package, Clock, MapPin, Search, Filter, ChevronDown, ChevronUp, ArrowDown, ArrowUp, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Order } from '../../lib/database.types';
import AccountLayout from './AccountLayout';

interface OrderFilters {
  status: string;
  dateRange: string;
}

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<OrderFilters>({
    status: 'all',
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    if (user) {
      fetchOrders();
    }

    return () => {
      mounted.current = false;
    };
  }, [user, sortOrder]);

  const fetchOrders = async () => {
    try {
      setError(null);
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'pending')  // Only fetch pending orders
        .order('created_at', { ascending: sortOrder === 'asc' });

      if (fetchError) {
        throw fetchError;
      }

      if (mounted.current) {
        setOrders(data || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      if (mounted.current) {
        setError('Failed to load orders. Please try again.');
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressSteps = (order: Order) => {
    const steps = [
      {
        label: 'Order Placed',
        completed: true,
        date: format(new Date(order.created_at), 'MMM d, yyyy - h:mm a')
      },
      {
        label: 'Pickup',
        completed: order.is_pickup_completed || false,
        date: format(new Date(order.pickup_date), 'MMM d, yyyy - h:mm a')
      }
    ];

    if (order.type !== 'pickup') {
      steps.push(
        {
          label: 'Processing',
          completed: order.is_facility_processing || false,
          date: order.is_facility_processing ? 'In Progress' : 'Pending'
        },
        {
          label: 'Delivery',
          completed: order.is_dropoff_completed || false,
          date: format(new Date(order.delivery_date), 'MMM d, yyyy - h:mm a')
        }
      );
    }

    return steps;
  };

  const filterOrders = (order: Order) => {
    // Search filter
    const searchMatch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const statusMatch = filters.status === 'all' || order.status === filters.status;

    // Date range filter
    let dateMatch = true;
    const orderDate = new Date(order.created_at);
    const now = new Date();
    switch (filters.dateRange) {
      case 'today':
        dateMatch = orderDate.toDateString() === now.toDateString();
        break;
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        dateMatch = orderDate >= weekAgo;
        break;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        dateMatch = orderDate >= monthAgo;
        break;
    }

    return searchMatch && statusMatch && dateMatch;
  };

  const filteredOrders = orders.filter(filterOrders);

  if (error) {
    return (
      <AccountLayout activeTab="orders">
        <div className="bg-red-50 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <motion.button
            onClick={fetchOrders}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout activeTab="orders">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
          
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow text-gray-700 hover:bg-gray-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4 mr-2" /> : <ArrowDown className="w-4 h-4 mr-2" />}
              Date
            </motion.button>

            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow text-gray-700 hover:bg-gray-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </motion.button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-gray-50 rounded-xl p-4 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600">
              {searchTerm || filters.status !== 'all' || filters.dateRange !== 'all'
                ? 'Try adjusting your filters'
                : 'When you place orders, they will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 items-start justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Order #{order.order_number}</div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {format(new Date(order.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        {order.type === 'pickup' ? 'Pickup' : 'Pickup & Delivery'}
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-2" />
                        <div>
                          <div className="text-gray-900">{order.shipping_address}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-2">
                              <ArrowUp className="w-4 h-4 text-blue-600" />
                              Pickup: {format(new Date(order.pickup_date), 'MMM d, yyyy - h:mm a')}
                            </div>
                            {order.type !== 'pickup' && order.delivery_date && (
                              <div className="flex items-center gap-2">
                                <ArrowDown className="w-4 h-4 text-green-600" />
                                Delivery: {format(new Date(order.delivery_date), 'MMM d, yyyy - h:mm a')}
                              </div>
                            )}
                          </div>
                          {order.special_instructions && (
                            <div className="text-sm text-gray-500 mt-2">
                              Note: {order.special_instructions}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="mt-4 w-full text-left"
                  >
                    <div className="flex items-center justify-between text-blue-600 hover:text-blue-700">
                      <span className="text-sm font-medium">View Progress</span>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <div className="space-y-4">
                          {getProgressSteps(order).map((step, index) => (
                            <div key={step.label} className="flex items-start">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                step.completed 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-gray-100 text-gray-400'
                              }`}>
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{step.label}</div>
                                <div className="text-sm text-gray-500">{step.date}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">Total Amount</div>
                      <div className="text-lg font-bold text-gray-900">
                        €{order.total_amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default Orders;