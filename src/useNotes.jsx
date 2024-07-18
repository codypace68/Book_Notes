import React, { useState } from "react";

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;

function useNotes(handleAuthReq) {
  const [notes, setNotes] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formattedNotes, setFormattedNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [pagesWithNotes, setPagesWithNotes] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);

  async function listNotes() {
    setNotesLoading(true);
    let response;
    try {
      // Fetch first 10 files
      response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "Principles!A3:F",
      });
    } catch (err) {
      console.error("Error loading the API", err);

      if (err.status === 403) {
        // Unauthorized error, user needs to sign in
        handleAuthReq();
      }
      return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
      console.log("no data found");
      setNotesLoading(false);
      return;
    }

    setNotes(range.values);
    processNotes(range.values);
    setNotesLoading(false);
  }

  function processNotes(rawNotes) {
    const formattedNotes = rawNotes.map((note) => {
      return {
        page: note[2],
        type: note[3],
        noteText: note[4],
        bookRecommended: note[5],
      };
    });

    const pagesWithNotes = formattedNotes.map((note) => note.page);
    const notesPerTypePerPage = formattedNotes.reduce(
      (prev, curr) => {
        if (curr.type === "Note") {
          prev.Note[curr.page] = prev.Note[curr.page] + 1 || 1;
        }

        if (curr.type === "Book Rec") {
          prev["Book Rec"][curr.page] = prev["Book Rec"][curr.page] + 1 || 1;
        }

        if (curr.type === "Important Note") {
          prev["Important Note"][curr.page] =
            prev["Important Note"][curr.page] + 1 || 1;
        }

        return prev;
      },
      {
        Note: {},
        "Book Rec": {},
        "Important Note": {},
      }
    );

    // make an array for each type of note with the number of notes per. For each not type if a page exists but has no notes, add 0
    const pagesWithNotesObj = pagesWithNotes.reduce(
      (prev, curr) => {
        prev[0].data.push(notesPerTypePerPage.Note?.[curr] || null);
        prev[1].data.push(notesPerTypePerPage["Book Rec"]?.[curr] || null);
        prev[2].data.push(
          notesPerTypePerPage["Important Note"]?.[curr] || null
        );

        return prev;
      },
      [
        { data: [], label: "Note" },
        { data: [], label: "Book Rec" },
        { data: [], label: "Important Note" },
      ]
    );

    console.log(
      pagesWithNotes,
      pagesWithNotesObj,
      formattedNotes,
      notesPerTypePerPage
    );

    setLineChartData(pagesWithNotesObj);
    setFormattedNotes(formattedNotes);
    setPagesWithNotes(pagesWithNotes);
  }

  return {
    notes,
    selectedBook,
    formattedNotes,
    notesLoading,
    pagesWithNotes,
    lineChartData,
    listNotes,
    setSelectedBook,
  };
}

export default useNotes;
