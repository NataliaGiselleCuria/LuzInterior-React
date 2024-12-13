import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ApiProvider } from './context/ApiProvider.tsx'
import { CartProvider } from './context/CartProvider.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { ProductProvider } from './context/ProductProvider.tsx'
import { OrderProvider } from './context/OrderProvider.tsx'
import { BrowserRouter } from "react-router-dom";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ApiProvider>
        <UserProvider>
          <ProductProvider>
            <CartProvider>
              <OrderProvider>
                <App />
              </OrderProvider>
            </CartProvider>
          </ProductProvider>
        </UserProvider>
      </ApiProvider>
    </BrowserRouter>
  </StrictMode>
)
