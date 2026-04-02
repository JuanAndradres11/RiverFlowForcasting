import { useState } from "react";
import { tabsData } from "../data/cauveryData";

export default function CatchmentTabs() {
  const [activeTab, setActiveTab] = useState<keyof typeof tabsData>("info");
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">

      {/* 🔘 Tabs */}
      <div className="flex gap-4 border-b pb-2">
        {Object.keys(tabsData).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab as keyof typeof tabsData);
              setExpanded(false); // reset collapse when switching tabs
            }}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tabsData[tab as keyof typeof tabsData].title}
          </button>
        ))}
      </div>

      {/* 📄 Content */}
      <div className="text-sm text-slate-700">

        {/* 🔵 INFO TAB */}
        {activeTab === "info" && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {tabsData.info.fields.map((field, i) => (
              <p key={i}>
                <b>{field.label}:</b> {field.value}
              </p>
            ))}
          </div>
        )}

        {/* 🔴 LIST TABS (Catchments + Dams) */}
        {(activeTab === "catchments" || activeTab === "dams") && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">

            {(expanded
              ? tabsData[activeTab].items
              : tabsData[activeTab].items.slice(0, 5)
            ).map((item, i) => (
              <p key={i}>• {item}</p>
            ))}

            {tabsData[activeTab].items.length > 5 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-blue-600 text-xs mt-2"
              >
                {expanded ? "Show Less" : "Show More"}
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  );
}