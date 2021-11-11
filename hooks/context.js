import React from "react";

const context = React.createContext({
  url: "",
  columns: [],
  visible: {visibleColumns : [], visibleValue : 0},
  renameColumns: {},
  specialTreatment: {},
});

export default context;
