import type { TableProps } from 'antd';
import { Button, Input, Layout, message, Popconfirm, Select, Space, Table } from 'antd';
import React, { useContext } from 'react';
import { dataTypeEnum } from './const';
import { EditableCell, EditableRow, type EditableCellProps } from './editableCompnents';
import './index.less';
import { VarTblEditorContext, type DataType, type tblEditorStoreType } from './store';

const { Header, Content, Sider } = Layout;
const { TextArea } = Input;

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>;

const VariableTableEditor: React.FC = () => {
  // const [tableData, setTableData] = useState<DataType[]>([]);
  const { tblEditorStore, tblEditStoreDispatch } = useContext(VarTblEditorContext);
  const { tableData } = tblEditorStore as tblEditorStoreType;
  const setTableData = (newData: DataType[]) => {
    tblEditStoreDispatch({ type: 'tableData', data: newData });
  };

  const handleDelete = (index: React.Key) => {
    const newData = tableData.filter((row) => row.index !== index).map((row, i) => ({
      ...row,
      index: i + 1,
    }))
    setTableData(newData);
  };

  // const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string, editRule?: (newValue: any, record: DataType) => any; })[] = [
  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string } & Pick<EditableCellProps, 'editRule' | 'editPorps'>)[] = [
    {
      title: 'Index',
      dataIndex: 'index',
      width: 100,
      align: "center",
      render: (value) => value,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 100,
      editable: true,
      editRule: (newValue, record, newRecord) => {
        // 输入为空重置为上次的值
        if (!newValue?.trim()) {
          message.warning("Name is required!");
          newRecord.name = record.name;
          return
        }
        // name重复时重置为上次的值
        if (tableData.some(item => item.name.toLowerCase() === newValue.toLowerCase() && item.index !== record.index)) {
          message.warning("Name must be unique!");
          newRecord.name = record.name;
        }
      },
    },
    {
      title: 'Data Type',
      dataIndex: 'dataType',
      editable: true,
      width: 100,
      align: "center",
      editRule: (newValue, record, newRecord) => {
        if (newValue === dataTypeEnum.BOOL) {
          newRecord.defaulValue = "TRUE";
        } else if (newValue === dataTypeEnum.INT) {
          newRecord.defaulValue = "0";
        }
      },
      editPorps: {
        InputComp: Select,
        inputProps: {
          options: [
            { label: dataTypeEnum.BOOL, value: dataTypeEnum.BOOL },
            { label: dataTypeEnum.INT, value: dataTypeEnum.INT },
          ],
        }
      }
    },
    {
      title: 'Defaul Value',
      dataIndex: 'defaulValue',
      editable: true,
      width: 100,
      editRule: (newValue, record, newRecord) => {
        if (record.dataType === dataTypeEnum.BOOL) {
          const val = newValue?.trim()?.toUpperCase();
          if (val !== "TRUE" && val !== "FALSE") {
            message.warning("Default Value must be TRUE or FALSE!");
            newRecord.defaulValue = record.defaulValue;
          }
        } else if (record.dataType === dataTypeEnum.INT) {
          // 限制输入为整数，且范围在 -21474483648 到 2147483647 之间
          // 输入为空
          if (newValue === '' || newValue === null || newValue === undefined) {
            newRecord.defaulValue = '0'
            return
          }
          const MIN = -2147483648;
          const MAX = 2147483647;
          const num = Number(newValue);
          if (isNaN(num) || !Number.isInteger(num)) {
            message.warning("Default Value must be an integer!");
            newRecord.defaulValue = '0'
            return
          }
          if (num < MIN || num > MAX) {
            message.warning("Default Value must be between -2147483648 and 2147483647!");
            newRecord.defaulValue = '0'
            return
          }
          newRecord.defaulValue = Number(newValue) + ""
        }
      },
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      editable: true,
      width: 150,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      width: 100,
      align: "center",
      render: (_, record) =>
        tableData.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.index)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      index: tableData.length + 1,
      name: "",
      dataType: "",
      defaulValue: "",
      comment: "",
    };
    setTableData([...tableData, newData]);
  };

  const handleSave = (row: DataType) => {
    const newData = [...tableData];
    const rowIndex = newData.findIndex((item) => row.index === item.index);
    const item = newData[rowIndex];
    newData.splice(rowIndex, 1, {
      ...item,
      ...row,
    });
    setTableData(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        editRule: col.editRule,
        editPorps: col.editPorps
      }),
    };
  });

  return (
    <Layout className='variable-table-editor' hasSider>
      <Layout className='left-box'>
        <Header>
          <Button onClick={handleAdd} type="primary" style={{ marginBottom: 8 }}>
            Add
          </Button>
        </Header>
        <Content className='table-content'>
          <Table<DataType>
            components={components}
            rowKey={"index"}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={tableData}
            columns={columns as ColumnTypes}
            pagination={false}
          />
        </Content>
      </Layout>
      <Sider width={300} className='right-box'>
        <Space size={8} style={{ marginBottom: 8 }}>
          <Button>Import</Button>
          <Button>Export</Button>
        </Space>
        <TextArea autoSize={{ minRows: 5 }} />
      </Sider>
    </Layout>
  )
};

export default VariableTableEditor;