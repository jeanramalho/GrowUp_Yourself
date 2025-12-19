import React from 'react';
import { render } from '@testing-library/react-native';
import HeaderProgress from '../src/components/HeaderProgress/HeaderProgress';

test('HeaderProgress renders and accessibility labels present', () => {
  const { getByA11yLabel } = render(
    <HeaderProgress spiritual={81.25} health={60} finance={91} relationship={45} />
  );
  expect(getByA11yLabel(/Espiritualidade/)).toBeTruthy();
});
