import itemRoute from './itemRoute'
import listRoute from './listRoute'
import rootRoute from './rootRoute'

export default rootRoute.addChildren([listRoute, itemRoute])
