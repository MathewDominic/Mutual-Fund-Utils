import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import MfChooseList from './shared/mfChooseList';
import {Button, InputNumber} from "antd";

class RollingReturns extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // To avoid unnecessary update keep all options in the state.
            chartOptions: {
                tooltip: {
                    shared: true
                },
                title: {
                    text: 'Rolling return comparator'
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
            timeFrame: '',
            mfs: ['', ''],
            showChart: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(timeFrame) {
        this.setState({timeFrame})
    }
    handleSubmit() {
        this.setState({showChart: false});
        fetch("http://localhost:8000/getRollingReturns", {
            method: 'POST',
            body: JSON.stringify({
                mfs: this.state.mfs,
                timeFrame: this.state.timeFrame
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
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
                showChart: true
            })
        });
    }
    onSelect(mf, n) {
        debugger;
        this.setState({mfs: this.state.mfs.map((item, index) => {
            if(index == n) {
                return mf
            } else {
                return item;
            }
        })});
    }

    render() {
        const { chartOptions, showChart } = this.state;
        let allMfsArray = Object.values(this.props.mfsDict).sort();
        return (
            <div>
                <MfChooseList numberOfInputs={2} mfsArray={allMfsArray} onSelect={this.onSelect}/>
                <InputNumber placeholder="Enter time frame in years" onChange={this.handleChange} />
                <Button style={{margin:10}} type="primary" onClick={this.handleSubmit}>Submit</Button>
                {showChart && <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                />}
            </div>
        )
    }
}

RollingReturns.propTypes = { mfsDict: PropTypes.object.isRequired };

export default RollingReturns
