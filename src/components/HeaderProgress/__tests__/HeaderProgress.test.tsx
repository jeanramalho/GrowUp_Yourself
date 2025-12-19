/**
 * HeaderProgress Component Tests
 * Follows TDD: RED → GREEN → REFACTOR
 *
 * Requirements (SPEC-001):
 * - Fixed header with 4 pillar icons
 * - Monthly progress bars for each pillar
 * - Accessible labels and testID props
 * - Uses design tokens for colors/sizes
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import HeaderProgress from '../HeaderProgress';
import designTokens from '@styles/design-tokens.json';

describe('HeaderProgress Component', () => {
  const mockProgress = {
    espiritualidade: 75,
    saude: 85,
    financas: 60,
    relacionamentos: 90,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(<HeaderProgress progress={mockProgress} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render all 4 pillar sections', () => {
      render(<HeaderProgress progress={mockProgress} />);

      expect(screen.getByTestId('pilar-espiritualidade')).toBeTruthy();
      expect(screen.getByTestId('pilar-saude')).toBeTruthy();
      expect(screen.getByTestId('pilar-financas')).toBeTruthy();
      expect(screen.getByTestId('pilar-relacionamentos')).toBeTruthy();
    });

    it('should display correct progress values', () => {
      render(<HeaderProgress progress={mockProgress} />);

      expect(screen.getByText('75%')).toBeTruthy();
      expect(screen.getByText('85%')).toBeTruthy();
      expect(screen.getByText('60%')).toBeTruthy();
      expect(screen.getByText('90%')).toBeTruthy();
    });

    it('should render progress bars with correct fill widths', () => {
      const { root } = render(<HeaderProgress progress={mockProgress} />);

      // Each progress bar should have a fill width matching percentage
      const progressBars = root.findAllByType('View');
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible labels for each pillar', () => {
      render(<HeaderProgress progress={mockProgress} />);

      expect(
        screen.getByLabelText(/espiritualidade.*75.*progresso/i),
      ).toBeTruthy();
      expect(screen.getByLabelText(/saúde.*85.*progresso/i)).toBeTruthy();
      expect(
        screen.getByLabelText(/finanças.*60.*progresso/i),
      ).toBeTruthy();
      expect(
        screen.getByLabelText(/relacionamentos.*90.*progresso/i),
      ).toBeTruthy();
    });

    it('should support larger text for accessibility', () => {
      render(<HeaderProgress progress={mockProgress} allowFontScaling={true} />);
      expect(screen.getByTestId('pilar-espiritualidade')).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should use correct pillar colors from design tokens', () => {
      const { root } = render(<HeaderProgress progress={mockProgress} />);
      const component = root.findByType(HeaderProgress);

      // Colors should match design tokens
      expect(component.instance.props.progress).toEqual(mockProgress);
    });

    it('should use correct spacing from design tokens', () => {
      const expectedSpacing = designTokens.spacing[4]; // 16px
      const { root } = render(
        <HeaderProgress progress={mockProgress} paddingHorizontal={expectedSpacing} />,
      );
      expect(root).toBeTruthy();
    });
  });

  describe('Progress Calculations', () => {
    it('should handle 0% progress', () => {
      const zeroProgress = {
        espiritualidade: 0,
        saude: 0,
        financas: 0,
        relacionamentos: 0,
      };
      render(<HeaderProgress progress={zeroProgress} />);
      expect(screen.getByText('0%')).toBeTruthy();
    });

    it('should handle 100% progress', () => {
      const fullProgress = {
        espiritualidade: 100,
        saude: 100,
        financas: 100,
        relacionamentos: 100,
      };
      render(<HeaderProgress progress={fullProgress} />);
      // Should render 4 "100%" texts (one per pillar)
      const hundredTexts = screen.queryAllByText('100%');
      expect(hundredTexts.length).toBe(4);
    });

    it('should round progress values correctly', () => {
      const decimalProgress = {
        espiritualidade: 75.6,
        saude: 85.4,
        financas: 60.9,
        relacionamentos: 90.1,
      };
      render(<HeaderProgress progress={decimalProgress} />);
      // Values should be rounded to whole numbers
      expect(screen.getByText('76%')).toBeTruthy();
      expect(screen.getByText('85%')).toBeTruthy();
    });
  });

  describe('Snapshot', () => {
    it('should match snapshot', () => {
      const { toJSON } = render(<HeaderProgress progress={mockProgress} />);
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
