import React from "react";

import { 
  render, 
  cleanup, 
  fireEvent, 
  waitForElement,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  prettyDOM
 } from "@testing-library/react";

import Application from "components/Application";

describe('Application', () => {

  afterEach(cleanup);
  
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
  
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText('Monday'))
   
    fireEvent.click(getByText('Tuesday'));
   
    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  
  });
  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
  
    const { container } = render(<Application />);
    
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    
    const appointment = getAllByTestId(container, "appointment")[0];
    console.log(prettyDOM(appointment));

    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, 'Save'));

  });

});
