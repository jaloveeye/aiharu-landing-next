import { render } from "@testing-library/react";
import { ImageIcon, TextIcon } from "./IconAnalysisType";

describe("IconAnalysisType", () => {
  it("renders ImageIcon without crashing", () => {
    const { container } = render(<ImageIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
  it("renders TextIcon without crashing", () => {
    const { container } = render(<TextIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
