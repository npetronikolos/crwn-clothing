'use client';

import { CustomButtonContainer } from './custom-button.styles';

const CustomButton = ({ children, isGoogleSignIn, inverted, ...props }) => (
  <CustomButtonContainer $isGoogleSignIn={isGoogleSignIn} $inverted={inverted} {...props}>
    {children}
  </CustomButtonContainer>
);

export default CustomButton;
