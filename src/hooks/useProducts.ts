/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#C7FFD8

ICON_ASCII:
family=lucide
glyph=cpu

AGENTS:
ASSESS
ALIGN
AUDIT

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
import { useState, useEffect, createContext, useContext } from 'react';
import { collection, onSnapshot, query, where, orderBy, doc, setDoc, deleteDoc, serverTimestamp, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { MASTER_PRODUCTS } from '../constants';
import { GovernanceRegistry } from '../core/leeway/GovernanceRegistry';

import { getRuntimeAuthorityMode, RUNTIME_METADATA } from './useSiteContent';

export const ProductContext = createContext<{ products: Product[]; loading: boolean } | null>(null);

const DRAFT_KEY = 'campbell-products-draft';
const PUBLISHED_KEY = 'campbell-products';

// Helper to get products from local storage, bootstrapping with MASTER_PRODUCTS if empty
function getLocalDraftProducts(): Product[] {
  const data = localStorage.getItem(DRAFT_KEY);
  if (!data) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(MASTER_PRODUCTS));
    return MASTER_PRODUCTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return MASTER_PRODUCTS;
  }
}

function getLocalPublishedProducts(): Product[] {
  const data = localStorage.getItem(PUBLISHED_KEY);
  if (!data) {
    const live = MASTER_PRODUCTS.map(p => ({ ...p, status: 'live' as const }));
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(live));
    return live;
  }
  try {
    return JSON.parse(data);
  } catch {
    return MASTER_PRODUCTS.map(p => ({ ...p, status: 'live' as const }));
  }
}

// Validator
export function validateProduct(product: Product, allProducts: Product[]): string[] {
  const errors: string[] = [];

  if (!product.title?.trim()) {
    errors.push("Product title is required.");
  }
  if (!product.slug?.trim()) {
    errors.push("Product slug is required.");
  } else {
    const isDuplicate = allProducts.some(p => p.id !== product.id && p.slug === product.slug);
    if (isDuplicate) {
      errors.push(`Duplicate slug detected: "${product.slug}". Slug must be unique.`);
    }
  }
  if (product.price === undefined || product.price <= 0) {
    errors.push("Invalid price. Price must be a positive number.");
  }
  if (!product.category) {
    errors.push("Category is required.");
  }

  // Strict validation for live products
  if (product.status === 'live') {
    if (!product.image?.trim()) {
      errors.push("Visible products must have a primary featured image.");
    }
    if (!product.imageAlt?.trim()) {
      errors.push("Visible products must have image alt text for accessibility.");
    }
    if (!product.description?.trim()) {
      errors.push("Visible products must have a description.");
    }
    if (!product.sku?.trim()) {
      errors.push("Visible products must have a SKU.");
    }
  }

  return errors;
}

