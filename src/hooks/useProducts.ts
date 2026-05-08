/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.SRC.HOOKS.USE_PRODUCTS.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = useProducts.ts — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/hooks/useProducts.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy, doc, setDoc, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { MASTER_PRODUCTS } from '../constants';

export function useProducts(isAdmin: boolean = false) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setProducts(isAdmin ? MASTER_PRODUCTS : MASTER_PRODUCTS.filter((product) => ['live', 'unavailable'].includes(product.status)));
      setLoading(false);
      return undefined;
    }

    // Customers only see live or unavailable products
    // Admins see everything
    const productsRef = collection(db, 'products');
    let q = query(productsRef, orderBy('createdAt', 'desc'));

    if (!isAdmin) {
      q = query(
        productsRef, 
        where('status', 'in', ['live', 'unavailable']),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Product[];
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error: ", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [isAdmin]);

  return { products, loading };
}

export async function seedDatabase(force: boolean = false) {
  if (!db) {
    throw new Error('Firebase is not configured. Add valid VITE_FIREBASE_* values before seeding the registry.');
  }

  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  
  if (!snapshot.empty && !force) {
    console.log("Database already seeded. Use force=true to update existing artifacts.");
    return;
  }

  console.log(force ? "Refining global registry..." : "Seeding database with master products...");
  const batch = writeBatch(db);

  MASTER_PRODUCTS.forEach((p) => {
    const docRef = doc(productsRef, p.id);
    batch.set(docRef, {
      ...p,
      status: 'live',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  });

  await batch.commit();
  console.log("Synchronization complete.");
}
