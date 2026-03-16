import type { TableProps } from 'antd';
import { Button, Input, Layout, Popconfirm, Space, Table } from 'antd';
import React, { useContext } from 'react';
import { EditableCell, EditableRow } from './editableCompnents';
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

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
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
    },
    {
      title: 'Data Type',
      dataIndex: 'dataType',
      editable: true,
      width: 100,
      align: "center",
    },
    {
      title: 'Defaul Value',
      dataIndex: 'defaulValue',
      editable: true,
      width: 100,
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
    const index = newData.findIndex((item) => row.name === item.name);
    const item = newData[index];
    newData.splice(index, 1, {
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