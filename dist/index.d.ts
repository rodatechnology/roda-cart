import React, { Dispatch } from "react";
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
        lineItems: any[];
        webUrl: any;
        id: any;
        totalPriceV2: {
            currencyCode: any;
            amount: any;
        };
    };
    didJustAddToCart: boolean;
}
export declare const StoreContext: React.Context<Context>;
export declare const StoreProvider: ({ children, domain, storefrontAccessToken, }: {
    children: React.ReactNode;
    domain: string;
    storefrontAccessToken: string;
}) => JSX.Element;
