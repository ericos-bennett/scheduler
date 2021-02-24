import React from "react";
import axios from "axios";

import { 
  render, 
  cleanup, 
  fireEvent, 
  waitForElement,
  getByText,
  getAllByTestId,
  getByAltText,
  getAllByAltText,
  getByPlaceholderText,
  queryByText,
  prettyDOM,
  getByTestId,
  getAllByPlaceholderText
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

    // Wait until DOM is loaded before simulating events
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, "appointment")[0];

    // Click on a open timeslot, fill it out and save
    fireEvent.click(getByAltText(appointment, 'Add'));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, 'Save'));
    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();

    // Async while waiting for the API call to resolve, then check if added
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // Check if there are no longer any spots remaining
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();

  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, 'appointment').find(appt =>
      queryByText(appt, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, 'Are you sure you want to delete this?')).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting...')).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getAllByAltText(container, 'Add'));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();

  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

    // 1. Render the app
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    
    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, 'appointment').find(appt =>
      queryByText(appt, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, 'Edit'));
    
    // 4. Confirm that the SHOW mode is visible and 'Archie Cohen' is displayed.
    expect(getByPlaceholderText(appointment, 'Enter Student Name')).toHaveValue('Archie Cohen');
    
    // 6. Change the name of the student.
    fireEvent.change(getByPlaceholderText(appointment, 'Enter Student Name'), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    // 7. Click the save button.
    fireEvent.click(getByText(appointment, 'Save'));
    
    // 8. Confirm that the 'Saving...' text is displayed.
    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();
    
    // 9. Wait until the new student's name is displayed.
    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));
    
    // 10. Confirm that the same amount of open spots are displayed.
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();

  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    // Wait until DOM is loaded before simulating events
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, "appointment")[0];

    // Click on a open timeslot, fill it out and save
    fireEvent.click(getByAltText(appointment, 'Add'));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, 'Save'));
    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();

    // Expect the saving error popup
    await waitForElement(() => getByText(appointment, 'Save problem!'));

    // Expect to get back to the form when closing the error popup
    fireEvent.click(getByAltText(appointment, 'Close'));
    expect(getByPlaceholderText(appointment, 'Enter Student Name')).toBeInTheDocument();

  });
  
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, 'appointment').find(appt =>
      queryByText(appt, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, 'Are you sure you want to delete this?')).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting...')).toBeInTheDocument();

    // 7. Expect to encounter an error with the delete
    await waitForElement(() => getByText(appointment, 'Delete problem!'));

    // 8. Expect to get back to the show mode after closing the error
    fireEvent.click(getByAltText(appointment, 'Close'));
    expect(getByText(appointment, 'Archie Cohen')).toBeInTheDocument();

    // 8. Expect there to still be one spot remaining
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();

  })
  
});
