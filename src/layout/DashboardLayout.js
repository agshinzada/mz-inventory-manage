import { Tab } from "@headlessui/react";
import classNames from "classnames";
import { Outlet, useNavigate } from "react-router-dom";

function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="w-fit sm:px-0 mx-auto mb-10">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl mb-3 bg-slate-500 dark:bg-gray-500 p-1">
            <Tab
              key={1}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 desktop:px-14 mobile:px-4 desktop:text-sm mobile:text-xs font-medium leading-5 text-black",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 dark:ring-offset-0 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white dark:text-slate-100 dark:bg-gray-800 shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
              onClick={() => navigate("/dashboard")}
            >
              {"OFİS"}
            </Tab>
            <Tab
              key={2}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 desktop:px-14 mobile:px-4 desktop:text-sm mobile:text-xs font-medium leading-5 text-black",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 dark:ring-offset-0 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white dark:text-slate-100 dark:bg-gray-800 shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
              onClick={() => navigate(`warehouse`)}
            >
              {"ANBAR"}
            </Tab>
            <Tab
              key={3}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 desktop:px-14 mobile:px-4 desktop:text-sm mobile:text-xs font-medium leading-5 text-black",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 dark:ring-offset-0 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white dark:text-slate-100 dark:bg-gray-800 shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
              onClick={() => navigate(`transport`)}
            >
              {"NƏQLİYYAT"}
            </Tab>
          </Tab.List>
        </Tab.Group>
      </div>
      <Outlet />
    </div>
  );
}

export default DashboardLayout;
