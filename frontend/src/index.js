import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import './index.css';
import App from './App';
import './App.css';
import {Layout} from 'antd'
import { Typography } from 'antd';
import RollingReturns from './components/rollingReturns'
import StockHoldings from './components/stockHoldings'
import * as serviceWorker from './serviceWorker';

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;


ReactDOM.render(
    <div>
        <Layout>
          <Header>
            <Title style={{textAlign:"center", color: "white"}}> Mutual Fund Utils </Title>
            <Content>
                <Router>
                    <Route exact path="/" component={App} />
                    <Route exact path="/returns" component={RollingReturns} />
                    <Route exact path="/stocks" component={StockHoldings} />
                </Router>
            </Content>
          </Header>
        </Layout>
    </div>,
    document.getElementById('root')
);
