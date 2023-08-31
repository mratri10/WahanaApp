import axios from 'axios'

type model = 'GET' | 'POST' | 'PUT' | 'DELETE'

const fetchAPI = async (url: string, token: string, type: model, params: any) => {
    switch (type) {
        case 'GET':
            return await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }).then(data => {
                console.info("<<<<<<<<<<<<<<<<<<<<<<<<<< HEADERS >>>>>>>>>>>>>>>>>>>>>>>>>", data.headers)
                console.info("<<<<<<<<<<<<<<<<<<<<<<<<<< CONFIG >>>>>>>>>>>>>>>>>>>>>>>>>", data.config)
                console.info("<<<<<<<<<<<<<<<<<<<<<<<<<< DATA >>>>>>>>>>>>>>>>>>>>>>>>>", data.data)
                return data.data
            }).catch(error => {
                console.info("<<<<<<<<<<<<<<<<<<<<<<<<<< ERROR >>>>>>>>>>>>>>>>>>>>>>>>>>>", error);
            })
        case 'POST':
            return await axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }).then(data => {
                console.info("<<<<<<<<<<<<<<<<<<<<<<<<<< HEADERS >>>>>>>>>>>>>>>>>>>>>>>>>", data.headers)
                console.info("<<<<<<<<<<<<<<<<<<<<<<<<<< CONFIG >>>>>>>>>>>>>>>>>>>>>>>>>", data.config)
                console.info("<<<<<<<<<<<<<<<<<<<<<<<<<< DATA >>>>>>>>>>>>>>>>>>>>>>>>>", data.data)
            }).catch(error => {
                console.info("<<<<<<<<<<<<<<<<<<<<<<<<<< ERROR >>>>>>>>>>>>>>>>>>>>>>>>>>>", error);
            })

        default:
            break;
    }
}

export default fetchAPI