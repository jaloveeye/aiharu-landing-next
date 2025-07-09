import type { Meta, StoryObj } from "@storybook/react";
import Carousel from "./Carousel";

const meta: Meta<typeof Carousel> = {
  title: "ui/Carousel",
  component: Carousel,
};
export default meta;

type Story = StoryObj<typeof Carousel>;

const items = [
  { label: "Slide 1", color: "#eee" },
  { label: "Slide 2", color: "#ddd" },
  { label: "Slide 3", color: "#ccc" },
];

export const Default: Story = {
  args: {
    items,
    renderItem: (item: any) => (
      <div style={{ background: item.color, padding: 24 }}>{item.label}</div>
    ),
  },
};
