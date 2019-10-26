import React from 'react';
import ReactAutocomplete from 'react-autocomplete/dist/react-autocomplete'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amounts: [0, 0, 0],
            mfs: [0, 0, 0],
            error: null,
            mfToIdDict: {},
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event, n) {
        this.setState({amounts: this.state.amounts.map((item, index) => {
            if(index == n) {
                return event.target.value
            } else {
                return item;
            }
        })});
        event.preventDefault();
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

    handleSubmit(event) {
        console.log(this.state);
        fetch("http://localhost:800/getHoldings",
                {
                    method: 'POST',
                    body: JSON.stringify({
                        mfs: this.state.mfs,
                        amounts: this.state.amounts
                    }),
                    mode: "no-cors",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
        event.preventDefault();
    }

    render() {
        const { error, mfToIdDict } = this.state;
        let data = [];
        for(let k in mfToIdDict) {
            data.push({id: mfToIdDict[k], label: k})
        }
        return (
            <form onSubmit={this.handleSubmit}>
                {[1,2,3].map((_,index)  => (
                    <div>
                        Select MF:
                        <ReactAutocomplete
                            items={data}
                            shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                            getItemValue={item => item.id}
                            renderItem={(item, highlighted) =>
                                <div key={item.id} style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}>
                                    {item.label}
                                </div>
                            }
                            onSelect={mf => this.onSelect(mf, index)}
                        />
                        <label>
                            Amount:
                            <input type="text" name="name" onChange={(e) => this.handleChange(e, index )}/>
                        </label>
                    </div>
                ))}

                <input type="submit" value="Submit" />
            </form>
        )
    }
    componentDidMount() {
        fetch("http://localhost:800/getAllMfs")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        mfToIdDict: result
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
