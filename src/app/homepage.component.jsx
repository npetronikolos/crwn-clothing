'use client';

import Directory from '@/components/directory/directory.component';
import { HomePageContainer } from './homepage.styles';

const HomePage = ({ sections }) => (
  <HomePageContainer>
    <Directory sections={sections} />
  </HomePageContainer>
);

export default HomePage;
