import type { Meta, StoryObj } from "@storybook/react";
import { ImageIcon, TextIcon } from "./IconAnalysisType";

const meta: Meta = {
  title: "ui/IconAnalysisType",
};
export default meta;

type Story = StoryObj;

export const Image: Story = {
  render: () => <ImageIcon className="w-8 h-8 text-yellow-500" />,
};

export const Text: Story = {
  render: () => <TextIcon className="w-8 h-8 text-blue-500" />,
};
