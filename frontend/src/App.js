import React from 'react';
import { Link } from 'react-router-dom'
import { Typography } from 'antd';
import ApiClient from './services/apiClient'

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.apiClient = new ApiClient();
    }


    render() {
        // const {  allMfsDict } = this.state;
        // let allMfsArray = Object.values(allMfsDict).sort();
        return (

            <div style={{textAlign:"center"}}>
                <div>
                    <Link to='/stocks/'>Stock Holdings</Link>
                </div>
                <div>
                    <Link to='/returns/'>Rolling Returns Comparator</Link>
                </div>
            </div>


        )
    }
    componentDidMount() {
        this.apiClient.get(
            "getAllMfs",
            (result) => {
                this.setState({
                    allMfsDict: result
                });
            }
        );
    }
}

export default App;
