import React from 'react';
import { css } from 'react-emotion';
// First way to import
import { ClipLoader } from 'react-spinners';
import Popup from 'reactjs-popup';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

export default class Loading extends React.Component {

    constructor(){
        super();
    }

    render(){
        return(
            <div className="row">
                <div className="col-sm-5"></div>
                <div className="col-sm-2">
                    <ClipLoader
                        className={override}
                        sizeUnit={"px"}
                        size={100}
                        color={'#123abc'}
                        loading={true}
                    />
                </div>
                <div className="col-sm-5"></div>
            </div>
        )
    }

}