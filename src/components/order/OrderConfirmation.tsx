import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Calendar, Clock, MapPin, Printer, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderDetails {
  service: string;
  items: { [key: string]: OrderItem };
  pickup_date: string;
  delivery_date?: string;
  pickup_address: string;
  delivery_address?: string;
  pickup_option: string;
  delivery_option?: string;
  special_instructions?: string;
}

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const orderDetails = location.state as OrderDetails;

  // Calculate totals
  const subtotal = Object.values(orderDetails?.items || {}).reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  const tax = subtotal * 0.21; // 21% VAT
  const shippingFee = 0; // Free shipping
  const totalAmount = subtotal + tax + shippingFee;

  // Generate unique order number
  useEffect(() => {
    const generateOrderNumber = async () => {
      if (orderNumber || isProcessing) return;

      setIsProcessing(true);
      let isUnique = false;
      let newOrderNumber = '';
      let attempts = 0;
      const maxAttempts = 10;
      
      while (!isUnique && attempts < maxAttempts) {
        attempts++;
        // Generate a random 6-digit number
        const randomNum = Math.floor(Math.random() * 900000) + 100000;
        newOrderNumber = `EZY${randomNum}`;
        
        try {
          // Check if this order number already exists
          const { data, error } = await supabase
            .from('orders')
            .select('order_number')
            .eq('order_number', newOrderNumber)
            .maybeSingle();
          
          if (error) throw error;
          
          if (!data) {
            isUnique = true;
            setOrderNumber(newOrderNumber);
          }
        } catch (err) {
          console.error('Error checking order number:', err);
          // If we hit an error, generate a timestamp-based fallback
          const timestamp = Date.now().toString().slice(-6);
          setOrderNumber(`EZY${timestamp}`);
          break;
        }
      }
      
      // If we couldn't generate a unique number after max attempts, use timestamp
      if (!isUnique && !orderNumber) {
        const timestamp = Date.now().toString().slice(-6);
        setOrderNumber(`EZY${timestamp}`);
      }

      setIsProcessing(false);
    };

    generateOrderNumber();
  }, [orderNumber, isProcessing]);

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!user && !loading) {
      const returnPath = location.pathname;
      const orderData = location.state;
      
      localStorage.setItem('returnTo', returnPath);
      if (orderData) {
        localStorage.setItem('orderData', JSON.stringify(orderData));
      }
      
      navigate('/login', { 
        state: { 
          returnTo: returnPath,
          orderData 
        }
      });
    }
  }, [user, loading, navigate, location]);

  // Save order when component mounts
  useEffect(() => {
    const initializeOrder = async () => {
      if (!user || orderSaved || !orderNumber || !orderDetails || isProcessing) return;

      try {
        setIsProcessing(true);

        // Check if order already exists
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('id')
          .eq('order_number', orderNumber)
          .maybeSingle();

        if (existingOrder) {
          setOrderSaved(true);
          setIsProcessing(false);
          return;
        }

        // Get coordinates for the address using Google Maps Geocoding API
        const geocoder = new google.maps.Geocoder();
        const addressToGeocode = orderDetails.pickup_address;

        const geocodeResult = await new Promise((resolve, reject) => {
          geocoder.geocode({ address: addressToGeocode }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              resolve(results[0].geometry.location);
            } else {
              reject(new Error('Geocoding failed'));
            }
          });
        });

        const location = geocodeResult as google.maps.LatLng;
        const latitude = location.lat().toString();
        const longitude = location.lng().toString();

        // Create a single order with pending status
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            order_number: orderNumber,
            user_id: user.id,
            customer_name: `${user.user_metadata.first_name || ''} ${user.user_metadata.last_name || ''}`.trim(),
            email: user.email,
            phone: user.user_metadata.phone,
            shipping_address: orderDetails.pickup_address,
            shipping_method: orderDetails.pickup_option,
            pickup_date: orderDetails.pickup_date,
            delivery_date: orderDetails.delivery_date,
            special_instructions: orderDetails.special_instructions,
            subtotal,
            tax,
            shipping_fee: shippingFee,
            total_amount: totalAmount,
            status: 'pending',
            payment_status: 'pending',
            latitude,
            longitude,
            type: orderDetails.delivery_date ? 'delivery' : 'pickup',
            is_pickup_completed: false,
            is_facility_processing: false,
            is_dropoff_completed: false
          })
          .select('id, order_number')
          .single();

        if (orderError) throw orderError;

        // Insert order items
        const orderItems = Object.values(orderDetails.items).map(item => ({
          order_id: orderData.id,
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        setOrderSaved(true);
      } catch (err) {
        console.error('Error saving order:', err);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    };

    initializeOrder().catch(err => {
      setError(err.message || 'Failed to initialize order');
    });
  }, [user, orderSaved, orderNumber, orderDetails, isProcessing]);

  const handleSkipPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Update order status directly
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'processing',
          payment_status: 'paid',
          payment_method: 'test'
        })
        .eq('order_number', orderNumber);

      if (updateError) throw updateError;

      // Navigate to success page
      navigate('/order/success', {
        state: {
          orderNumber,
          totalAmount,
          estimatedDelivery: orderDetails.delivery_date || orderDetails.pickup_date
        }
      });
    } catch (error) {
      console.error('Error updating order:', error);
      setError(error instanceof Error ? error.message : 'Failed to update order status');
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-red-700 mb-4">
              Error Processing Order
            </h2>
            <p className="text-red-600 mb-6">{error}</p>
            <motion.button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Back
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-4xl mx-auto"
      >
        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-600">Pickup Date</span>
              </div>
              <span className="font-medium text-gray-900">
                {new Date(orderDetails?.pickup_date).toLocaleString()}
              </span>
            </div>

            {orderDetails?.delivery_date && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Delivery Date</span>
                </div>
                <span className="font-medium text-gray-900">
                  {new Date(orderDetails.delivery_date).toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-600">Pickup Address</span>
              </div>
              <span className="font-medium text-gray-900">{orderDetails?.pickup_address}</span>
            </div>

            {orderDetails?.delivery_date && orderDetails?.delivery_address && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">Delivery Address</span>
                </div>
                <span className="font-medium text-gray-900">{orderDetails.delivery_address}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-3">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-600">Total Items</span>
              </div>
              <span className="font-medium text-gray-900">
                {Object.values(orderDetails?.items || {}).reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>

            {/* Price Breakdown */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>VAT (21%)</span>
                  <span>€{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">€{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={() => window.print()}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Printer className="w-5 h-5 mr-2" />
            Print Receipt
          </motion.button>

          <motion.button
            onClick={handleSkipPayment}
            disabled={loading || isProcessing}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            whileHover={{ scale: loading || isProcessing ? 1 : 1.05 }}
            whileTap={{ scale: loading || isProcessing ? 1 : 0.95 }}
          >
            {loading || isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                Processing...
              </div>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Skip Payment (Test Mode)
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;