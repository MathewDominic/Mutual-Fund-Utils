import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import MfChooseList from './shared/mfChooseList';
import {Button, InputNumber} from "antd";
import { Typography } from 'antd';
import ApiClient from '../services/apiClient'

const { Title } = Typography;


class RollingReturns extends Component {
    constructor(props) {
        super(props);
        this.apiClient = new ApiClient();
        this.state = {
            chartOptions: {
                tooltip: {
                    shared: true
                },
                title: {
                    text: 'Rolling return comparator'
                },
                subtitle: {
                    text: 'Data point shows rolling returns for period ending on that date',
                },
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: "Date"
                    }

                },
                yAxis: {
                    title: {
                        text: 'Rolling returns'
                    }
                },
                series: []

            },
            allMfsDict: {},
            timeFrame: '',
            mfs: ['', ''],
            showChart: false,
            loading: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(timeFrame) {
        this.setState({timeFrame})
    }
    handleSubmit() {
        this.setState({showChart: false, loading: true});
        this.apiClient.post(
            "rollingReturns",
            {
                mfs: this.state.mfs,
                timeFrame: this.state.timeFrame
            },
            (data) => {
                let chartData = [];
                for(let mf in data) {
                    chartData.push({
                        "data": data[mf],
                        "type": "line",
                        "name": mf
                    });
                }
                this.setState({
                    chartOptions: {
                        ...this.state.chartOptions,
                        series: chartData
                    },
                    showChart: true,
                    loading: false
                })
            }
        );
    }
    onSelect(mf, n) {
        this.setState({mfs: this.state.mfs.map((item, index) => {
            if(index == n) {
                return mf
            } else {
                return item;
            }
        })});
    }

    render() {
        const { chartOptions, showChart, loading, allMfsDict } = this.state;
        let allMfsArray = Object.values(allMfsDict).sort();
        return (
            <div style={{textAlign:"center"}}>
                <Title level={4}> Compare Rolling returns of MFs for different time frames </Title>
                <MfChooseList numberOfInputs={2} mfsArray={allMfsArray} onSelect={this.onSelect}/>
                <InputNumber style={{width: "200px"}}placeholder="Enter time frame in years" onChange={this.handleChange} />
                <Button style={{margin:10}} type="primary" onClick={this.handleSubmit} loading={loading}>Submit</Button>
                {showChart && <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                />}
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

RollingReturns.propTypes = {
    mfsDict: PropTypes.object.isRequired
};

export default RollingReturns
