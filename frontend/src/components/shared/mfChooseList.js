import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MfAutocomplete from "./mfAutocomplete";

class MfChooseList extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
           <div>
               {[...Array(this.props.numberOfInputs)].map((e, i) => (
                   <div>
                        <MfAutocomplete
                            mfsArray={this.props.mfsArray}
                            onSelect={this.props.onSelect}
                            index={i}
                        />
                   </div>
               ))}
           </div>
        )
    }
}

MfChooseList.propTypes = {
    numberOfInputs: PropTypes.number.isRequired,
    mfsArray: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired
};

export default MfChooseList
