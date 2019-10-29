import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {AutoComplete} from "antd";
import RollingReturns from "../rollingReturns";

class MfAutocomplete extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <AutoComplete
                style={{ width: "40vw", padding: 10 }}
                dataSource={this.props.mfsArray}
                placeholder="Select Mutual Fund"
                filterOption={(inputValue, option) =>
                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                onSelect={value => this.props.onSelect(value, this.props.index)}
            />
        )
    }
}

MfAutocomplete.propTypes = {
    index: PropTypes.number.isRequired,
    mfsArray: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired
};

export default MfAutocomplete
