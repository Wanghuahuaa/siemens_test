export interface GlobalContainerProps {
  children: React.ReactNode;
}

export interface DataType {
  index: number;
  name: string;
  dataType: string;
  defaulValue: string;
  comment: string;
}

export interface tblEditorStoreType {
  tableData: DataType[];
}

export interface tblEditorStoreAction {
  type: keyof tblEditorStoreType;
  data: tblEditorStoreType[keyof tblEditorStoreType];
}