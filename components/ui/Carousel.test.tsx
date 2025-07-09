import { render, screen, fireEvent } from "@testing-library/react";
import Carousel from "./Carousel";

describe("Carousel", () => {
  const items = [
    { label: "Slide 1", color: "#eee" },
    { label: "Slide 2", color: "#ddd" },
    { label: "Slide 3", color: "#ccc" },
  ];
  const renderItem = (item: any) => <div>{item.label}</div>;

  it("renders the first item by default", () => {
    render(<Carousel items={items} renderItem={renderItem} />);
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
  });

  it("navigates to next and previous items", () => {
    render(<Carousel items={items} renderItem={renderItem} />);
    const nextBtn = screen.getByLabelText("다음");
    const prevBtn = screen.getByLabelText("이전");
    // Next
    fireEvent.click(nextBtn);
    expect(screen.getByText("Slide 2")).toBeInTheDocument();
    // Next
    fireEvent.click(nextBtn);
    expect(screen.getByText("Slide 3")).toBeInTheDocument();
    // Next (loop)
    fireEvent.click(nextBtn);
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
    // Prev (loop)
    fireEvent.click(prevBtn);
    expect(screen.getByText("Slide 3")).toBeInTheDocument();
  });
});
