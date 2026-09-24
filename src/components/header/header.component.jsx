'use client';

import CartIcon from '../cart-icon/cart-icon.component';
import CartDropdown from '../cart-dropdown/cart-dropdown.component';
import CrownIcon from '../icons/crown.icon';
import { useCart } from '@/contexts/cart.context';
import { useUser } from '@/contexts/user.context';
import { HeaderContainer, LogoContainer, OptionsContainer, OptionLink } from './header.styles';

const Header = () => {
  const { currentUser, signOut } = useUser();
  const { hidden, clearCart } = useCart();

  const handleSignOut = async () => {
    try {
      await signOut();
      clearCart();
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  return (
    <HeaderContainer>
      <LogoContainer href='/' aria-label='Home'>
        <CrownIcon className='logo' />
      </LogoContainer>
      <OptionsContainer>
        <OptionLink href='/shop'>SHOP</OptionLink>
        <OptionLink href='/shop'>CONTACT</OptionLink>
        {currentUser ? (
          <OptionLink as='div' onClick={handleSignOut}>
            SIGN OUT
          </OptionLink>
        ) : (
          <OptionLink href='/signin'>SIGN IN</OptionLink>
        )}
        <CartIcon />
      </OptionsContainer>
      {hidden ? null : <CartDropdown />}
    </HeaderContainer>
  );
};

export default Header;
