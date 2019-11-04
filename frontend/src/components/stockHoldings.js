import React from 'react';
import { AutoComplete, InputNumber, Button, Table, PageHeader } from 'antd';
import { Typography } from 'antd';
import ApiClient from '../services/apiClient'

const { Title } = Typography;

class StockHoldings extends React.Component {
    constructor(props) {
        super(props);
        this.apiClient = new ApiClient();
        this.state = {
            amounts: [0, 0, 0],
            mfs: ["", "", ""],
            allMfsDict: {},
            tableRows : [],
            showTable: false,
            loading: false
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
        this.setState({showTable: false, loading: true});
        this.apiClient.post(
            "stockHoldings",
            {
                mfs: this.state.mfs,
                amounts: this.state.amounts
            },
            (data) => {
                this.setState({
                    tableRows: data.map((obj, index) => {
                        return {
                            "key": index,
                            "stock": obj[0],
                            "value": obj[1]["value"],
                            "mfs": JSON.stringify(obj[1]["mfs"])
                        }
                    }),
                    showTable: true,
                    loading: false
                })
            }
        );
    }

    render() {
        const { allMfsDict, tableRows, showTable, loading, mfs } = this.state;
        let tableCols = [{
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
        }, {
            title: 'Amount',
            dataIndex: 'value',
            key: 'value',
        }];


        const expandedRowRender = (record) => {
            const columns = [
                { title: 'Mutual Fund', dataIndex: 'mf', key: 'date' },
                { title: 'Amount', dataIndex: 'amount', key: 'name' },
            ];

            const data = [];
            const mfToAmount = JSON.parse(record["mfs"]);
            for (let i = 0; i < Object.keys(mfToAmount).length; i++) {
                data.push({
                    key: i,
                    mf: allMfsDict[Object.keys(mfToAmount)[i]],
                    amount: mfToAmount[Object.keys(mfToAmount)[i]],
                });
            }
            return <Table columns={columns} dataSource={data} pagination={false}/>;
        };


        let allMfsArray = Object.values(allMfsDict).sort();
        return (

            <div style={{textAlign:"center"}}>
                <Title level={4}> Enter amount invested in each MF and see how much amount is invested in individual stocks</Title>
                <form onSubmit={this.handleSubmit}>
                    {mfs.map((_,index)  => (
                        <div>
                            <AutoComplete
                                style={{ width: "400px", padding: 10 }}
                                dataSource={allMfsArray}
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
                        <Button style={{margin:10}} type="primary" onClick={this.handleSubmit} loading={loading}>Submit</Button>
                    </div>
                </form>
                {showTable && (
                    <div style={{padding: 10}}>
                        <Table
                            style={{ paddingLeft: "27vw", paddingRight: "27vw" }}
                            dataSource={tableRows}
                            columns={tableCols}
                            expandedRowRender={expandedRowRender}
                        />
                    </div>)
                }
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

export default StockHoldings;
