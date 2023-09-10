import React from 'react';
import loading from '../../images/loading.gif';

const Loading = () => {

    return(<div className='text-center'>
        <img src={loading} alt='please wait, page is loading' />
    </div>)

}

export default Loading;
