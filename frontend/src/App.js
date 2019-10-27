import React from 'react';
import { AutoComplete, InputNumber, Button, Table, Icon } from 'antd';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amounts: [0, 0, 0],
            mfs: ["", "", ""],
            error: null,
            allMfs: [],
            tableRows : [],
            showTable: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addRow = this.addRow.bind(this);
    }
    handleChange(value, n) {
        this.setState({amounts: this.state.amounts.map((item, index) => {
            if(index == n) {
                return value
            } else {
                return item;
            }
        })});
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
    addRow() {
        this.setState({
            mfs: [...this.state.mfs, ""],
            amounts: [...this.state.amounts, 0]
        });
    }

    handleSubmit() {
        let dataSource = [];
        console.log(this.state);
        this.setState({showTable: false});
        fetch("http://localhost:8000/getHoldings", {
            method: 'POST',
            body: JSON.stringify({
                mfs: this.state.mfs,
                amounts: this.state.amounts
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data =>
            this.setState({
                tableRows: data["data"].map(obj => {
	                var rObj = {"stock":obj[0],"value":obj[1]};
	                return rObj
                }),
                showTable: true
            })
        );


    }

    render() {
        const { error, allMfs, tableRows, showTable, mfs } = this.state;
        let tableCols = [{
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
        }, {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        }];
        let data = [];
        return (
            <div style={{textAlign:"center"}}>
                <form onSubmit={this.handleSubmit}>
                    {mfs.map((_,index)  => (
                        <div>
                            <AutoComplete
                                style={{ width: "40vw", padding: 10 }}
                                dataSource={allMfs}
                                placeholder="Select Mutual Fund"
                                filterOption={(inputValue, option) =>
                                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                                onSelect={value => this.onSelect(value, index)}
                            />
                            <InputNumber placeholder="Amount" onChange={value => this.handleChange(value, index)} />
                        </div>
                    ))}

                    <div>
                        <Button style={{margin:10}} type="primary" onClick={this.addRow}>Add row</Button>
                        <Button style={{margin:10}} type="primary" onClick={this.handleSubmit}>Submit</Button>
                    </div>
                </form>
                {showTable ? (
                    <div style={{padding: 10}}>
                        <Table style={{ paddingLeft: "27vw", paddingRight: "27vw" }} dataSource={tableRows} columns={tableCols} />
                    </div>) : null
                }
            </div>


        )
    }
    componentDidMount() {
        fetch("http://localhost:8000/getAllMfs")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        allMfs: Object.keys(result)
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
        }
    }

export default App;
