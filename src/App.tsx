import './App.css'
import VariableTableEditor from './components/VariableTableEditor'
import VarTblEditorContainer from './components/VariableTableEditor/store'

function App() {

  return (
    <div className="app">
      <VarTblEditorContainer>
        <VariableTableEditor></VariableTableEditor>
      </VarTblEditorContainer>
    </div>
  )
}

export default App
