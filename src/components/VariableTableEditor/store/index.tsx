import React, { useReducer } from "react";
import { type DataType, type GlobalContainerProps, type tblEditorStoreAction, type tblEditorStoreType } from "./index.d";

// 导出类型
export type { DataType, GlobalContainerProps, tblEditorStoreAction, tblEditorStoreType } from "./index.d";

export const dataInit: tblEditorStoreType = {
  tableData: [] as DataType[],
};

export const VarTblEditorContext = React.createContext({} as any);

export const VarTblEditorContainer = (props: GlobalContainerProps) => {
  const reducer = (prevState: tblEditorStoreType, act: tblEditorStoreAction) => {
    let newState: tblEditorStoreType = { ...prevState };
    const { type, data } = act;
    if (!type) {
      new Error("not type");
    }
    if (type in dataInit) {
      newState[type] = data;
    }
    return newState;
  };

  const [tblEditorStore, tblEditStoreDispatch] = useReducer(reducer, dataInit);

  return (
    <VarTblEditorContext.Provider
      value={{
        tblEditorStore,
        tblEditStoreDispatch,
      }}
    >
      {props.children}
    </VarTblEditorContext.Provider>
  );
};

export default VarTblEditorContainer;
