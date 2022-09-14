//import axios
import axios from 'axios'

const Api = axios.create({
    //set default endpoint API
    baseURL: 'https://todo.api.devcode.gethired.id'
})

export default Api