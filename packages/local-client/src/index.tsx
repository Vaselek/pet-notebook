import 'bulmaswatch/superhero/bulmaswatch.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {createRoot} from 'react-dom/client'
import {Provider} from 'react-redux'
import {store} from './state/store'
import CellList from './components/cell-list';


const App = () => {
  return (
    <Provider store={store}>
      <div>
        <CellList/>
      </div>
    </Provider>
  )
}

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(<App/>)
