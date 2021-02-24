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
  
    // 1. Render the application
    const { container } = render(<Application />);

    // 2. Wait until DOM is loaded before simulating events
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, "appointment")[0];

    // 3. Click on an open timeslot
    fireEvent.click(getByAltText(appointment, 'Add'));

    // 4. Input a student name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. Select an interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click on 'save'
    fireEvent.click(getByText(appointment, 'Save'));

    // 7. Expect the SAVING mode to load
    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();

    // 8. Wait for the API call to resolve, then check if the student is added
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // 9. Check if there are no longer any spots remaining for Monday
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();

  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
 
    // 1. Render the Application
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Delete" button on the booked appointment
    const appointment = getAllByTestId(container, 'appointment').find(appt =>
      queryByText(appt, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown
    expect(getByText(appointment, 'Are you sure you want to delete this?')).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed
    expect(getByText(appointment, 'Deleting...')).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed
    await waitForElement(() => getAllByAltText(container, 'Add'));

    // 8. Check that Monday now has 2 spots remaining
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();

  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

    // 1. Render the application
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    
    // 3. Click the "Edit" button on the booked appointment
    const appointment = getAllByTestId(container, 'appointment').find(appt =>
      queryByText(appt, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, 'Edit'));
    
    // 4. Confirm that the SHOW mode is visible and "Archie Cohen" is displayed
    expect(getByPlaceholderText(appointment, 'Enter Student Name')).toHaveValue('Archie Cohen');
    
    // 6. Change the name of the student
    fireEvent.change(getByPlaceholderText(appointment, 'Enter Student Name'), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    // 7. Click the save button
    fireEvent.click(getByText(appointment, 'Save'));
    
    // 8. Confirm that the "Saving..." text is displayed
    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();
    
    // 9. Wait until the new student's name is displayed
    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));
    
    // 10. Confirm that the same amount of open spots are displayed
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();

  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    // 1. Render the applicaiton
    const { container } = render(<Application />);

    // 2. Wait until DOM is loaded before simulating events
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, "appointment")[0];

    // 3. Click on an open timeslot
    fireEvent.click(getByAltText(appointment, 'Add'));

    // 4. Input a student name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. Select an interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 5. Save the new appointment
    fireEvent.click(getByText(appointment, 'Save'));

    // 6. Expect to see the SAVING module
    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();

    // 7. Wait for the saving error popup
    await waitForElement(() => getByText(appointment, 'Save problem!'));

    // 8. Click on the close icon
    fireEvent.click(getByAltText(appointment, 'Close'));

    // 9. Expect to be returned to the FORM mode
    expect(getByPlaceholderText(appointment, 'Enter Student Name')).toBeInTheDocument();

    // 10. Expect there to still be one spot remaining
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();

  });
  
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Delete" button on the booked appointment
    const appointment = getAllByTestId(container, 'appointment').find(appt =>
      queryByText(appt, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown
    expect(getByText(appointment, 'Are you sure you want to delete this?')).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed
    expect(getByText(appointment, 'Deleting...')).toBeInTheDocument();

    // 7. Expect to encounter an error with the delete
    await waitForElement(() => getByText(appointment, 'Delete problem!'));

    // 8. Expect to get back to the show mode after closing the error
    fireEvent.click(getByAltText(appointment, 'Close'));
    expect(getByText(appointment, 'Archie Cohen')).toBeInTheDocument();

    // 9. Expect there to still be one spot remaining
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();

  })
  
});
