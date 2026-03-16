import type { GetRef, InputRef } from 'antd';
import { Form, Input } from "antd";
import React, { useContext, useEffect, useRef, useState } from 'react';
import type { DataType } from './store';

type FormInstance<T> = GetRef<typeof Form<T>>;

interface EditableRowProps {
  index: number;
}

const EditableContext = React.createContext<FormInstance<any> | null>(null);

export const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof DataType;
  record: DataType;
  handleSave: (record: DataType) => void;
  editRule?: (newValue: any, record: DataType, newRecord: DataType) => any;
  editPorps?: {
    InputComp?: React.ComponentType; // 可自定义输入组件，默认为Input
    inputProps?: any; // 输入组件的props
  }
}

export const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  editRule,
  editPorps,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  // if (dataIndex === "name") console.log(28, restProps)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      if (editRule) {
        // values[dataIndex] = editRule(values[dataIndex], record, newRecord);
        editRule(values[dataIndex], record, values);
      }
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    if (childNode = editing) {
      const { InputComp, inputProps } = editPorps || {};
      const InputNode = InputComp || Input
      // let inputNode = <Input ref={inputRef} onPressEnter={save} onBlur={save} {...inputProps}/>
      // if(InputComp){
      //  inputNode = <InputComp ref={inputRef} onPressEnter={save} onBlur={save} {...inputProps}/>
      // }
      childNode = (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
        // rules={[{ required: true, message: `${title} is required.` }]}
        >
          <InputNode ref={inputRef} onPressEnter={save} onBlur={save} {...inputProps} />
        </Form.Item>
      )
    } else {
      childNode = <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    }
  }

  return <td {...restProps}>{childNode}</td>;
};