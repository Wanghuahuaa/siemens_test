import { message } from "antd";
import type { DataType } from "./store";

export const dataTypeEnum = {
    BOOL: 'BOOL',
    INT: 'INT',
} as const;


/**
 * 解析 VAR...END_VAR 格式的变量定义文本，提取标准化的变量信息
 * @param {string} text - 包含变量定义的输入文本（如 PLC 变量块）
 * @returns {Array<DataType>} 解析后的变量数组
 */
export const parseVarDefinitions = (text: string): DataType[] => {
    // 1. 提取 VAR ... END_VAR 块（不区分大小写），否则返回空
    const match = text.match(/VAR([\s\S]*?)END_VAR/i);
    if (!match) return [];

    const body = match[1];

    // 2. 按行拆分并处理每行变量定义
    const lines = body
        .split(/\r?\n/) // 支持 Windows/Unix 换行
        .map(line => line.trim())
        .filter(line => line !== '') || [];

    const defaultByType: Record<string, string> = { BOOL: 'TRUE', INT: '0' };

    const res: DataType[] = [];
    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];

        // 3. 去除行首的注释标记（例如：//）
        const noPrefix = line.replace(/^\/\//, '').trim();

        // 4. 抽取行内注释（例如：... // comment）
        const [variablePart, commentPart = ''] = noPrefix.split(/\/\//, 2).map(str => str.trim());

        // 5. 去掉行尾的分号
        const core = variablePart.replace(/;$/, '').trim();
        if (!core) continue;

        // 6. 解析变量定义（name : TYPE := DEFAULT）
        const [nameTypePart, rawDefault = ''] = core.split(':=').map(s => s.trim());
        const [name = '', rawType = ''] = nameTypePart.split(':').map(s => s.trim());

        const type = rawType.toUpperCase();

        if (!type) {
            message.warning(`Format error, cannot parse`);
            return [];
        }

        if (!(type in dataTypeEnum)) {
            message.warning(`Unsupported data type: ${type}`);
            return [];
        }

        // 7. 默认值处理
        let defaultValue = rawDefault;
        if (!defaultValue) {
            defaultValue = defaultByType[type] ?? '';
        } else if (type === dataTypeEnum.BOOL) {
            defaultValue = defaultValue.toUpperCase();
        }

        res.push({
            index: index + 1,
            name: name,
            dataType: type || "",
            defaultValue: defaultValue,
            comment: commentPart,
        });
    }
    // .filter(Boolean) as Array<{ name: string; dataType: string; defaultValue: string; comment: string }>;

    return res;
}


// 示例用法（测试你的变量文本）
// ------------------------------
// const inputText = `VAR
// isReady : BOOL := TRUE; // System ready flag
// counter : INT := 0; // Counter
// temperature : INT;
//  temperature  INT 9;
// isReady : String := "test"
// END_VAR`;

// // 解析并打印结果
// const parsedVariables = parseVarDefinitions(inputText);
// console.log('解析后的变量信息：');
// console.table(parsedVariables);

