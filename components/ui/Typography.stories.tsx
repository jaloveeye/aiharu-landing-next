import type { Meta, StoryObj } from "@storybook/react";
import { Title, Subtitle, Body, Caption } from "./Typography";

const meta: Meta = {
  title: "UI/Typography",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const TitleExample: Story = {
  render: () => <Title>타이틀 예시</Title>,
};

export const SubtitleExample: Story = {
  render: () => <Subtitle>서브타이틀 예시</Subtitle>,
};

export const BodyExample: Story = {
  render: () => <Body>본문 텍스트 예시</Body>,
};

export const CaptionExample: Story = {
  render: () => <Caption>캡션 텍스트 예시</Caption>,
};
