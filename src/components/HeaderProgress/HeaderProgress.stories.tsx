/**
 * HeaderProgress Storybook Stories
 * Visual documentation and interactive testing for HeaderProgress component
 */

import type { Meta, StoryObj } from '@storybook/react';
import HeaderProgress from './HeaderProgress';

const meta = {
  title: 'Components/HeaderProgress',
  component: HeaderProgress,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    progress: {
      description: 'Progress values for each pillar (0-100)',
      control: { type: 'object' },
    },
    paddingHorizontal: {
      description: 'Horizontal padding in pixels',
      control: { type: 'number', min: 0, max: 40, step: 4 },
    },
    allowFontScaling: {
      description: 'Allow font scaling for accessibility',
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof HeaderProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Story - Normal progress
 */
export const Default: Story = {
  args: {
    progress: {
      espiritualidade: 75,
      saude: 85,
      financas: 60,
      relacionamentos: 90,
    },
  },
};

/**
 * All Pillars Complete
 */
export const AllComplete: Story = {
  args: {
    progress: {
      espiritualidade: 100,
      saude: 100,
      financas: 100,
      relacionamentos: 100,
    },
  },
};

/**
 * No Progress
 */
export const NoProgress: Story = {
  args: {
    progress: {
      espiritualidade: 0,
      saude: 0,
      financas: 0,
      relacionamentos: 0,
    },
  },
};

/**
 * Mixed Progress
 */
export const MixedProgress: Story = {
  args: {
    progress: {
      espiritualidade: 25,
      saude: 50,
      financas: 75,
      relacionamentos: 95,
    },
  },
};

/**
 * Compact Layout (Small Screen)
 */
export const CompactLayout: Story = {
  args: {
    progress: {
      espiritualidade: 70,
      saude: 80,
      financas: 65,
      relacionamentos: 85,
    },
    paddingHorizontal: 8,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone-se',
    },
  },
};

/**
 * With Font Scaling Disabled
 */
export const NoFontScaling: Story = {
  args: {
    progress: {
      espiritualidade: 75,
      saude: 85,
      financas: 60,
      relacionamentos: 90,
    },
    allowFontScaling: false,
  },
};

/**
 * Large Custom Padding
 */
export const LargePadding: Story = {
  args: {
    progress: {
      espiritualidade: 75,
      saude: 85,
      financas: 60,
      relacionamentos: 90,
    },
    paddingHorizontal: 32,
  },
};

/**
 * Accessibility Focus - High Contrast
 */
export const AccessibilityFocus: Story = {
  args: {
    progress: {
      espiritualidade: 75,
      saude: 85,
      financas: 60,
      relacionamentos: 90,
    },
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'label',
            enabled: true,
          },
        ],
      },
    },
  },
};

/**
 * Edge Case - Decimal Values (should round)
 */
export const DecimalValues: Story = {
  args: {
    progress: {
      espiritualidade: 75.6,
      saude: 85.4,
      financas: 60.9,
      relacionamentos: 90.1,
    },
  },
};

/**
 * Edge Case - Out of Range Values (should clamp)
 */
export const OutOfRangeValues: Story = {
  args: {
    progress: {
      espiritualidade: 150, // Should clamp to 100
      saude: -50, // Should clamp to 0
      financas: 75,
      relacionamentos: 90,
    },
  },
};
