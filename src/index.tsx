import React, { Dispatch } from "react";
import Client from "shopify-buy";

const client = null;

export interface Context {
  cart: any[];
  isOpen: boolean;
  loading: boolean;
  onOpen: () => void;
  onClose: () => void;
  addVariantToCart: (variantId: string, quantity: string | number) => any;
  removeLineItem: (checkoutId: any, itemId: any) => any;
  updateLineItem: (checkoutID: any, itemId: any, value: any) => any;
  client: any;
  showCart: boolean;
  setShowCart: Dispatch<boolean>;
  checkout: {
    lineItems: any[],
    webUrl: any,
    id: any,
    totalPriceV2: {
      currencyCode: any,
      amount: any,
    },
  },
  didJustAddToCart: boolean;
}

const defaultValues: Context = {
  cart: [],
  isOpen: false,
  loading: false,
  onOpen: () => {},
  onClose: () => {},
  addVariantToCart: (variantId: string, quantity: string | number) => {},
  removeLineItem: (checkoutId: any, itemId: any) => {},
  updateLineItem: (checkoutID: any, itemId: any, value: any) => {},
  client,
  showCart: false,
  setShowCart: () => {},
  checkout: {
    lineItems: [],
    webUrl: null,
    id: null,
    totalPriceV2: {
      currencyCode: null,
      amount: null,
    },
  },
  didJustAddToCart: false,
};

export const StoreContext = React.createContext(defaultValues);

const isBrowser = typeof window !== `undefined`;
const localStorageKey = `shopify_checkout_id`;

export const StoreProvider = ({
  children,
  domain,
  storefrontAccessToken,
}: {
  children: React.ReactNode;
  domain: string;
  storefrontAccessToken: string;
}) => {
  const [checkout, setCheckout] = React.useState(defaultValues.checkout);
  const [loading, setLoading] = React.useState(false);
  const [didJustAddToCart, setDidJustAddToCart] = React.useState(false);
  const [showCart, setShowCart] = React.useState(false);

  const client = Client.buildClient({
    domain: domain,
    storefrontAccessToken: storefrontAccessToken,
  });

  React.useEffect(() => {
    if (checkout.lineItems.length == 0) {
      setShowCart(false);
    } else {
      setShowCart(true);
    }
  }, [checkout]);

  const setCheckoutItem = (checkout: any) => {
    if (isBrowser) {
      localStorage.setItem(localStorageKey, checkout.id);
    }

    setCheckout(checkout);
  };

  React.useEffect(() => {
    const initializeCheckout = async () => {
      const existingCheckoutID = isBrowser
        ? localStorage.getItem(localStorageKey)
        : null;

      if (existingCheckoutID && existingCheckoutID !== `null`) {
        try {
          const existingCheckout = await client.checkout.fetch(
            existingCheckoutID
          );
          if (!existingCheckout.completedAt) {
            setCheckoutItem(existingCheckout);
            return;
          }
        } catch (e) {
          localStorage.setItem(localStorageKey, "");
        }
      }

      const newCheckout = await client.checkout.create();
      setCheckoutItem(newCheckout);
    };

    initializeCheckout();
  }, []);

  const addVariantToCart: (
    variantId: string,
    quantity: string | number
  ) => void = (variantId, quantity) => {
    setLoading(true);

    const checkoutID = (checkout as any).id;

    const lineItemsToUpdate = [
      {
        variantId,
        quantity: parseInt(quantity as string, 10),
      },
    ];

    return client.checkout
      .addLineItems(checkoutID, lineItemsToUpdate)
      .then((res: any) => {
        setCheckout(res);
        setLoading(false);
        setDidJustAddToCart(true);
        setTimeout(() => setDidJustAddToCart(false), 3000);
      });
  };

  const removeLineItem: any = (checkoutID: string, lineItemID: string) => {
    setLoading(true);

    return client.checkout
      .removeLineItems(checkoutID, [lineItemID])
      .then((res: any) => {
        setCheckout(res);
        setLoading(false);
      });
  };

  const updateLineItem: any = (
    checkoutID: string,
    lineItemID: string,
    quantity: string | number
  ) => {
    setLoading(true);

    const lineItemsToUpdate = [
      { id: lineItemID, quantity: parseInt(quantity as string, 10) },
    ];

    return client.checkout
      .updateLineItems(checkoutID, lineItemsToUpdate)
      .then((res: any) => {
        setCheckout(res);
        setLoading(false);
      });
  };

  return (
    <StoreContext.Provider
      value={{
        ...defaultValues,
        addVariantToCart,
        showCart,
        setShowCart,
        removeLineItem,
        updateLineItem,
        checkout,
        loading,
        didJustAddToCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
