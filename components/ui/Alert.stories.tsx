import type { Meta, StoryObj } from "@storybook/react";
import Alert from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "UI/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["info", "success", "error"],
    },
    className: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    children: "정보 메시지입니다.",
    variant: "info",
  },
};

export const Success: Story = {
  args: {
    children: "성공 메시지입니다!",
    variant: "success",
  },
};

export const Error: Story = {
  args: {
    children: "에러가 발생했습니다.",
    variant: "error",
  },
};
