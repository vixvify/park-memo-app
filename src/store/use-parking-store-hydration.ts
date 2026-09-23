"use client";

import { useEffect, useState } from "react";

import { useParkingStore } from "@/store/parking.store";

export function useParkingStoreHydration() {
  const [hasHydrated, setHasHydrated] = useState(
    useParkingStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (hasHydrated) return;

    const unsubscribe = useParkingStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    void useParkingStore.persist.rehydrate();

    return unsubscribe;
  }, [hasHydrated]);

  return hasHydrated;
}