// 1. Published Products Hook (Customer Storefront)
export function useProducts(isAdmin: boolean = false) {
  const contextValue = useContext(ProductContext);
  if (contextValue) {
    return contextValue;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const mode = getRuntimeAuthorityMode();

  useEffect(() => {
    if (mode === 'CONFIGURATION_BLOCKED') {
      setProducts([]);
      setLoading(false);
      return undefined;
    }

    if (mode === 'STATIC_BOOTSTRAP_CONTENT') {
      const live = MASTER_PRODUCTS.map(p => ({ ...p, status: 'live' as const }));
      const filtered = isAdmin ? live : live.filter(p => ['live', 'unavailable'].includes(p.status));
      setProducts(filtered);
      setLoading(false);
      return undefined;
    }

    if (mode === 'DEVELOPMENT_BOOTSTRAP') {
      const local = getLocalPublishedProducts();
      const filtered = isAdmin ? local : local.filter(p => ['live', 'unavailable'].includes(p.status));
      setProducts(filtered);
      setLoading(false);
      return undefined;
    }

    const productsRef = collection(db!, 'products');
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
  }, [isAdmin, mode]);

  return { products, loading };
}

// 2. Draft Products Hook (Admin Workspace)
export function useDraftProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const mode = getRuntimeAuthorityMode();

  useEffect(() => {
    if (mode === 'CONFIGURATION_BLOCKED') {
      setProducts([]);
      setLoading(false);
      return undefined;
    }

    if (mode === 'STATIC_BOOTSTRAP_CONTENT') {
      setProducts(MASTER_PRODUCTS);
      setLoading(false);
      return undefined;
    }

    if (mode === 'DEVELOPMENT_BOOTSTRAP') {
      setProducts(getLocalDraftProducts());
      setLoading(false);
      return undefined;
    }

    const draftRef = collection(db!, 'draft_products');
    const q = query(draftRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Product[];
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Draft Error: ", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [mode]);

  return { products, loading };
}

// 3. Save Draft
export async function saveDraftProduct(product: Product) {
  const mode = getRuntimeAuthorityMode();
  const meta = RUNTIME_METADATA[mode];
  if (!meta.publishPermission) {
    throw new Error(`Publish Blocked: Current mode ${mode} has no save/publish permission.`);
  }

  if (mode === 'DEVELOPMENT_BOOTSTRAP') {
    const drafts = getLocalDraftProducts();
    const existingIdx = drafts.findIndex(p => p.id === product.id);
    const updated = [...drafts];
    const newProduct = { ...product, updatedAt: new Date().toISOString() };
    if (existingIdx >= 0) {
      updated[existingIdx] = newProduct;
    } else {
      updated.unshift(newProduct);
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
    return;
  }

  const { id, ...rest } = product;
  await setDoc(doc(db!, 'draft_products', id), {
    ...rest,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

// 4. Publish Product
export async function publishProduct(product: Product, allProducts: Product[]) {
  const mode = getRuntimeAuthorityMode();
  const meta = RUNTIME_METADATA[mode];
  if (!meta.publishPermission) {
    throw new Error(`Publish Blocked: Current mode ${mode} has no publish permission.`);
  }

  const errors = validateProduct(product, allProducts);
  if (errors.length > 0) {
    throw new Error(`Publish Blocked by Validation:\n- ${errors.join('\n- ')}`);
  }

  const leewayMetadata = {
    publishedAt: new Date().toISOString(),
    governingAgent: 'Atlas',
    authority: 'AdminOS Product Registry',
    status: 'fully_governed'
  };

  const publishedProduct: Product = {
    ...product,
    leewayMetadata
  };

  if (mode === 'DEVELOPMENT_BOOTSTRAP') {
    // Save to published store
    const published = getLocalPublishedProducts();
    const existingIdx = published.findIndex(p => p.id === product.id);
    const updatedPub = [...published];
    if (existingIdx >= 0) {
      updatedPub[existingIdx] = publishedProduct;
    } else {
      updatedPub.unshift(publishedProduct);
    }
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(updatedPub));

    // Update the draft store product status
    const drafts = getLocalDraftProducts();
    const draftIdx = drafts.findIndex(p => p.id === product.id);
    if (draftIdx >= 0) {
      const updatedDraft = [...drafts];
      updatedDraft[draftIdx] = publishedProduct;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(updatedDraft));
    }
    return;
  }

  // Firestore transaction or batch
  const batch = writeBatch(db!);
  const draftRef = doc(db!, 'draft_products', product.id);
  const pubRef = doc(db!, 'products', product.id);

  batch.set(pubRef, {
    ...publishedProduct,
    updatedAt: serverTimestamp()
  }, { merge: true });

  batch.set(draftRef, {
    ...publishedProduct,
    updatedAt: serverTimestamp()
  }, { merge: true });

  await batch.commit();

  GovernanceRegistry.register({
    id: `leeway.product.publish-${product.id}`,
    label: `Publish product: ${product.title}`,
    tag: 'PRODUCT.PUBLISH',
    region: 'CONTENT',
    ownerAgent: 'Atlas',
    authority: 'AdminOS',
    tracePath: ['AdminOS', 'ProductRegistry', 'Published'],
    auditCategory: 'content.publish',
    status: 'active',
    hardCoded: false
  });
}

// 5. Delete Product
export async function deleteProduct(product: Product) {
  const mode = getRuntimeAuthorityMode();
  const meta = RUNTIME_METADATA[mode];
  if (!meta.publishPermission) {
    throw new Error(`Delete Blocked: Current mode ${mode} has no modification permission.`);
  }

  if (mode === 'DEVELOPMENT_BOOTSTRAP') {
    const drafts = getLocalDraftProducts().filter(p => p.id !== product.id);
    const published = getLocalPublishedProducts().filter(p => p.id !== product.id);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(published));
    return;
  }

  await deleteDoc(doc(db!, 'draft_products', product.id));
  await deleteDoc(doc(db!, 'products', product.id));
}

// 6. Bootstrap Seed Database (AdminOS can import/seed from MASTER_PRODUCTS)
export async function seedDatabase(force: boolean = false) {
  const mode = getRuntimeAuthorityMode();
  if (mode === 'CONFIGURATION_BLOCKED' || mode === 'STATIC_BOOTSTRAP_CONTENT') {
    throw new Error(`Seed Blocked: Current mode ${mode} does not allow seeding database.`);
  }

  if (mode === 'DEVELOPMENT_BOOTSTRAP') {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(MASTER_PRODUCTS));
    const live = MASTER_PRODUCTS.map(p => ({ ...p, status: 'live' as const }));
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(live));
    return;
  }

  const productsRef = collection(db!, 'draft_products');
  const snapshot = await getDocs(productsRef);
  
  if (!snapshot.empty && !force) {
    console.log("Database already seeded. Use force=true to update existing artifacts.");
    return;
  }

  console.log(force ? "Refining global registry..." : "Seeding database with master products...");
  const batch = writeBatch(db!);

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

