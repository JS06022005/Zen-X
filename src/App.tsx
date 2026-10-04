import { useState, useMemo, useEffect } from 'react';
import { Screen, Product, CartItem, DeliveryAddress } from './types';
import { PRODUCTS, INITIAL_CART_ITEMS, DEFAULT_ADDRESS } from './data/products';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CatalogScreen } from './components/CatalogScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { CartScreen } from './components/CartScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AuthScreen } from './components/AuthScreen';
import { AccountScreen } from './components/AccountScreen';
import { useAuth } from './context/AuthContext';
import { createOrder, getUserWishlist, syncUserWishlist } from './services/orderService';

export default function App() {
  const { user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('catalog');
  const [history, setHistory] = useState<Screen[]>(['catalog']);
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [wishlistIds, setWishlistIds] = useState<string[]>([
    'zen-classic-heavyweight-oversized-tee',
    'relaxed-fit-french-terry-hoodie',
  ]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('ZENFIRST10');
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>(DEFAULT_ADDRESS);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');

  // Sync wishlist from Firestore when user authenticates
  useEffect(() => {
    if (user) {
      getUserWishlist(user.uid).then((saved) => {
        if (saved && saved.length > 0) {
          setWishlistIds(saved);
        }
      });
    }
  }, [user]);

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  // Navigate with history tracking
  const navigateTo = (screen: Screen) => {
    if (screen === currentScreen) return;
    setHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
  };

  // Dedicated Go Back handler
  const handleGoBack = () => {
    if (history.length > 1) {
      const nextHistory = [...history];
      nextHistory.pop(); // drop current
      const prevScreen = nextHistory[nextHistory.length - 1] || 'catalog';
      setHistory(nextHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('catalog');
      setHistory(['catalog']);
    }
  };

  // Cart financial summary
  const cartSummary = useMemo(() => {
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return { count, total };
  }, [cartItems]);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    size: string = 'M',
    color: string = product.colorName,
    quantity: number = 1
  ) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random()}`,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity,
          price: product.price,
          mrp: product.mrp,
        };
        return [...prev, newItem];
      }
    });
  };

  const handleBuyNow = (
    product: Product,
    size: string = 'M',
    color: string = product.colorName,
    quantity: number = 1
  ) => {
    handleAddToCart(product, size, color, quantity);
    navigateTo('checkout');
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMoveToWishlist = (item: CartItem) => {
    if (!wishlistIds.includes(item.product.id)) {
      setWishlistIds((prev) => [...prev, item.product.id]);
    }
    handleRemoveItem(item.id);
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
      if (user) {
        syncUserWishlist(user.uid, next);
      }
      return next;
    });
  };

  const handleApplyCoupon = (code: string): boolean => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'ZENFIRST10' || formatted === 'ZENESSENTIALS' || formatted === 'EXTRA10') {
      setAppliedCoupon(formatted);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    navigateTo('pdp');
  };

  const handlePaymentSuccess = async () => {
    let orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = cartSummary.total;
    const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
    const totalAmount = Math.max(0, subtotal - discount);

    if (user) {
      try {
        orderId = await createOrder(
          user.uid,
          cartItems,
          totalAmount,
          subtotal,
          discount,
          deliveryAddress,
          'upi'
        );
      } catch (err) {
        console.error('Failed to save order to Firestore:', err);
      }
    }

    setConfirmedOrderId(orderId);
    setCartItems([]);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex flex-col font-sans">
      {/* Universal Sticky Header */}
      {currentScreen !== 'checkout' ? (
        <Header
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          cartCount={cartSummary.count}
          cartTotal={cartSummary.total}
          wishlistCount={wishlistIds.length}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      ) : null}

      {/* Main Content Area */}
      <main className={`flex-1 w-full ${currentScreen !== 'checkout' ? 'pt-[116px]' : ''}`}>
        {currentScreen === 'catalog' && (
          <CatalogScreen
            products={PRODUCTS}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchQuery={searchQuery}
            onNavigate={navigateTo}
          />
        )}

        {currentScreen === 'pdp' && (
          <ProductDetailScreen
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onNavigate={navigateTo}
            onGoBack={handleGoBack}
            onSelectCategory={setActiveCategory}
          />
        )}

        {currentScreen === 'cart' && (
          <CartScreen
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onMoveToWishlist={handleMoveToWishlist}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            onNavigate={navigateTo}
            onGoBack={handleGoBack}
          />
        )}

        {currentScreen === 'checkout' && (
          <CheckoutScreen
            items={cartItems}
            address={deliveryAddress}
            onUpdateAddress={setDeliveryAddress}
            appliedPromo={appliedCoupon || 'ZENESSENTIALS'}
            onRemovePromo={handleRemoveCoupon}
            onPaymentSuccess={handlePaymentSuccess}
            onNavigate={navigateTo}
            onGoBack={handleGoBack}
          />
        )}

        {currentScreen === 'auth' && (
          <AuthScreen onNavigate={navigateTo} redirectTo="catalog" />
        )}

        {currentScreen === 'account' && (
          <AccountScreen
            onNavigate={navigateTo}
            wishlistCount={wishlistIds.length}
            cartCount={cartSummary.count}
          />
        )}
      </main>

      {/* Universal Footer */}
      {currentScreen !== 'checkout' && (
        <Footer onNavigate={navigateTo} onSelectCategory={setActiveCategory} />
      )}

      {/* Order Confirmed Success Modal */}
      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        address={deliveryAddress}
        totalAmount={cartSummary.total || 2698}
        onNavigate={navigateTo}
        orderId={confirmedOrderId}
      />
    </div>
  );
}
