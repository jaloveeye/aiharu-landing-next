import type { Meta, StoryObj } from "@storybook/react";
import Card from "./Card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    "aria-label": { control: "text" },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: "카드 기본 내용",
  },
};

export const WithAriaLabel: Story = {
  args: {
    children: "접근성 라벨이 있는 카드",
    "aria-label": "샘플 카드",
  },
};
