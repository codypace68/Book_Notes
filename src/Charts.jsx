import { LineChart, PieChart } from "@mui/x-charts";

function Charts({ formattedNotes, pagesWithNotes, lineChartData }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <LineChart
        xAxis={[{ data: pagesWithNotes }]}
        series={lineChartData}
        width={500}
        height={300}
        colors={["#3F3B6C", "#9F73AB", "#A3C7D6"]}
        sx={() => {
          return {
            ".MuiChartsLegend-series text": {
              fill: "white !important",
            },
            ".MuiChartsAxis-tickLabel": {
              fill: "white !important",
            },
            ".MuiChartsAxis-line": {
              stroke: "white !important",
            },
            ".MuiChartsAxis-tick": {
              stroke: "white !important",
            },
          };
        }}
      />
      <PieChart
        style={{ margin: "1rem", width: "100%" }}
        colors={["#3F3B6C", "#9F73AB", "#A3C7D6"]}
        sx={() => {
          return {
            ".MuiChartsLegend-series text": {
              fill: "white !important",
            },
          };
        }}
        series={[
          {
            innerRadius: 30,
            outerRadius: 100,
            paddingAngle: 5,
            cornerRadius: 5,
            startAngle: -90,
            cx: 150,
            cy: 150,

            data:
              formattedNotes.length > 0
                ? formattedNotes.reduce(
                    (prev, curr) => {
                      if (curr.type === "Note") {
                        prev[0].value += 1;
                      }

                      if (curr.type === "Book Rec") {
                        prev[1].value += 1;
                      }

                      if (curr.type === "Important Note") {
                        prev[2].value += 1;
                      }

                      return prev;
                    },
                    [
                      {
                        id: 0,
                        value: 0,
                        label: "Note",
                      },
                      {
                        id: 1,
                        value: 0,
                        label: "Book Recommendation",
                      },
                      {
                        id: 2,
                        value: 0,
                        label: "Important Note",
                      },
                    ]
                  )
                : [],
          },
        ]}
        width={600}
        height={300}
      />
    </div>
  );
}

export default Charts;
