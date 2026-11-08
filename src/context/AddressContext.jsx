import { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

const AddressContext = createContext(null);

function createAddressId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function AddressProvider({ children }) {
  const { user } = useAuth();
  const [addressBooks, setAddressBooks] = useLocalStorage(STORAGE_KEYS.ADDRESSES, {});
  const ownerId = user ? user.id ?? user.email.toLowerCase() : null;
  const addresses = ownerId ? addressBooks[ownerId] ?? [] : [];

  const addAddress = (address) => {
    if (!ownerId) return;

    const newAddress = {
      ...address,
      id: createAddressId(),
    };
    setAddressBooks((previous) => {
      const current = previous[ownerId] ?? [];
      const savedAddress = {
        ...newAddress,
        isDefault: current.length === 0 || address.isDefault,
      };

      return {
        ...previous,
        [ownerId]: [
          ...(savedAddress.isDefault
            ? current.map((item) => ({ ...item, isDefault: false }))
            : current),
          savedAddress,
        ],
      };
    });
  };

  const updateAddress = (addressId, changes) => {
    if (!ownerId) return;

    setAddressBooks((previous) => {
      const current = previous[ownerId] ?? [];
      const updated = current.map((item) =>
        item.id === addressId ? { ...item, ...changes } : item,
      );
      if (changes.isDefault) {
        return {
          ...previous,
          [ownerId]: updated.map((item) => ({ ...item, isDefault: item.id === addressId })),
        };
      }
      return { ...previous, [ownerId]: updated };
    });
  };

  const deleteAddress = (addressId) => {
    if (!ownerId) return;

    setAddressBooks((previous) => {
      const current = previous[ownerId] ?? [];
      const removedDefault = current.some((item) => item.id === addressId && item.isDefault);
      const remaining = current.filter((item) => item.id !== addressId);
      if (removedDefault && remaining.length > 0) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      return { ...previous, [ownerId]: remaining };
    });
  };

  const setDefaultAddress = (addressId) => {
    if (!ownerId) return;

    setAddressBooks((previous) => ({
      ...previous,
      [ownerId]: (previous[ownerId] ?? []).map((item) => ({
        ...item,
        isDefault: item.id === addressId,
      })),
    }));
  };

  const value = useMemo(
    () => ({ addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress }),
    [addresses, ownerId],
  );

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export function useAddresses() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddresses phải được dùng bên trong <AddressProvider>');
  }
  return context;
}
