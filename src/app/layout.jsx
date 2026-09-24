import StyledComponentsRegistry from '@/lib/styled-components-registry';
import ApolloProvider from '@/lib/apollo-provider';
import { UserProvider } from '@/contexts/user.context';
import { CartProvider } from '@/contexts/cart.context';
import Header from '@/components/header/header.component';
import { Open_Sans } from 'next/font/google';
import './globals.css';

// Open Sans at 75% width and weight 300 matches the original "Open Sans Condensed Light".
const openSans = Open_Sans({ subsets: ['latin'], axes: ['wdth'], variable: '--font-open-sans' });

export const metadata = {
  title: 'CRWN Clothing',
  description: 'CRWN Clothing online store'
};

const RootLayout = ({ children }) => (
  <html lang='en' className={openSans.variable}>
    <body>
      <StyledComponentsRegistry>
        <ApolloProvider>
          <UserProvider>
            <CartProvider>
              <Header />
              {children}
            </CartProvider>
          </UserProvider>
        </ApolloProvider>
      </StyledComponentsRegistry>
    </body>
  </html>
);

export default RootLayout;
