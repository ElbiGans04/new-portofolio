import React from "react";

export const Context = React.createContext({
    modal: null,
    url: "",
    columns: [],
    visible: {
      visibleValue: 0,
      visibleColumns: ["_id", "__v"],
    },
});
