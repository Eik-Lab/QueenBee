import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getData, getIds } from "./api/data";
import Intro from "../components/Intro";

import Select from "react-select";
import { addDays } from "date-fns";
import { DateRangePicker, DefinedRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { CSVLink } from "react-csv";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// ----

import faker from "faker";

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Temperature data of the chosen beehives",
    },
  },

  parsing: {
    xAxisKey: "measurement_time",
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const testdata = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};
// -----

export const getServerSideProps: GetServerSideProps = async () => {
  const ids = await getIds();
  const idOptions = ids.map((_id: any) => {
    return { value: _id, label: _id };
  });
  return { props: { ids: idOptions } };
};

export default function IndexPage(ids: {
  ids: any[];
}): InferGetServerSidePropsType<typeof getServerSideProps> {
  const [selectedId, setSelectedId] = useState([] as any);

  const [dateSelection, setDateSelection] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const [showCalendar, setShowCalendar] = useState(false);
  const calendar = useRef(null as any);
  const [calendarClicked, setCalendarClicked] = useState(false);

  const [data, setData] = useState([] as any);

  const [isCSVDisabled, setCSVDisabled] = useState(true);

  const locale = "nb-NO";
  const dateOptions: any = { year: "numeric", month: "long", day: "numeric" };

  async function getSensorData() {
    // Api only allows one sensor fetched at a time (for Backend; accept multiple sensors in the future)
    const pi_id: string = selectedId.value;
    // --
    let query = {
      pi_id: pi_id,
      start_time: dateSelection[0].startDate,
      stop_time: dateSelection[0].endDate,
    };

    const res = await getData(query);

    setCSVDisabled(false);
    setData(res);
  }

  function aggregateDataForPlot(data) {
    console.log("HELP, this data needs to be aggregated");
    //https://www.chartjs.org/docs/master/general/data-structures.html

    const datasets = {
      data: {
        datasets: [
          {
            label: "Temperature 1",
            data: data,
            parsing: {
              yAxisKey: "temp1",
            },
          },
          {
            label: "Temperature 2",
            data: data,
            parsing: {
              yAxisKey: "temp2",
            },
          },
          {
            label: "Temperature 3",
            data: data,
            parsing: {
              yAxisKey: "temp3",
            },
          },
          {
            label: "Temperature 4",
            data: data,
            parsing: {
              yAxisKey: "temp4",
            },
          },
        ],
      },
    };

    return datasets;
  }

  useEffect(() => {
    // only add the event listener when the dropdown is opened
    if (!showCalendar) return;
    function handleClick(event: any) {
      if (calendar.current && !calendar.current.contains(event.target)) {
        setShowCalendar(false);
        setCalendarClicked(true);
      }
    }
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
  }, [showCalendar]);

  return (
    <Layout title="BeeCTRL">
      <Intro />
      <div className=" bg-gray-300 mt-4 p-4 rounded-2xl">
        <h3 className="font-semibold md:text-base text-sm">About</h3>
        <p className="italic pointer-events-none md:text-base text-sm">
          The bees are important. Unfortunately, taking care of a bee hive is a
          time-intensive process. Thus, we attempt to make the process less
          time-consuming by developing Bee CTRL. An Open-source monitoring- and
          alerting system which can be installed in a bee hive.{" "}
          <a
            href="https://github.com/Eik-Lab/Bee-CTRL"
            target="_blank"
            className="text-blue-600 text-xs md:text-sm pointer-events-auto"
          >
            Read more at GitHub
          </a>
        </p>
      </div>

      <div className="block lg:flex mt-4">
        <div className=" bg-gray-100 mb-3 lg:rounded-l-2xl lg:rounded-r-none w-full p-3 rounded-2xl">
          {/* Left section - choose your id/ids - checklist with checkboxes */}
          <div className="block lg:flex gap-4">
            <div className="w-full">
              <Select
                options={ids.ids}
                onChange={(selected) => setSelectedId(selected)}
                isMulti={false}
                placeholder="Select your bee hive"
                name="sensors"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
              />
            </div>
            <div className="w-full">
              <button
                className={`${
                  showCalendar ? "border-blue-500" : "border-gray-300"
                } border-2  w-full bg-white h-full rounded-lg hidden lg:block  text-left pl-3 text-gray-500`}
                onClick={() => setShowCalendar(!showCalendar)}
              >
                {calendarClicked
                  ? `fra ${dateSelection[0].startDate.toLocaleDateString(
                      locale,
                      dateOptions
                    )}  til  ${dateSelection[0].endDate.toLocaleDateString(
                      locale,
                      dateOptions
                    )}`
                  : "Select your daterange"}
              </button>
              {showCalendar && (
                <div className="hidden lg:block absolute mt-1" ref={calendar}>
                  <DateRangePicker
                    className="border-2 border-gray-200 rounded-lg shadow-2xl"
                    ranges={dateSelection}
                    onChange={(date) =>
                      setDateSelection([date.selection] as any)
                    }
                  />
                </div>
              )}
              <div className="lg:hidden bg-white mt-2 p-2 rounded-2xl shadow-2x border-2 border-gray-200">
                <DefinedRange
                  ranges={dateSelection}
                  onChange={(date) => setDateSelection([date.selection] as any)}
                />
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => getSensorData()}
          className="bg-yellow-300 px-8 lg:rounded-r-2xl lg:rounded-l-none mb-3 font-bold  py-2 rounded-lg w-full lg:w-auto"
        >
          APPLY
        </button>
      </div>
      <button
        disabled={isCSVDisabled}
        className="w-full  rounded-lg p-3 bg-blue-400 font-bold mb-3 text-white disabled:bg-gray-500"
      >
        <CSVLink
          data={data}
          separator={";"}
          filename={`${selectedId.value}_from_${dateSelection[0].startDate}_to_${dateSelection[0].endDate}`}
        >
          EXPORT AS CSV
        </CSVLink>
      </button>
      <div className="bg-gray-100 w-full h-full p-3 rounded-2xl">
        <Line
          options={options}
          data={data.length ? aggregateDataForPlot(data) : testdata}
          redraw={true}
        />
      </div>
    </Layout>
  );
}
