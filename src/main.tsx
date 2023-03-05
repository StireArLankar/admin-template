import ReactDOM from 'react-dom/client'

import App from '@/App'

const element = document.getElementById('root')

if (element) {
	ReactDOM.createRoot(element).render(<App />)
}
