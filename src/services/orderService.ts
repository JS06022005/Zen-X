import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { CartItem, DeliveryAddress, PaymentMethodType } from '../types';

export interface UserProfileData {
  userId: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface PlacedOrder {
  id: string;
  userId: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    selectedSize: string;
    selectedColor: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  subtotal: number;
  discount: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethodType;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: any;
}

export async function saveUserProfile(profile: UserProfileData): Promise<void> {
  const path = `users/${profile.userId}`;
  try {
    const docRef = doc(db, 'users', profile.userId);
    const existing = await getDoc(docRef);
    if (!existing.exists()) {
      await setDoc(docRef, {
        ...profile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      await setDoc(
        docRef,
        {
          ...profile,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfileData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function createOrder(
  userId: string,
  cartItems: CartItem[],
  totalAmount: number,
  subtotal: number,
  discount: number,
  deliveryAddress: DeliveryAddress,
  paymentMethod: PaymentMethodType
): Promise<string> {
  const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
  const path = `orders/${orderId}`;

  const simplifiedItems = cartItems.map((item) => ({
    productId: item.product.id,
    productName: item.product.name,
    productImage: item.product.image,
    selectedSize: item.selectedSize,
    selectedColor: item.selectedColor,
    quantity: item.quantity,
    price: item.price,
  }));

  const orderData = {
    id: orderId,
    userId,
    items: simplifiedItems,
    totalAmount,
    subtotal,
    discount,
    deliveryAddress,
    paymentMethod,
    status: 'confirmed' as const,
    createdAt: serverTimestamp(),
  };

  try {
    const docRef = doc(db, 'orders', orderId);
    await setDoc(docRef, orderData);
    return orderId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function getUserOrders(userId: string): Promise<PlacedOrder[]> {
  const path = 'orders';
  try {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const orders: PlacedOrder[] = [];
    snap.forEach((docSnap) => {
      orders.push(docSnap.data() as PlacedOrder);
    });
    // Sort client-side by date descending
    return orders.sort((a, b) => {
      const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
      const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
      return timeB - timeA;
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function syncUserWishlist(userId: string, productIds: string[]): Promise<void> {
  const path = `wishlists/${userId}`;
  try {
    const docRef = doc(db, 'wishlists', userId);
    await setDoc(docRef, {
      userId,
      productIds,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserWishlist(userId: string): Promise<string[] | null> {
  const path = `wishlists/${userId}`;
  try {
    const docRef = doc(db, 'wishlists', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return (snap.data().productIds as string[]) || [];
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}
