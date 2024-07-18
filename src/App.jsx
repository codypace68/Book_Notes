import { LineChart, PieChart } from "@mui/x-charts";
import "./App.css";
import useAuth from "./useAuth";
import useNotes from "./useNotes";
import Charts from "./Charts";

function App() {
  const { useAuthReq } = useAuth();

  const {
    listNotes,
    formattedNotes,
    notesLoading,
    pagesWithNotes,
    lineChartData,
  } = useNotes(useAuthReq);

  return (
    <>
      <div className="card">
        <button style={{ margin: "1rem" }} onClick={listNotes}>
          Fetch/Refresh Notes
        </button>
        <Charts
          formattedNotes={formattedNotes}
          pagesWithNotes={pagesWithNotes}
          lineChartData={lineChartData}
        />
        <div className="container">
          {notesLoading && <p>Loading Notes...</p>}
          {!notesLoading && formattedNotes.length === 0 && (
            <p>No notes found</p>
          )}
          {!notesLoading && formattedNotes.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Type</th>
                  <th style={{ width: "500px" }}>Note Text</th>
                  <th>Book Recommended</th>
                </tr>
              </thead>
              <tbody>
                {formattedNotes.map((note, index) => (
                  <tr key={index}>
                    <td>{note?.page}</td>
                    <td>{note?.type}</td>
                    <td
                      dangerouslySetInnerHTML={{
                        __html: note?.noteText?.replace(/\n/g, "<br />"),
                      }}
                    ></td>
                    <td
                      dangerouslySetInnerHTML={{
                        __html: note?.bookRecommended?.replace(/\n/g, "<br />"),
                      }}
                    ></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default App;

// [
//   { id: 0, value: 10, label: "series A" },
//   { id: 1, value: 15, label: "series B" },
//   { id: 2, value: 20, label: "series C" },
// ]
